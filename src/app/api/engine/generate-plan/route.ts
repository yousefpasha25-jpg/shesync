import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { planRateLimit } from "@/lib/rate-limit";
import { extractJSON } from "@/lib/utils";

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

/** Minimum cooldown between plan generations (in milliseconds). */
const PLAN_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/** Retry configuration for Gemini API calls. */
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2s → 4s → 8s

/** If Google demands we wait longer than this, abort immediately. */
const MAX_ACCEPTABLE_WAIT_S = 10;

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function sanitize(value: string, maxLength = 100): string {
  return value.replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLength).trim();
}

function isRateLimitError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("resource_exhausted");
}

/**
 * Parse "Please retry in Xs" / "retry after Xs" from a Google API error.
 * Returns the number of seconds, or null if not found.
 */
function parseRetryDelay(error: unknown): number | null {
  const msg = error instanceof Error ? error.message : String(error);
  // Matches patterns like "Please retry in 53s", "retry after 53 seconds", "retry in 53.2s"
  const match = msg.match(/retry\s+(?:in|after)\s+(\d+(?:\.\d+)?)\s*s/i);
  return match ? parseFloat(match[1]) : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff on 429 errors.
 * FAIL-FAST: If Google demands a wait > MAX_ACCEPTABLE_WAIT_S, throw immediately.
 */
async function retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Not a rate-limit error → throw immediately
      if (!isRateLimitError(error)) throw error;

      // Check if Google is asking us to wait too long
      const demandedDelay = parseRetryDelay(error);
      if (demandedDelay !== null && demandedDelay > MAX_ACCEPTABLE_WAIT_S) {
        console.warn(`Gemini demanded ${demandedDelay}s wait — exceeds ${MAX_ACCEPTABLE_WAIT_S}s limit. Aborting retries.`);
        throw error; // Fail fast
      }

      // Out of retries → throw
      if (attempt === MAX_RETRIES) throw error;

      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Gemini 429 — retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`);
      await sleep(delay);
    }
  }
  throw new Error("Retry loop exited unexpectedly");
}

function isValidPlanStructure(data: unknown): data is { weeks: Array<{ weekNumber: number; days: unknown[] }> } {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.weeks) || obj.weeks.length === 0) return false;
  return obj.weeks.every((week: unknown) => {
    if (!week || typeof week !== 'object') return false;
    const w = week as Record<string, unknown>;
    return typeof w.weekNumber === 'number' && Array.isArray(w.days) && w.days.length > 0;
  });
}

// ─────────────────────────────────────────────
// Mock AI Plan (dev mode — bypasses Gemini)
// ─────────────────────────────────────────────

function generateMockPlan(): { weeks: Array<Record<string, unknown>> } {
  const phases = ["follicular", "ovulatory", "luteal", "menstrual"] as const;
  const workoutTypes = ["strength", "hiit", "yoga", "rest", "cardio", "mobility"] as const;

  const exerciseBank = [
    { name: "Air Squats", sets: 3, reps: "15", rest: "45s", rpe: 6 },
    { name: "Push-Ups", sets: 3, reps: "10-12", rest: "60s", rpe: 7 },
    { name: "Glute Bridges", sets: 3, reps: "15", rest: "30s", rpe: 5 },
    { name: "Plank Hold", sets: 3, reps: "30s", rest: "30s", rpe: 6 },
    { name: "Dumbbell Rows", sets: 4, reps: "10", rest: "60s", rpe: 7 },
    { name: "Lunges", sets: 3, reps: "12 each", rest: "45s", rpe: 6 },
    { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "30s", rpe: 5 },
    { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "30s", rpe: 8 },
    { name: "Deadlifts", sets: 4, reps: "8", rest: "90s", rpe: 8 },
    { name: "Cat-Cow Stretch", sets: 1, reps: "10", rest: "0s", rpe: 2 },
    { name: "Warrior Pose Flow", sets: 1, reps: "5 min", rest: "0s", rpe: 3 },
    { name: "Shoulder Press", sets: 3, reps: "10", rest: "60s", rpe: 7 },
  ];

  const meals = [
    "Grilled chicken breast with quinoa and roasted vegetables",
    "Salmon fillet with sweet potato mash and steamed broccoli",
    "Lentil soup with whole grain bread and mixed green salad",
    "Greek yogurt parfait with berries, granola, and honey",
    "Turkey and avocado wrap with spinach and hummus",
    "Baked cod with brown rice and sautéed asparagus",
    "Chickpea stir-fry with bell peppers and basmati rice",
  ];

  return {
    weeks: Array.from({ length: 4 }, (_, weekIdx) => ({
      weekNumber: weekIdx + 1,
      phase: phases[weekIdx],
      philosophy: `Week ${weekIdx + 1} focuses on ${phases[weekIdx]} phase optimization — adapting intensity and recovery to your hormonal cycle.`,
      days: Array.from({ length: 7 }, (_, dayIdx) => {
        const isRest = dayIdx === 6;
        const type = isRest ? "rest" : workoutTypes[dayIdx % 5];
        const exerciseCount = isRest ? 1 : 4;
        const startIdx = (weekIdx * 3 + dayIdx * 2) % exerciseBank.length;

        return {
          date: `Day ${dayIdx + 1}`,
          workout: {
            title: isRest ? "Active Recovery & Mobility" : `${type.charAt(0).toUpperCase() + type.slice(1)} Protocol ${dayIdx + 1}`,
            type,
            durationMinutes: isRest ? 20 : 30 + (dayIdx % 3) * 15,
            exercises: Array.from({ length: exerciseCount }, (_, i) =>
              exerciseBank[(startIdx + i) % exerciseBank.length]
            ),
          },
          nutrition: {
            focus: isRest ? "Recovery & anti-inflammation" : "Performance fuel",
            targetMacros: { protein: "120g", carbs: "180g", fats: "55g" },
            suggestedMeal: meals[(weekIdx + dayIdx) % meals.length],
          },
        };
      }),
    })),
  };
}

// ─────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await planRateLimit.limit(user.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    // ── Rate-limit guard: return cached plan if recent ──
    const { data: existingPlan } = await supabase
      .from('user_plans')
      .select('plan_data, updated_at')
      .eq('user_id', user.id)
      .single();

    if (existingPlan?.plan_data && existingPlan.updated_at) {
      const lastGenerated = new Date(existingPlan.updated_at).getTime();
      if (Date.now() - lastGenerated < PLAN_COOLDOWN_MS) {
        return NextResponse.json(existingPlan.plan_data);
      }
    }

    // ══════════════════════════════════════════
    // MOCK DEV MODE — bypass Gemini entirely
    // ══════════════════════════════════════════
    // Mock mode is strictly dev-only — never active in production
    const USE_MOCK = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_USE_MOCK_AI === "true";
    if (USE_MOCK) {
      console.warn("🧪 MOCK AI MODE — returning hardcoded plan (2s simulated latency)");
      await sleep(2000);
      const mockPlan = generateMockPlan();

      await supabase.from('user_plans').upsert({
        user_id: user.id,
        plan_data: mockPlan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      return NextResponse.json(mockPlan);
    }

    // ══════════════════════════════════════════
    // PRODUCTION — real Gemini call
    // ══════════════════════════════════════════
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("FATAL: AI API key missing in runtime");
      return NextResponse.json({ error: "AI Engine temporarily unavailable." }, { status: 503 });
    }

    const client = new GoogleGenAI({ apiKey });

    // ── Fetch user profile ──
    const { data: profile } = await supabase.from('profiles').select('id, full_name, age, fitness_level, fitness_goals, equipment_access').eq('user_id', user.id).maybeSingle();
    const { data: healthMetrics } = await supabase.from('health_metrics').select('weight, height, cycle_tracking_enabled, last_period_date, is_pregnant, pregnancy_weeks').eq('user_id', user.id).maybeSingle();

    const userName = sanitize(profile?.full_name || "Valued User", 50);
    const age = profile?.age || 25;
    const height = healthMetrics?.height || 165;
    const weight = healthMetrics?.weight || 60;
    const goal = sanitize(profile?.fitness_goals?.primary || "overall wellness", 60);
    const equipmentList = Array.isArray(profile?.equipment_access?.equipment)
      ? profile.equipment_access.equipment.map((e: string) => sanitize(e, 40)).join(", ")
      : "no equipment (bodyweight only)";
    const cycleTracking = healthMetrics?.cycle_tracking_enabled ? "Enabled" : "Disabled";
    const pregnancy = healthMetrics?.is_pregnant ? "Pregnant" : "Not Pregnant";

    const systemPrompt = `You are the "Awdan Intelligent Engine", the elite clinical generation logic for Awdan Vibes.
Your objective: Generate a world-class, 4-week hormonal-syncing fitness and nutrition master protocol.

<USER_DATA_PROFILE>
- Name: ${userName}
- Biometrics: ${height}cm / ${weight}kg (Age: ${age})
- Status: ${pregnancy} | Hormonal Syncing: ${cycleTracking}
- Primary Objective: ${goal}
- Equipment Infrastructure: ${equipmentList}
</USER_DATA_PROFILE>

PRINCIPLES OF ELITE CURATION:
1. HORMONAL SYNCING (The Awdan Method):
   - Week 1 (Follicular): Focus on high-intensity strength, building muscle, and metabolic conditioning.
   - Week 2 (Ovulatory): Peak strength and energy. High-impact or heavy lifting.
   - Week 3 (Luteal): Shift to steady-state cardio and moderate resistance. Manage inflammation and cravings.
   - Week 4 (Menstrual): Active recovery, deloading, yoga, and mobility. Respect low energy states.

2. PROGRESSIVE OVERLOAD:
   - Ensure a logical progression in volume (sets/reps) or intensity (RPE) from Week 1 to Week 3, followed by a deload in Week 4.

3. CLINICAL NUTRITION (MENA Focus):
   - Curate meals suitable for the Middle Eastern region (Olive oil, lean lamb/chicken, lentils, chickpeas, fresh mezze-style salads).
   - Balance macros strictly based on her goal: ${goal}.

OUTPUT SPECIFICATION:
- You MUST return ONLY a raw JSON object. No markdown, no commentary.
- Structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "phase": "follicular",
      "philosophy": "Sophisticated clinical rationale for this week.",
      "days": [
        {
          "date": "Day 1",
          "workout": {
            "title": "Bespoke Workout Title",
            "type": "strength", 
            "durationMinutes": 45,
            "exercises": [
              { "name": "Precision Exercise Name", "sets": 3, "reps": "12", "rest": "60s", "rpe": 7 }
            ]
          },
          "nutrition": {
            "focus": "Specific metabolic focus (e.g., Insulin sensitivity)",
            "targetMacros": { "protein": "140g", "carbs": "160g", "fats": "50g" },
            "suggestedMeal": "Culturally relevant, professional meal description"
          }
        }
      ]
    }
  ]
}

RESTRAINTS:
- 4 weeks total. 7 days per week.
- Exercise types: strength, hiit, yoga, rest, cardio, mobility.
- RPE: Scale 1-10.`;

    // ── Gemini call with exponential backoff + fail-fast ──
    const response = await retryWithBackoff(() =>
      client.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      })
    );

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      return NextResponse.json({ error: "AI Engine returned an empty response. Please try again." }, { status: 502 });
    }

    try {
      const plan = extractJSON<any>(responseText);

      if (!isValidPlanStructure(plan)) {
        console.error("AI returned invalid plan structure:", JSON.stringify(plan).slice(0, 500));
        return NextResponse.json(
          { error: "The AI generated an invalid plan. Please try again." },
          { status: 502 }
        );
      }

      const { error: insertError } = await supabase
        .from('user_plans')
        .upsert({
          user_id: user.id,
          plan_data: plan,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (insertError) console.error("Supabase Plan Persist Error:", insertError);

      return NextResponse.json(plan);

    } catch (parseError) {
      console.error("AI response JSON parse error:", parseError);
      console.error("Raw AI response (first 500 chars):", responseText.slice(0, 500));
      return NextResponse.json(
        { error: "The AI response could not be processed. Please try again." },
        { status: 502 }
      );
    }

  } catch (error: unknown) {
    console.error("AI Engine Error:", error);

    if (isRateLimitError(error)) {
      const demanded = parseRetryDelay(error);
      const detail = demanded
        ? `Google demanded ${demanded}s wait (limit: ${MAX_ACCEPTABLE_WAIT_S}s).`
        : "All retries exhausted.";
      console.warn(`429 fail-fast: ${detail}`);

      return NextResponse.json(
        { error: "The AI is currently processing high volume. Please try again in 1 minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "AI Engine encountered an issue. Please try again later." },
      { status: 500 }
    );
  }
}

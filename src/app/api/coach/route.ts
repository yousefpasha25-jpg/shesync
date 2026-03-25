import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimit } from "@/lib/rate-limit";
import { extractJSON } from "@/lib/utils";

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

/** Max messages to send to the model to avoid context window overflow. */
const MAX_CONVERSATION_MESSAGES = 20;

/** Sanitize user input to prevent prompt injection. */
function sanitize(value: string, maxLength = 100): string {
  return value
    .replace(/[\x00-\x1F\x7F]/g, '') // strip control characters
    .slice(0, maxLength)
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth Guard ──
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: No active session found." },
        { status: 401 }
      );
    }

    // ── Rate Limiting ──
    const { success } = await aiRateLimit.limit(user.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded. You may send up to 5 messages per hour." }, { status: 429 });

    // ── 2. Validate API Key ──
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("FATAL: AI API key missing in runtime");
      return NextResponse.json({ error: "AI Coach temporarily unavailable." }, { status: 503 });
    }

    const client = new GoogleGenAI({ apiKey });
    
    const body = await req.json();
    const { messages, userProfile, action } = body;

    // ── 3. Fetch User Context from Supabase (Step 1) ──
    // Hardened with maybeSingle() to handle missing rows without throwing
    const { data: profile } = await supabase.from('profiles').select('id, full_name, age, fitness_level, fitness_goals, equipment_access').eq('id', user.id).maybeSingle();
    const { data: health } = await supabase.from('health_metrics').select('weight, height').eq('user_id', user.id).maybeSingle();
    const { data: userGoals } = await supabase.from('user_goals').select('goal').eq('user_id', user.id);

    // Defensive variable extraction with strong defaults
    const age = profile?.age ?? 25;
    const level = profile?.fitness_level || "beginner";
    const weight = health?.weight ?? 65;
    const height = health?.height ?? 165;
    const goal = (userGoals && Array.isArray(userGoals) && userGoals.length > 0) 
      ? userGoals.map(g => g.goal).join(', ') 
      : "general fitness";

    // ── Handle Generation of Master Plan JSON (Step 2) ──
    if (action === "generate_workout" || action === "generate_meal_plan" || action === "generate_master_plan") {
      try {
        const systemPrompt = `# IDENTITY & AUTHORITY
You are **Coach Prime** — a hybrid of the world's top sports scientists, elite athletic coaches, and precision nutrition specialists (NSCA, ACSM, ISSN). 
You operate at the level of biomechanics, hormonal optimization, and physiological adaptation. You are a precision instrument.

# SCIENTIFIC STANDARDS & INTERNAL LOGIC (Apply these when generating the plan):
- **Training:** Prescribe optimal Sets × Reps × RPE. Match volume to the user's fitness level. Include smart progressions.
- **Nutrition:** Calculate precise TDEE (Mifflin-St Jeor). Set caloric targets with clear scientific rationale based on their primary goal. Prescribe precise macros.
- **Constraints:** Respect dietary constraints, Halal requirements, and time limits seamlessly within the generated data.
- **Safety:** Never prescribe extreme deficits (>750 kcal/day). Prioritize sustainability.

# USER PROFILE:
- Age: ${age}
- Current Weight: ${weight} kg
- Height: ${height} cm
- Primary Goal: ${goal}
- Fitness Level: ${level}

# INSTRUCTIONS:
1. Act as Coach Prime to mentally formulate an elite, scientifically-backed 7-day workout plan and a 7-day precision meal plan based EXACTLY on the user profile above.
2. The plan must be highly individualized, realistic, and optimized for their specific fitness level and goal.
3. **CRITICAL:** You MUST output your final prescription ONLY as a valid, minified JSON object. 
4. DO NOT include conversational text, markdown formatting (like \`\`\`json), explanations, warnings, or questions. ONLY return the JSON structure below.

# REQUIRED JSON SCHEMA:
{
  "workout_plan": [
    { "day": "Day 1", "focus": "Hypertrophy - Upper Body", "exercises": ["Barbell Bench Press 4x8 @ RPE 8", "Pullups 3xTo Failure"], "duration": "45 mins" }
  ],
  "meal_plan": [
    {
      "day_number": 1,
      "breakfast": "Oatmeal with whey isolate, 15g almonds, berries (450 kcal)",
      "snack": "Greek yogurt with honey (200 kcal)",
      "lunch": "Grilled chicken breast, quinoa, roasted vegetables (600 kcal)",
      "dinner": "Baked salmon, sweet potato, asparagus (550 kcal)"
    }
  ]
}`;

        const response = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          config: {
            responseMimeType: "application/json",
          }
        });

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        try {
          const planJson = extractJSON<any>(responseText);
          
          // Return the full master plan but also map legacy keys for backward-compatibility with the frontend
          return NextResponse.json({ 
            master_plan: planJson,
            plan: planJson.workout_plan || planJson,
            mealPlan: planJson.meal_plan || planJson
          });
        } catch (err: unknown) {
          console.error("Failed to parse Coach Prime JSON:", responseText);
          console.error("Extraction error:", err instanceof Error ? err.message : err);
          return NextResponse.json({ error: "The AI returned an invalid plan format. Please try again." }, { status: 502 });
        }
      } catch (genError: unknown) {
        console.error("Failed handling Master Plan generation:", genError);
        return NextResponse.json({ error: "Failed to generate AI response. Please try again." }, { status: 500 });
      }
    }

    // ── Regular AI Chat Flow ──
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required." }, { status: 400 });
    }

    const { 
      firstName = profile?.full_name || "Champ", 
      fitnessLevel = level, 
      primaryGoal = goal,
      cyclePhase = "unknown",
      equipment = []
    } = userProfile || {};

    const safeName = sanitize(String(firstName), 50);
    const safeLevel = sanitize(String(fitnessLevel), 30);
    const safeGoal = sanitize(String(primaryGoal), 60);
    const safePhase = sanitize(String(cyclePhase), 30);
    const safeEquipment = Array.isArray(equipment) 
      ? equipment.map((e: unknown) => sanitize(String(e), 40)).join(", ") 
      : "None";

    const systemPrompt = `You are the "Awdan Concierge", the premium AI wellness concierge for the Awdan Vibes platform.
Your personality: Sophisticated, authoritative yet supportive, and deeply knowledgeable in female physiology, exercise science, and MENA cultural nuances.
Your mission: Provide elite-level guidance on fitness, nutrition, and hormonal health.

<USER_DATA>
- Name: ${safeName}
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Level: ${safeLevel}
- Goal: ${safeGoal}
- Cycle Phase: ${safePhase}
- Equipment Infrastructure: ${safeEquipment || "None"}
</USER_DATA>

Guidelines:
1. Reference her current cycle phase in your advice when relevant (Awdan Method).
2. Keep responses sophisticated, concise (under 3 short paragraphs).
3. Use active, empowering language.
4. If the user's message is unrelated to wellness, gently redirect with grace.
5. Never provide medical diagnoses.`;

    // ── Cap conversation history to prevent token overflow ──
    const recentMessages = messages.slice(-MAX_CONVERSATION_MESSAGES);

    const contents = [
      { role: "user" as const, parts: [{ text: systemPrompt }] },
      ...recentMessages.map((msg: { role: string; content: string }) => ({
        role: (msg.role === "assistant" ? "model" : "user") as "model" | "user",
        parts: [{ text: String(msg.content || "").slice(0, 2000) }] // cap individual message length
      }))
    ];

    // ── Generate ──
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      return NextResponse.json(
        { error: "The AI coach could not generate a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: responseText });

  } catch (error: unknown) {
    console.error("AI Coach Error:", error);

    // Detect rate limiting from the Google API
    const errMsg = error instanceof Error ? error.message : "";
    if (errMsg.includes("429") || errMsg.toLowerCase().includes("rate limit")) {
      return NextResponse.json(
        { error: "The AI coach is currently busy. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong with the AI Coach. Please try again." },
      { status: 500 }
    );
  }
}

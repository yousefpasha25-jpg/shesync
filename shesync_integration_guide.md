# SheSync — Data Integration Guide
# How to wire the Awdan Vibes assets into the AI engine

---

## ASSET INVENTORY (What You Have)

| Asset | Format | Content | Status |
|-------|--------|---------|--------|
| Exercise Library | .xlsx (997 rows, 40 real exercises) | 5 categories, equipment, video links, levels | ✅ Ready to import |
| Ramy's Programs | 6 x .docx (Feb–Oct) | Monthly male program, 3-4 days/week, progressive | ✅ Use as few-shot examples |
| Somaya's Programs | 30+ x .docx (Week 1–17 + New series) | Female program + Egyptian diet, 17+ weeks | ✅ Use as few-shot + diet format reference |
| Nutrition Photos | 13 x .jpeg | WhatsApp screenshots of additional meal plans | ⚠️ Extract manually or via Vision AI |
| Recipes PDF | .pdf | Recipe bank | ⚠️ Extract and structure |

---

## WHAT TO SEND TO THE AI AGENT (Per API Call)

### ✅ ALWAYS SEND (Every request)
```
1. The Master System Prompt (shesync_master_prompt.md)
   → Injected as the `system` parameter in every API call
   → This is fixed, never changes

2. The Exercise Library JSON (exercise_library_grouped.json)
   → Injected inside the system prompt at EXERCISE_LIBRARY_PLACEHOLDER
   → ~3,000 tokens, acceptable cost

3. User Profile Object
   → Injected as the first user message context
   → All fields required before generation
```

### ✅ SEND ON WEEK 2+ (Context augmentation)
```
4. Previous week's plan (the JSON you generated last week)
   → So the AI can see what was programmed and progress correctly
   → Store in Supabase, fetch and inject

5. Adherence data
   → { "workouts_completed": 2, "workouts_scheduled": 3, "skipped": ["Day 2"] }
   → Enables the Behavioral Adaptation Engine to fire
```

### ✅ SEND WHEN USER REPORTS FEEDBACK
```
6. User feedback object
   → { "sore_muscles": ["glutes", "hamstrings"], "energy_level": "low", "notes": "I felt sick on Day 2" }
   → Triggers modification logic in the prompt
```

---

## WHAT NOT TO SEND TO THE AI AGENT

### ❌ NEVER SEND
```
1. Raw .docx files — AI can't read binary format
2. Client real names (Ramy, Somaya) — privacy. Use anonymized "Client A", "Client B"
3. All 30 weeks of Somaya's history in every call — token overload ($$$)
4. The Nutrition photos (.jpeg) in every call — expensive, slow
5. The full Recipes PDF in every call — only send if user requests recipe suggestions
```

---

## DATABASE SETUP (Actual Supabase Schema)

### Table: `profiles`
Stores core identity and fitness preferences.
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  fitness_goals JSONB NOT NULL, -- { primary: string, secondary: string[], timeline: number }
  equipment_access JSONB NOT NULL, -- { location: string, equipment: string[] }
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

### Table: `health_metrics`
Stores biometric and cycle tracking data.
```sql
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  is_pregnant BOOLEAN DEFAULT false,
  cycle_tracking_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

### Table: `user_plans`
Persists the AI-generated weekly protocols.
```sql
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

---

## API CALL STRUCTURE (Next.js Route Handler)

```javascript
// /api/engine/generate-plan
const userProfile = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

const previousPlan = await supabase
  .from('generated_plans')
  .select('plan_json, adherence_score')
  .eq('user_id', userId)
  .order('week_number', { ascending: false })
  .limit(1)
  .single();

const exerciseLibrary = await supabase
  .from('exercise_library')
  .select('*');

// Build system prompt with library injected
const systemPrompt = masterPromptTemplate.replace(
  'EXERCISE_LIBRARY_PLACEHOLDER',
  JSON.stringify(exerciseLibrary.data)
);

// Build user message
const userMessage = `
Generate a ${userProfile.current_week === 1 ? 'Week 1 Foundation' : `Week ${userProfile.current_week}`} 
plan for this user:

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

${previousPlan ? `PREVIOUS WEEK PLAN: ${JSON.stringify(previousPlan.plan_json)}` : ''}
${previousPlan ? `PREVIOUS WEEK ADHERENCE: ${previousPlan.adherence_score}%` : ''}

Return ONLY the JSON output schema. No prose.
`;

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",  // CORRECT model name
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }]
  })
});
```

---

## HOW TO IMPORT THE EXERCISE LIBRARY INTO SUPABASE

```javascript
// Run this ONCE as a seed script
const exercises = require('./exercise_library.json'); // The JSON you generated

const { error } = await supabase
  .from('exercise_library')
  .insert(exercises);

if (error) console.error('Import failed:', error);
else console.log(`Imported ${exercises.length} exercises`);
```

---

## HOW TO USE THE NUTRITION PHOTOS

The 13 JPEG files in the Nutrition folder are WhatsApp screenshots. They likely contain:
- Additional diet plans not in Somaya's docs
- Possibly client meal photo examples

**Integration approach:**
1. Run them through Vision AI (Claude vision or GPT-4o) to extract text
2. Structure the extracted text into the nutrition day format
3. Add to a `nutrition_templates` table as reference plans
4. The AI uses them as additional few-shot examples for cultural meal variety

**Command to extract text from images (one-time setup):**
```javascript
// Use Claude's vision capability to extract meal plan data
const imageData = fs.readFileSync(imagePath).toString('base64');
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageData }},
        { type: "text", text: "Extract all meal plan text from this image. Structure it as: Day, Breakfast, Lunch, Dinner, Snacks, Notes. Return JSON only." }
      ]
    }]
  })
});
```

---

## COST ESTIMATE PER API CALL

| Component | Tokens | Cost (Claude Sonnet) |
|-----------|--------|---------------------|
| System prompt (master) | ~2,500 | $0.003 |
| Exercise library JSON | ~3,000 | $0.0036 |
| User profile | ~500 | $0.0006 |
| Previous week plan | ~2,000 | $0.0024 |
| Generated output | ~2,000 | $0.012 |
| **Total per plan generation** | **~10,000** | **~$0.02** |

At 1,000 users generating weekly plans: ~$20/month in AI costs.


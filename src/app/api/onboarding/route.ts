/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/features/onboarding/schema';

/**
 * Handle Onboarding Submission (POST)
 * Receives the Zusthand store data, validates it via Zod, and securely
 * inserts into Supabase tables `profiles` and `health_metrics`.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user via Supabase session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: No active session found.' }, 
        { status: 401 }
      );
    }

    // 2. Parse and Validate Payload
    const body = await request.json();
    const validationResult = onboardingSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Log full details server-side for debugging
      console.error("ZOD VALIDATION ERROR:", JSON.stringify(validationResult.error, null, 2));
      
      // Return only a sanitized summary to the client
      const fieldErrors = validationResult.error.issues.map(i => i.path.join('.') || 'root').filter(Boolean);
      return NextResponse.json({ 
        error: 'Invalid profile data. Please check the following fields: ' + [...new Set(fieldErrors)].join(', '),
      }, { status: 400 });
    }

    const data = validationResult.data;

    // 3. Upsert into `profiles`
    // Captures identity and core fitness goals
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        full_name: data.basicInfo?.fullName,
        age: data.basicInfo?.age,
        fitness_goals: {
          primary: data.fitnessGoals?.primaryGoal,
          secondary: data.fitnessGoals?.secondaryGoals || [],
          timeline: data.fitnessGoals?.targetTimelineWeeks
        },
        equipment_access: {
          location: data.equipment?.workoutLocation,
          equipment: data.equipment?.availableEquipment || []
        }
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.error("SUPABASE PROFILE ERROR:", profileError);
      return NextResponse.json({ error: "Failed to save profile. Please try again." }, { status: 500 });
    }

    // 4. Upsert into `health_metrics`
    // Captures biometrics and hormonal sync flags
    const { error: healthError } = await supabase
      .from('health_metrics')
      .upsert({
        user_id: user.id,
        height: data.basicInfo?.heightCm,
        weight: data.basicInfo?.weightKg,
        is_pregnant: data.cycle?.pregnancyStatus === 'pregnant',
        cycle_tracking_enabled: data.cycle?.trackCycle || false
      }, { onConflict: 'user_id' });

    if (healthError) {
      console.error("SUPABASE HEALTH METRICS ERROR:", healthError);
      return NextResponse.json({ error: "Failed to save health metrics. Please try again." }, { status: 500 });
    }

    // 5. Respond with Success
    return NextResponse.json({ 
      success: true, 
      message: 'Secure integration complete. Profile launched.' 
    });

  } catch (error: unknown) {
    console.error('Onboarding API Error ->', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

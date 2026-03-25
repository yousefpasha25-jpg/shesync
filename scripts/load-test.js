const axios = require('axios');

/**
 * Awdan Vibes 50-User Stress Test
 * Simulates concurrent onboarding and AI Generation requests.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENT_USERS = 50;

// Mock Onboarding Payload matching the schema
const mockOnboardingData = {
  basicInfo: {
    fullName: "Stress Test User",
    age: 30,
    heightCm: 170,
    weightKg: 70
  },
  fitnessGoals: {
    primaryGoal: "build_muscle",
    secondaryGoals: ["strength", "tone_up"],
    targetTimelineWeeks: 12
  },
  equipment: {
    workoutLocation: "gym",
    availableEquipment: ["dumbbells", "barbell", "kettlebell"]
  },
  cycle: {
    trackCycle: false,
    pregnancyStatus: "not_pregnant"
  }
};

async function simulateUser(id) {
  const stats = { id, onboarding: null, aiCoach: null };
  const startTime = Date.now();

  try {
    console.log(`[User ${id}] Starting simulation...`);

    // 1. Simulate Onboarding Save
    try {
      const onboardResp = await axios.post(`${BASE_URL}/api/onboarding`, mockOnboardingData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      stats.onboarding = { status: onboardResp.status, success: true };
    } catch (err) {
      stats.onboarding = { 
        status: err.response?.status || 'TIMEOUT/NETWORK', 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    }

    // 2. Simulate AI Coach Generation
    try {
      const coachResp = await axios.post(`${BASE_URL}/api/coach`, {
        action: "generate_workout",
        userProfile: mockOnboardingData.basicInfo
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // AI can be slow
      });
      stats.aiCoach = { status: coachResp.status, success: true };
    } catch (err) {
      stats.aiCoach = { 
        status: err.response?.status || 'TIMEOUT/NETWORK', 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[User ${id}] Finished in ${duration}s. Onboarding: ${stats.onboarding.status}, AI: ${stats.aiCoach.status}`);
    return stats;

  } catch (error) {
    console.error(`[User ${id}] Fatal error:`, error.message);
    return stats;
  }
}

async function runStressTest() {
  console.log(`\n🚀 STRESS TEST STARTING: ${CONCURRENT_USERS} Virtual Users`);
  console.log(`Targeting: ${BASE_URL}\n`);

  const promises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    promises.push(simulateUser(i));
  }

  const results = await Promise.all(promises);

  // Summary Reporting
  const summary = {
    total: CONCURRENT_USERS,
    onboardingSuccess: results.filter(r => r.onboarding?.success).length,
    onboarding401: results.filter(r => r.onboarding?.status === 401).length,
    onboarding500: results.filter(r => r.onboarding?.status === 500).length,
    aiSuccess: results.filter(r => r.aiCoach?.success).length,
    ai429: results.filter(r => r.aiCoach?.status === 429).length,
    ai502: results.filter(r => r.aiCoach?.status === 502).length,
  };

  console.log('\n--- STRESS TEST SUMMARY ---');
  console.table(summary);
  
  if (summary.onboarding401 > 0) {
    console.log('⚠️ [NOTE] 401 errors are expected if the script doesn\'t have valid Supabase session cookies/tokens.');
  }
  
  if (summary.ai429 > 0) {
    console.log('❌ [CRITICAL] AI Rate Limits (429) hit! The system cannot handle this concurrency level with Gemini.');
  }

  console.log('\nDone.\n');
}

runStressTest().catch(console.error);

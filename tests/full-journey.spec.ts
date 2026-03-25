import { test, expect } from '@playwright/test';

test.describe('Awdan Vibes Onboarding & Training Flow', () => {
  test('should complete the full user journey', async ({ page }) => {
    // 1. Navigate to Onboarding
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/onboarding/);

    // Skip initial auth state if needed (assuming anonymous or dev mode)
    // Wait for the form to be ready
    await expect(page.locator('text=Welcome to Awdan Vibes')).toBeVisible({ timeout: 10000 });

    // --- Step 1: Basic Info ---
    await page.fill('input[placeholder="Enter your name"]', 'Stress Test User');
    await page.fill('input[placeholder="25"]', '28');
    await page.fill('input[placeholder="160"]', '175');
    await page.fill('input[placeholder="60"]', '75');
    await page.click('button:has-text("Next")');

    // --- Step 2: Pregnancy (Optional) ---
    // We can just hit Next or Skip
    await page.click('button:has-text("Skip")');

    // --- Step 3: Goals ---
    await page.click('text=Increase strength');
    await page.click('text=Build muscle');
    await page.click('button:has-text("Next")');

    // --- Step 4: Schedule ---
    await page.click('button:has-text("Select schedule")');
    await page.click('text=Regular 9-5');
    await page.click('button:has-text("Next")');

    // --- Step 5: Cycle Tracking ---
    // Assuming we enable or skip
    await page.click('button:has-text("Next")');

    // --- Step 6: Fitness Level ---
    await page.click('text=Intermediate');
    await page.click('text=Strength training');
    await page.click('button:has-text("Next")');

    // --- Step 7: Intensity ---
    await page.fill('input[type="number"]', '45');
    await page.click('button:has-text("Next")');

    // --- Step 8: Nutrition ---
    await page.fill('input[type="number"]', '2.5');
    await page.click('button:has-text("Next")');

    // --- Step 9: Equipment ---
    await page.click('text=Commercial gym');
    await page.click('button:has-text("Next")');

    // --- Step 10: Wearables ---
    await page.click('button:has-text("Skip")');

    // --- Step 11: Final Review ---
    await expect(page.locator('text=You\'re all set!')).toBeVisible();
    await page.click('button:has-text("Start Your Journey")');

    // --- Verification: Redirect to Dashboard ---
    await expect(page).toHaveURL(/\/dashboard/);

    // --- Step 12: Train Route & AI Generation ---
    await page.goto('/train');
    await expect(page).toHaveURL(/\/train/);

    const generateBtn = page.locator('button:has-text("Generate AI Workout")');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Verify AI Plan starts loading/rendering
    await expect(page.locator('text=crafting your schedule')).toBeVisible();
    
    // Wait for plan to appear
    await expect(page.locator('text=Your 7-Day Custom AI Plan')).toBeVisible({ timeout: 30000 });
  });
});

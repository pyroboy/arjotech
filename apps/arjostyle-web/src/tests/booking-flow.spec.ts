import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.removeItem('arjo_booking_form');
      localStorage.removeItem('arjo_booking_step');
    });
    await page.reload();
    // Scroll to CTA and open booking modal
    const bookBtn = page.getByRole('button', { name: /Book a Session/i }).first();
    await bookBtn.scrollIntoViewIfNeeded();
  });

  test('opens booking modal and shows Step 0', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    // TattooDesignStep should render — first-timer gate or style heading
    await expect(page.getByText(/first tattoo|What style/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('Step 0: select style, region, area, size enables Next', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText(/first tattoo|What style/i).first()).toBeVisible({ timeout: 8000 });

    // Select a style from carousel
    const styleButton = page.locator('button[title="Traditional"]').first();
    if (await styleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await styleButton.click();
    } else {
      // Fallback: click any style button in the carousel
      await page.locator('.overflow-x-auto button, [class*="carousel"] button').first().click();
    }

    // Select region
    await page.getByRole('button', { name: 'Arms' }).first().click();
    await page.waitForTimeout(300);

    // Select area within region
    const areaBtn = page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first();
    await areaBtn.click();

    // Select size
    await page.getByRole('button', { name: /Medium/i }).first().click();

    // Next should be enabled
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 3000 });
  });

  test('Step 0: Next disabled without all fields', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText('What style?').first()).toBeVisible({ timeout: 5000 });

    // Next should be disabled initially
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeDisabled();
  });

  test('Step 1 renders after completing Step 0', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText('What style?').first()).toBeVisible({ timeout: 5000 });

    // Complete Step 0
    await page.locator('button[title="Traditional"]').first().click().catch(() =>
      page.locator('.overflow-x-auto button').first().click()
    );
    await page.getByRole('button', { name: 'Arms' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first().click();
    await page.getByRole('button', { name: /Medium/i }).first().click();

    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Step 1 should show vision-related content
    await expect(page.getByText(/Describe Your Vision|describe your tattoo/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('Step 1: Next always enabled (all optional)', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText('What style?').first()).toBeVisible({ timeout: 5000 });

    // Complete Step 0
    await page.locator('button[title="Traditional"]').first().click().catch(() =>
      page.locator('.overflow-x-auto button').first().click()
    );
    await page.getByRole('button', { name: 'Arms' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first().click();
    await page.getByRole('button', { name: /Medium/i }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Next should be enabled immediately on Step 1
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 3000 });
  });

  test('Step 0: live price estimate appears after size selection', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText('What style?').first()).toBeVisible({ timeout: 5000 });

    // Price estimate should NOT be visible initially
    await expect(page.getByText('Estimated Price Range').first()).not.toBeVisible();

    // Select size to trigger price display
    await page.getByRole('button', { name: /Medium/i }).first().click();

    // Price estimate should now appear
    await expect(page.getByText('Estimated Price Range').first()).toBeVisible({ timeout: 3000 });
  });

  test('Step 0: first-timer gate question is visible as hero', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText(/first tattoo/i).first()).toBeVisible({ timeout: 5000 });

    // First-timer question should be the FIRST thing visible in Step 0
    await expect(page.getByText('Is this your first tattoo?').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /first time/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /been inked/i }).first()).toBeVisible();
  });

  test('Step 0: selecting first-timer shows welcome message', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText(/first tattoo/i).first()).toBeVisible({ timeout: 5000 });

    // Click "Yes, first time!" — this is in Step 0 now
    await page.getByRole('button', { name: /first time/i }).first().click();

    // Welcome message should appear
    await expect(page.getByText(/Welcome.*consultation is for/i).first()).toBeVisible({ timeout: 3000 });
  });

  test('Step 2: phone field is optional', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText('What style?').first()).toBeVisible({ timeout: 5000 });

    // Complete Step 0
    await page.locator('button[title="Traditional"]').first().click().catch(() =>
      page.locator('.overflow-x-auto button').first().click()
    );
    await page.getByRole('button', { name: 'Arms' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first().click();
    await page.getByRole('button', { name: /Medium/i }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Skip Step 1
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Phone field label should say "optional"
    await expect(page.getByText(/Phone Number.*optional/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('Step 2: budget range and referral source are removed', async ({ page }) => {
    await page.getByRole('button', { name: /Book a Session/i }).first().click();
    await expect(page.getByText(/What style|first tattoo/i).first()).toBeVisible({ timeout: 8000 });

    // Complete Step 0
    await page.locator('.overflow-x-auto button').first().click();
    await page.getByRole('button', { name: 'Arms' }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first().click();
    await page.getByRole('button', { name: /Medium/i }).first().click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Budget range should NOT be visible
    await expect(page.getByText('Budget Range').first()).not.toBeVisible();
    // Referral source should NOT be visible
    await expect(page.getByText('How did you hear about us?').first()).not.toBeVisible();
  });
});

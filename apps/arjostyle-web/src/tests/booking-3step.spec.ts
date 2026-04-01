import { test, expect, type Page } from '@playwright/test';

/**
 * Verifies the 3-step booking flow restructure:
 *   Step 1 (index 0): Tattoo Design — style, placement, size, creative freedom, description
 *   Step 2 (index 1): Contact & Schedule — name, email, age checkbox (no DOB dropdowns)
 *   Step 3 (index 2): Review — terms checkbox, submit (no medical checkbox)
 */

/** Helper: complete Step 1 required fields (region, area, size — style is pre-filled as "not-sure") */
async function completeStep1(page: Page) {
  await page.getByRole('button', { name: 'Arms' }).first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Forearm|Deltoid|Bicep/i }).first().click();
  await page.getByRole('button', { name: /Medium/i }).first().click();
}

/** Helper: click Next and wait for transition */
async function clickNext(page: Page) {
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(500);
}

/** Helper: complete Step 2 required fields (name, email, age) */
async function completeStep2(page: Page) {
  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('test@example.com');
  await page.getByText('I confirm I am 18 years or older').click();
}

test.describe('3-Step Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('arjo_booking_form');
      localStorage.removeItem('arjo_booking_step');
    });
    await page.reload();

    // Open booking modal
    const bookBtn = page.getByRole('button', { name: /Book a Session/i }).first();
    await bookBtn.scrollIntoViewIfNeeded();
    await bookBtn.click();
    await expect(page.getByText(/first tattoo|What style/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('progress bar has exactly 3 segments', async ({ page }) => {
    const segments = page.locator('button[aria-label^="Step"]');
    await expect(segments).toHaveCount(3);
  });

  test('Step 1 has style picker, body placement, size cards, creative freedom, description textarea', async ({ page }) => {
    await expect(page.getByText('What style?')).toBeVisible();
    await expect(page.getByText('Where on your body?')).toBeVisible();
    await expect(page.getByText('How big?')).toBeVisible();
    await expect(page.getByText('How closely should the artist follow your idea?')).toBeVisible();
    await expect(page.getByText('Exactly as I described')).toBeVisible();
    await expect(page.getByText('Add your artistic touch')).toBeVisible();
    await expect(page.getByText('Surprise me!')).toBeVisible();
    await expect(page.getByText('Describe Your Vision')).toBeVisible();
    await expect(page.locator('#tattooDescription')).toBeVisible();
  });

  test('fill Step 1 required fields and navigate to Step 2', async ({ page }) => {
    await completeStep1(page);

    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeEnabled({ timeout: 3000 });
    await clickNext(page);

    await expect(page.getByRole('heading', { name: 'Book Your Session' })).toBeVisible({ timeout: 5000 });
  });

  test('Step 2 has name, email, age checkbox — no DOB dropdowns', async ({ page }) => {
    await completeStep1(page);
    await clickNext(page);

    // Name input
    await expect(page.locator('#name')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Full Name')).toBeVisible();

    // Email input
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.getByText('Email Address')).toBeVisible();

    // Age confirmation checkbox
    await expect(page.getByText('I confirm I am 18 years or older')).toBeVisible();

    // NO DOB dropdowns
    await expect(page.getByText('Date of Birth')).not.toBeVisible();
    await expect(page.locator('select[name="month"], select[name="day"], select[name="year"]')).toHaveCount(0);
  });

  test('fill Step 2 required fields and navigate to Step 3', async ({ page }) => {
    await completeStep1(page);
    await clickNext(page);
    await completeStep2(page);

    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeEnabled({ timeout: 3000 });
    await clickNext(page);

    await expect(page.getByText('Review Your Booking Request')).toBeVisible({ timeout: 5000 });
  });

  test('Step 3 has terms checkbox and submit — no medical checkbox', async ({ page }) => {
    await completeStep1(page);
    await clickNext(page);
    await completeStep2(page);
    await clickNext(page);

    // Terms checkbox
    await expect(page.getByRole('main').getByRole('link', { name: 'Terms & Conditions' })).toBeVisible({ timeout: 5000 });

    // Submit button
    await expect(page.getByRole('button', { name: /Book My Tattoo/i })).toBeVisible();

    // NO medical checkbox
    await expect(page.getByText(/medical condition/i)).not.toBeVisible();
    await expect(page.getByText(/medical.*confirm/i)).not.toBeVisible();
  });

  test('no page crashes throughout full flow', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await completeStep1(page);
    await clickNext(page);
    await completeStep2(page);
    await clickNext(page);

    await expect(page.getByText('Review Your Booking Request')).toBeVisible({ timeout: 5000 });
    expect(errors).toEqual([]);
  });

  test('step navigation: Previous goes back correctly', async ({ page }) => {
    await completeStep1(page);
    await clickNext(page);

    await expect(page.getByRole('heading', { name: 'Book Your Session' })).toBeVisible({ timeout: 5000 });

    // Click Previous
    await page.getByRole('button', { name: 'Previous' }).click();
    await page.waitForTimeout(500);

    // Should be back on Step 1
    await expect(page.getByText('What style?')).toBeVisible({ timeout: 5000 });
  });
});

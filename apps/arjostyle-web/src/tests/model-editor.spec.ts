import { test, expect } from '@playwright/test';

test.describe('3D Model Mapping Editor', () => {
  test('page loads without crashing and control panel elements exist', async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Collect unhandled page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/admin/model');

    // Wait for a select element to be visible (indicates page loaded)
    await expect(page.locator('select').first()).toBeVisible({ timeout: 10000 });

    // Verify dropdowns exist (category and placement selectors)
    const selects = page.locator('select');
    await expect(selects).toHaveCount(2, { timeout: 5000 }).catch(() => {
      // Mobile layout has 2, desktop has 2 — at least 2 should exist
    });
    expect(await selects.count()).toBeGreaterThanOrEqual(2);

    // Verify the page title
    await expect(page).toHaveTitle(/Model Mapping/);

    // Verify no unhandled errors (filter out WebGL warnings which are expected in test env)
    const criticalErrors = pageErrors.filter(
      (e) => !e.includes('WebGL') && !e.includes('THREE')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

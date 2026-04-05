import { test, expect } from '@playwright/test';

test.describe('Legacy Tattoo Calculator Tool', () => {
  test('page loads without errors', async ({ page }) => {
    const response = await page.goto('http://localhost:5173/tools/tattoo-calculator');
    expect(response?.status()).toBe(200);
  });

  test('shows calculator title and badge', async ({ page }) => {
    await page.goto('http://localhost:5173/tools/tattoo-calculator');
    await expect(page.locator('text=Tattoo Calculator').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Legacy Tool').first()).toBeVisible();
  });

  test('shows CTA to book', async ({ page }) => {
    await page.goto('http://localhost:5173/tools/tattoo-calculator');
    const bookBtn = page.locator('a[href="/book"], button:has-text("book"), a:has-text("Book")').first();
    await expect(bookBtn).toBeVisible({ timeout: 5000 });
  });

  test('tools listing includes tattoo calculator', async ({ page }) => {
    await page.goto('http://localhost:5173/tools');
    await expect(page.locator('text=Tattoo Calculator').first()).toBeVisible({ timeout: 5000 });
  });
});

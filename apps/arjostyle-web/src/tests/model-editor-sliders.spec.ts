import { test, expect } from '@playwright/test';

test.describe('Model Editor — Slider / Input Reactivity', () => {
  test('changing a desktop position input updates the overlay display', async ({ page }) => {
    // Use desktop viewport so the sidebar number inputs are visible
    await page.setViewportSize({ width: 1280, height: 800 });

    // Collect page errors for diagnostics
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/admin/model');

    // Wait for selects to appear (page loaded)
    await expect(page.locator('select').first()).toBeVisible({ timeout: 15000 });

    // The desktop sidebar selects have ids "cat-d" and "pl-d"
    const catSelect = page.locator('#cat-d');
    const plSelect = page.locator('#pl-d');
    await expect(catSelect).toBeVisible({ timeout: 5000 });
    await expect(plSelect).toBeVisible({ timeout: 5000 });

    // Select the first category and first placement (should auto-select, but be explicit)
    const firstCategory = await catSelect.locator('option').first().getAttribute('value');
    if (firstCategory) await catSelect.selectOption(firstCategory);

    // Wait for placements to populate
    await expect(plSelect.locator('option').first()).toBeAttached({ timeout: 5000 });
    const firstPlacement = await plSelect.locator('option').first().getAttribute('value');
    if (firstPlacement) await plSelect.selectOption(firstPlacement);

    // Wait for the overlay to appear with position data
    // Use getByText to target the overlay div that contains "Pos:"
    const overlay = page.getByText(/Pos:.*\[/);
    await expect(overlay).toBeVisible({ timeout: 10000 });

    // Read the initial overlay position text
    const initialPosText = await overlay.textContent();
    console.log('Initial overlay position text:', initialPosText);

    // Find the X position input in the desktop sidebar
    const desktopSidebar = page.locator('.hidden.sm\\:flex');
    const positionInputs = desktopSidebar.locator('input[type="number"][step="0.001"]');
    await expect(positionInputs.first()).toBeVisible({ timeout: 5000 });

    // Read the current X value
    const currentXValue = await positionInputs.first().inputValue();
    console.log('Current X input value:', currentXValue);

    // Compute a new value that is clearly different
    const currentX = parseFloat(currentXValue);
    const newX = Math.round((currentX + 0.1) * 1000) / 1000;
    const newXStr = newX.toFixed(3);
    console.log('Setting X to:', newXStr);

    // Clear and type the new value, then trigger change event
    await positionInputs.first().click();
    await positionInputs.first().fill(newXStr);

    // Verify the input value was actually set
    const filledValue = await positionInputs.first().inputValue();
    console.log('Input value after fill:', filledValue);

    // Dispatch a native change event (Svelte uses onchange, not oninput for these)
    await positionInputs.first().dispatchEvent('change');

    // Also try pressing Tab to blur and trigger change
    await positionInputs.first().press('Tab');

    // Wait for reactivity to propagate
    await page.waitForTimeout(1000);

    // Read the overlay again
    const updatedPosText = await overlay.textContent();
    console.log('Updated overlay position text:', updatedPosText);

    // The overlay should contain the new X value
    expect(updatedPosText).toContain(newX.toFixed(3));

    // Also verify it changed from the initial value
    if (initialPosText !== updatedPosText) {
      console.log('SUCCESS: Overlay position updated after input change');
    } else {
      console.log('FAILURE: Overlay position did NOT update after input change');
    }

    // Report any page errors
    const criticalErrors = pageErrors.filter(
      (e) => !e.includes('WebGL') && !e.includes('THREE')
    );
    if (criticalErrors.length > 0) {
      console.log('Critical page errors:', criticalErrors);
    }
  });
});

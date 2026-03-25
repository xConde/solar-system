import { test, expect } from '@playwright/test';

test.describe('Solar System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }',
    });
  });

  test('page loads with title', async ({ page }) => {
    await expect(page).toHaveTitle('Solar System v2');
  });

  test('sun is visible', async ({ page }) => {
    const sun = page.locator('.sun');
    await expect(sun).toBeVisible();
  });

  test('all planets are rendered', async ({ page }) => {
    const planets = page.locator('.planet');
    await expect(planets).toHaveCount(10); // 8 planets + 2 dwarf
  });

  test('control bar is visible', async ({ page }) => {
    const controls = page.locator('.control-bar');
    await expect(controls).toBeVisible();
  });

  test('planet click shows info panel', async ({ page }) => {
    const earth = page.locator('.planet.earth');
    await earth.click({ force: true });
    const panel = page.locator('.info-panel--visible');
    await expect(panel).toBeVisible();
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedPlanet = page.locator('.planet:focus-visible');
    await expect(focusedPlanet).toHaveCount(1);
  });
});

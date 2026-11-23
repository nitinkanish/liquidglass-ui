import { test, expect } from '@playwright/test';

test.describe('GlassHeader', () => {
  test('docs demo reacts to scrolling inside the frame', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/docs/components/glass-header', { waitUntil: 'networkidle' });
    const scene = page.getByTestId('glass-header-scene');
    const header = scene.locator('header.lg-header');
    await expect(header).toBeVisible();
    await expect(header).not.toHaveAttribute('data-scrolled', '');
    await scene.evaluate((el) => el.scrollTo(0, 600));
    await expect(header).toHaveAttribute('data-scrolled', '');
    // still pinned to the top of the frame
    const [h, s] = await Promise.all([header.boundingBox(), scene.boundingBox()]);
    expect(Math.abs(h!.y - s!.y)).toBeLessThan(4);
    await scene.evaluate((el) => el.scrollTo(0, 0));
    await expect(header).not.toHaveAttribute('data-scrolled', '');
    expect(errors).toEqual([]);
  });

  test('variant and theme controls update the header', async ({ page }) => {
    await page.goto('/docs/components/glass-header', { waitUntil: 'networkidle' });
    const header = page.getByTestId('glass-header-scene').locator('header.lg-header');
    await page.getByTestId('glass-header-controls').getByRole('button', { name: 'bar', exact: true }).click();
    await expect(header).toHaveAttribute('data-variant', 'bar');
    await page.getByTestId('glass-header-controls').getByRole('button', { name: 'dark', exact: true }).click();
    await expect(header).toHaveAttribute('data-lg-scheme', 'dark');
  });

  test('full-page demo: fixed header gets the scrolled state', async ({ page }) => {
    await page.goto('/demos/glass-header', { waitUntil: 'networkidle' });
    const header = page.locator('header.lg-header');
    await expect(header).toHaveAttribute('data-ready', '');
    await page.mouse.wheel(0, 800);
    await expect(header).toHaveAttribute('data-scrolled', '');
    const box = await header.boundingBox();
    expect(box!.y).toBeLessThanOrEqual(1);
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }));
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });

  test('mobile menu opens, traps focus inside and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/demos/glass-header', { waitUntil: 'networkidle' });
    const header = page.locator('header.lg-header');
    await expect(header).toHaveAttribute('data-collapsed', '');
    await expect(header.locator('.lg-header-nav')).toBeHidden();
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const menu = header.locator('.lg-header-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Get started' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu.getByRole('link', { name: 'Pricing' }).click();
    await expect(menu).toBeHidden();
  });

  test('desktop shows inline links and no menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/demos/glass-header', { waitUntil: 'networkidle' });
    const header = page.locator('header.lg-header');
    await expect(header.locator('.lg-header-nav').getByRole('link', { name: 'Research' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  });
});

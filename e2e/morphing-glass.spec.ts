import { test, expect } from '@playwright/test';

test.describe('MorphingGlass', () => {
  test('hero mounts a renderer and morphs through shapes', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/demos/morphing-glass', { waitUntil: 'networkidle' });
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    await expect(morph).toHaveAttribute('data-playing', '');
    const first = await morph.getAttribute('data-shape');
    await expect.poll(() => morph.getAttribute('data-shape'), { timeout: 8000 }).not.toBe(first);
    expect(errors).toEqual([]);
  });

  test('WebGL canvas draws pixels when available', async ({ page }) => {
    await page.goto('/demos/morphing-glass', { waitUntil: 'networkidle' });
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    test.skip((await morph.getAttribute('data-renderer')) !== 'webgl', 'no WebGL in this browser');
    const box = await morph.boundingBox();
    expect(box!.width).toBeGreaterThan(100);
    const shot = await morph.screenshot();
    expect(shot.byteLength).toBeGreaterThan(5000);
  });

  test('fixed shape from the docs controls', async ({ page }) => {
    await page.goto('/docs/components/morphing-glass', { waitUntil: 'networkidle' });
    await page.getByTestId('morph-controls').getByRole('button', { name: 'pill', exact: true }).click();
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-shape', 'pill', { timeout: 5000 });
    await expect(morph).not.toHaveAttribute('data-playing', '');
  });

  test('CSS fallback renders the glass material', async ({ page }) => {
    await page.goto('/demos/morphing-glass?renderer=css', { waitUntil: 'networkidle' });
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-renderer', 'fallback');
    await expect(morph.locator('.lg-morph-fallback.lg-glass')).toBeVisible();
  });

  test('pauses when scrolled offscreen', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/docs/components/morphing-glass', { waitUntil: 'networkidle' });
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-playing', '');
    await page.locator('#props').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(morph).not.toHaveAttribute('data-playing', '');
  });

  test('reduced motion shows a still shape', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/demos/morphing-glass', { waitUntil: 'networkidle' });
    const morph = page.locator('.lg-morph');
    await expect(morph).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    await expect(morph).not.toHaveAttribute('data-playing', '');
    await page.waitForTimeout(2500);
    await expect(morph).toHaveAttribute('data-shape', 'sphere');
    await context.close();
  });
});

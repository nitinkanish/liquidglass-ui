import { test, expect, Page } from '@playwright/test';
import path from 'path';

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/docs', name: 'docs' },
  { path: '/docs/installation', name: 'installation' },
  { path: '/docs/theming', name: 'theming' },
  { path: '/docs/components/button', name: 'component-button' },
  { path: '/docs/components/switch', name: 'component-switch' },
  { path: '/components', name: 'components' },
  { path: '/refraction', name: 'refraction' },
] as const;

const ARTIFACTS = '/opt/cursor/artifacts';

async function assertNoHorizontalOverflow(page: Page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    scrollWidth,
    `horizontal overflow: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`
  ).toBeLessThanOrEqual(innerWidth);
}

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name} (${viewport.width}px)`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
    });

    for (const route of ROUTES) {
      test(`${route.name} has no horizontal overflow`, async ({ page }) => {
        await page.goto(route.path, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        await assertNoHorizontalOverflow(page);
      });
    }

    test('hamburger opens slide-in nav on small screens', async ({ page }) => {
      test.skip(viewport.width >= 768, 'desktop uses inline nav');
      await page.goto('/');
      const menu = page.getByRole('button', { name: /open navigation menu/i });
      await expect(menu).toBeVisible();
      await menu.click();
      await expect(page.getByRole('link', { name: 'Docs' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Refraction' }).first()).toBeVisible();
    });

    test('search modal is usable', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /search components/i }).click();
      const input = page.getByRole('combobox');
      await expect(input).toBeVisible();
      await input.fill('Button');
      await expect(page.getByRole('option').first()).toBeVisible();
      // Wait for scale-in animation (starts at 0.95) before measuring touch target
      await page.waitForTimeout(250);
      const close = page.getByRole('button', { name: /close search/i });
      await expect(close).toBeVisible();
      await expect
        .poll(async () => {
          const box = await close.boundingBox();
          return Math.min(box?.height ?? 0, box?.width ?? 0);
        })
        .toBeGreaterThanOrEqual(44);
    });

    test('refraction comparison stacks on mobile', async ({ page }) => {
      test.skip(viewport.width >= 768, 'desktop is side-by-side');
      await page.goto('/refraction', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const stacked = await page.evaluate(() => {
        const grids = [...document.querySelectorAll('.mb-10, .mb-12')].filter((el) =>
          el.querySelector('h3')
        );
        if (!grids.length) return false;
        const first = grids[0].querySelector('.grid');
        if (!first) return false;
        const children = [...first.children] as HTMLElement[];
        if (children.length < 2) return false;
        return children[1].offsetTop > children[0].offsetTop;
      });
      expect(stacked).toBe(true);
      await assertNoHorizontalOverflow(page);
    });
  });
}

test.describe('responsive screenshots', () => {
  test('save mobile and tablet artifacts', async ({ page }) => {
    const shots: { name: string; width: number; height: number; route: string }[] = [
      { name: 'docs-mobile-360', width: 360, height: 800, route: '/' },
      { name: 'docs-mobile-390-refraction', width: 390, height: 844, route: '/refraction' },
      { name: 'docs-tablet-768', width: 768, height: 1024, route: '/docs/components/button' },
      { name: 'docs-tablet-768-components', width: 768, height: 1024, route: '/components' },
      { name: 'docs-mobile-360-docs', width: 360, height: 800, route: '/docs' },
    ];

    for (const shot of shots) {
      await page.setViewportSize({ width: shot.width, height: shot.height });
      await page.goto(shot.route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(ARTIFACTS, `${shot.name}.png`),
        fullPage: false,
      });
    }
  });
});

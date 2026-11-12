import { test, expect } from '@playwright/test';

/**
 * Smoke-test every documented component page in Chromium.
 * Confirms the demo mounts without page errors and has no horizontal overflow.
 */
const COMPONENT_SLUGS = [
  'glass-provider',
  'glass',
  'glass-card',
  'button',
  'icon-button',
  'toggle',
  'input',
  'textarea',
  'search-field',
  'select',
  'checkbox',
  'radio',
  'radio-group',
  'switch',
  'slider',
  'date-picker',
  'tab-bar',
  'segmented-control',
  'tabs',
  'tabs-list',
  'tabs-trigger',
  'tabs-content',
  'navbar',
  'navbar-link',
  'sidebar',
  'sidebar-item',
  'sidebar-group',
  'dock',
  'carousel',
  'modal',
  'modal-footer',
  'sheet',
  'drawer',
  'popover',
  'menu',
  'context-menu',
  'command-palette',
  'tooltip',
  'toast',
  'toast-provider',
  'alert',
  'progress',
  'spinner',
  'badge',
  'avatar',
  'chip',
  'accordion',
  'accordion-item',
  'accordion-trigger',
  'accordion-content',
  'separator',
  'skeleton',
  'floating-action-button',
];

test.describe('component docs pages', () => {
  for (const slug of COMPONENT_SLUGS) {
    test(`renders /docs/components/${slug}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(`/docs/components/${slug}`, {
        waitUntil: 'networkidle',
      });
      expect(response?.ok() || response?.status() === 304).toBeTruthy();

      // Component pages should show the component name heading
      await expect(page.locator('h1').first()).toBeVisible();

      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

      expect(errors, `page errors on ${slug}: ${errors.join('; ')}`).toEqual([]);
    });
  }
});

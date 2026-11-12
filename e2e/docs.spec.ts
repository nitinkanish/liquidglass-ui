import { test, expect } from '@playwright/test';

test.describe('Documentation Site', () => {
  test('homepage loads and shows content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Liquid Glass/i);
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('navigation links work on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop nav');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Docs' }).click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('components page lists categories', async ({ page }) => {
    await page.goto('/components');
    await expect(page.getByRole('heading', { name: 'Components' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Layout' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Buttons' })).toBeVisible();
  });

  test('command palette opens from search button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /search components/i }).click();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('docs installation page shows correct commands', async ({ page }) => {
    await page.goto('/docs/installation');
    await expect(page.getByText('npm install @nkanish/liquidglass-ui')).toBeVisible();
    await expect(page.getByText('pnpm add @nkanish/liquidglass-ui')).toBeVisible();
  });

  test('refraction comparison page loads', async ({ page }) => {
    await page.goto('/refraction');
    await expect(page.getByText(/glisse vs/i)).toBeVisible();
    await expect(page.getByText('Glass Panel / Card')).toBeVisible();
  });

  test('unknown component redirects to docs', async ({ page }) => {
    await page.goto('/docs/components/does-not-exist');
    await expect(page).toHaveURL(/\/docs$/);
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});

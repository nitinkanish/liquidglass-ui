import { test, expect, Page } from '@playwright/test';

async function assertIndicatorAligned(
  page: Page,
  indicatorTestId: string,
  activeRole: 'tab' | 'radio',
  tolerance = 3
) {
  const indicator = page.getByTestId(indicatorTestId);
  await expect(indicator).toBeVisible();

  const active =
    activeRole === 'tab'
      ? page.locator('[role=tab][aria-selected="true"]').first()
      : page.locator('[role=radio][aria-checked="true"]').first();

  await expect(active).toBeVisible();

  const ind = await indicator.boundingBox();
  const act = await active.boundingBox();
  expect(ind).toBeTruthy();
  expect(act).toBeTruthy();

  // Indicator should be centered over / within the active tab bounds
  expect(Math.abs((ind!.x + ind!.width / 2) - (act!.x + act!.width / 2))).toBeLessThanOrEqual(
    tolerance
  );
  expect(Math.abs((ind!.y + ind!.height / 2) - (act!.y + act!.height / 2))).toBeLessThanOrEqual(
    tolerance
  );

  // No overflow of the parent control
  const overflow = await page.evaluate((testId) => {
    const indEl = document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
    const parent = indEl?.parentElement;
    if (!indEl || !parent) return true;
    const ir = indEl.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    return (
      ir.left < pr.left - 1 ||
      ir.top < pr.top - 1 ||
      ir.right > pr.right + 1 ||
      ir.bottom > pr.bottom + 1
    );
  }, indicatorTestId);
  expect(overflow).toBe(false);
}

async function clickEachAndAssert(
  page: Page,
  options: {
    role: 'tab' | 'radio';
    indicatorTestId: string;
    labels: string[];
  }
) {
  for (const label of options.labels) {
    const target =
      options.role === 'tab'
        ? page.getByRole('tab', { name: label })
        : page.getByRole('radio', { name: label });
    await target.click();
    // Wait for transform transition (~220ms)
    await page.waitForTimeout(280);
    await assertIndicatorAligned(page, options.indicatorTestId, options.role);
  }
}

test.describe('TabBar indicator alignment', () => {
  for (const width of [1280, 390] as const) {
    test(`docs tab-bar @ ${width}px — indicator follows every tab`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
      await page.goto('/docs/components/tab-bar', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      await clickEachAndAssert(page, {
        role: 'tab',
        indicatorTestId: 'tabbar-indicator',
        labels: ['Favorites', 'Settings', 'Home'],
      });
    });
  }

  test('keyboard arrows move indicator', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/docs/components/tab-bar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Roving tabindex: focus the selected tab, then arrow
    await page.getByRole('tab', { name: 'Home' }).focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(280);
    await expect(page.getByRole('tab', { name: 'Favorites' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await assertIndicatorAligned(page, 'tabbar-indicator', 'tab');

    await page.getByRole('tab', { name: 'Favorites' }).focus();
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(280);
    await expect(page.getByRole('tab', { name: 'Home' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await assertIndicatorAligned(page, 'tabbar-indicator', 'tab');
  });
});

test.describe('SegmentedControl indicator alignment', () => {
  for (const width of [1280, 390] as const) {
    test(`docs segmented-control @ ${width}px — indicator follows every segment`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
      await page.goto('/docs/components/segmented-control', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      await clickEachAndAssert(page, {
        role: 'radio',
        indicatorTestId: 'segmented-indicator',
        labels: ['Week', 'Month', 'Day'],
      });
    });
  }
});

test.describe('refraction comparison indicators', () => {
  test('liquidglass TabBar on /refraction glides without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/refraction', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await page.evaluate(() => {
      const h3 = [...document.querySelectorAll('h3')].find((el) =>
        el.textContent?.includes('Tab Bar')
      );
      h3?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(300);

    // Our TabBar is the one with data-testid indicator (glisse has none)
    const indicator = page.getByTestId('tabbar-indicator');
    await expect(indicator).toBeVisible();

    const ourBar = page.locator('[data-testid=tabbar-indicator]').locator('..');
    const tabs = ourBar.getByRole('tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(280);
      const idx = await indicator.getAttribute('data-index');
      expect(Number(idx)).toBe(i);

      const overflow = await page.evaluate(() => {
        const ind = document.querySelector('[data-testid=tabbar-indicator]') as HTMLElement;
        const parent = ind.parentElement!;
        const ir = ind.getBoundingClientRect();
        const pr = parent.getBoundingClientRect();
        return (
          ir.left < pr.left - 1 ||
          ir.top < pr.top - 1 ||
          ir.right > pr.right + 1 ||
          ir.bottom > pr.bottom + 1
        );
      });
      expect(overflow).toBe(false);
    }
  });
});

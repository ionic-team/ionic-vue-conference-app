import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { DATA_TIMEOUT, openMenu, openSchedule, sessionLink } from './helpers';

/* Swipes right from the left edge of the screen, which opens the side menu where it is enabled. */
const swipeFromEdge = async (page: Page): Promise<void> => {
  const y = page.viewportSize()!.height / 2;
  await page.mouse.move(5, y);
  await page.mouse.down();
  await page.mouse.move(250, y, { steps: 10 });
  await page.mouse.up();
};

test.describe('Tutorial', () => {
  test('shows the tutorial on the first visit', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/tutorial$/);
    await expect(page.getByRole('heading', { name: 'Welcome to ICA' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible();
  });

  test('skipping the tutorial opens the schedule', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Skip' }).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible({ timeout: DATA_TIMEOUT });
  });

  test('finishing the slides with Continue opens the schedule', async ({ page }) => {
    await page.goto('/');

    // The slides scroll horizontally; bring the last one into view like a swipe would.
    const lastSlide = page.getByRole('heading', { name: 'Ready to Play?' });
    await lastSlide.scrollIntoViewIfNeeded();
    await expect(lastSlide).toBeInViewport();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible({ timeout: DATA_TIMEOUT });
  });

  test('does not show the tutorial again after it is completed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Skip' }).click();
    await expect(page).toHaveURL(/\/tabs\/schedule$/);

    await page.goto('/');

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible({ timeout: DATA_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Skip' })).toBeHidden();
  });

  test('the side menu cannot be opened on the tutorial page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to ICA' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'menu', exact: true })).toHaveCount(0);
    await swipeFromEdge(page);
    await expect(page.getByRole('navigation', { name: 'menu' })).toBeHidden();
  });

  test('the side menu works again after skipping the tutorial', async ({ page }) => {
    await openSchedule(page);
    const menu = await openMenu(page);
    await menu.getByRole('button', { name: 'Show Tutorial' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome to ICA' })).toBeVisible();
    await swipeFromEdge(page);
    await expect(menu).toBeHidden();

    await page.getByRole('button', { name: 'Skip' }).click();
    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    // The menu mounts again with the rest of the app, so retry until its swipe gesture is ready.
    await expect(async () => {
      await swipeFromEdge(page);
      await expect(menu).toBeVisible({ timeout: 1000 });
    }).toPass();

    await expect(menu.getByRole('button', { name: 'Show Tutorial' })).toBeVisible();
  });
});

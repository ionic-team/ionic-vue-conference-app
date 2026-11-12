import { expect, test } from '@playwright/test';

import { DATA_TIMEOUT, sessionLink } from './helpers';

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
});

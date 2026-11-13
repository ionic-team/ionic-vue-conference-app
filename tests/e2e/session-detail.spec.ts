import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  backButton,
  button,
  DATA_TIMEOUT,
  openSchedule,
  segmentButton,
  sessionItem,
  sessionLink,
  tabPage,
  visible,
  visibleTitle,
} from './helpers';

// The outgoing schedule can still be visible mid-transition, so scope to the session's own page.
const sessionPage = (page: Page, name: string) =>
  tabPage(page).filter({ has: page.getByRole('heading', { name, level: 1 }) });

const openSession = async (page: Page, name: string): Promise<void> => {
  await sessionLink(page, name).click();
  await expect(sessionPage(page, name)).toBeVisible();
};

const goBackToSchedule = async (page: Page): Promise<void> => {
  await backButton(page).click();
  await expect(page).toHaveURL(/\/tabs\/schedule$/);
};

test.beforeEach(async ({ page }) => {
  await openSchedule(page);
});

test.describe('Session detail', () => {
  test('shows the session title, track, time and location', async ({ page }) => {
    await openSession(page, 'Getting Started with Ionic');

    await expect(page).toHaveURL(/\/tabs\/schedule\/session\/2$/);
    const content = sessionPage(page, 'Getting Started with Ionic').locator('ion-content');
    await expect(content.getByText('Ionic', { exact: true })).toBeVisible();
    await expect(content).toContainText('9:30 am – 9:45 am');
    await expect(content).toContainText('Hall 2');
  });

  test('the favorite and share buttons have accessible names', async ({ page }) => {
    await openSession(page, 'Ionic Tooling');

    const detail = sessionPage(page, 'Ionic Tooling');
    await expect(button(detail, 'Add favorite')).toBeVisible();
    await expect(button(detail, 'Share')).toBeVisible();
  });

  test('the share button opens the share options', async ({ page }) => {
    await openSession(page, 'Ionic Tooling');

    await button(sessionPage(page, 'Ionic Tooling'), 'Share').click();

    const sheet = page.getByRole('dialog', { name: 'Share Ionic Tooling' });
    await expect(sheet.getByRole('button')).toHaveText(['Copy Link', 'Share via ...', 'Cancel']);
    await sheet.getByRole('button', { name: 'Cancel' }).click();
    await expect(sheet).toHaveCount(0);
  });

  test('opens a session from a direct link', async ({ page }) => {
    await page.goto('/tabs/schedule/session/7');

    await expect(sessionPage(page, 'The Evolution of Ionicons')).toContainText('Hall 2', { timeout: DATA_TIMEOUT });
  });

  test('the back button returns to the schedule', async ({ page }) => {
    await openSession(page, 'Ionic Tooling');

    await goBackToSchedule(page);

    await expect(visibleTitle(page)).toHaveText('Schedule');
    await expect(sessionLink(page, 'Ionic Tooling')).toBeVisible();
    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(20);
  });

  test('favoriting a session adds it to Favorites', async ({ page }) => {
    await openSession(page, 'Ionic Tooling');
    await button(sessionPage(page, 'Ionic Tooling'), 'Add favorite').click();
    await expect(button(sessionPage(page, 'Ionic Tooling'), 'Remove favorite')).toBeVisible();
    await goBackToSchedule(page);

    await segmentButton(page, 'Favorites').click();

    await expect(visible(page.locator('ion-item-sliding')).getByRole('heading')).toHaveText(['Ionic Tooling']);
  });

  test('unfavoriting a session removes it from Favorites', async ({ page }) => {
    await openSession(page, 'Ionic Tooling');
    await button(sessionPage(page, 'Ionic Tooling'), 'Add favorite').click();
    await goBackToSchedule(page);
    await segmentButton(page, 'Favorites').click();
    await expect(sessionItem(page, 'Ionic Tooling')).toBeVisible();

    await openSession(page, 'Ionic Tooling');
    await button(sessionPage(page, 'Ionic Tooling'), 'Remove favorite').click();
    await expect(button(sessionPage(page, 'Ionic Tooling'), 'Add favorite')).toBeVisible();
    await goBackToSchedule(page);

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
    await expect(sessionItem(page, 'Ionic Tooling')).toBeHidden();
  });
});

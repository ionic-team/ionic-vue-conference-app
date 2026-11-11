import { expect, test } from '@playwright/test';

import {
  endToolbarButtons,
  openSchedule,
  segmentButton,
  sessionItem,
  sessionLink,
  swipeOpen,
  visible,
} from './helpers';

test.beforeEach(async ({ page }) => {
  await openSchedule(page);
});

test.describe('Schedule', () => {
  test('lists the sessions grouped by time', async ({ page }) => {
    const groups = visible(page.locator('ion-item-group'));
    await expect(groups.locator('ion-item-divider')).toHaveText([
      '8:00 am',
      '9:15 am',
      '10:00 am',
      '11:00 am',
      '12:00 pm',
      '1:00 pm',
      '2:00 pm',
      '3:00 pm',
    ]);

    const nineFifteen = groups.filter({ hasText: '9:15 am' });
    await expect(nineFifteen.getByRole('heading')).toHaveText([
      'University of Ionic',
      'Getting Started with Ionic',
      'Ionic Tooling',
    ]);
    await expect(sessionItem(page, 'Getting Started with Ionic')).toContainText('9:30 am — 9:45 am: Hall 2');
  });

  test('filters the sessions by name and restores them when the search is cleared', async ({ page }) => {
    await endToolbarButtons(page).first().click();
    const searchbox = visible(page.getByRole('searchbox'));
    await searchbox.fill('VUE');

    const headings = visible(page.locator('ion-item-sliding')).getByRole('heading');
    await expect(headings).toHaveText(["What's New in Vue", 'Building with Ionic and Vue']);
    await expect(sessionLink(page, 'Breakfast')).toBeHidden();

    await visible(page.getByRole('button', { name: 'reset' })).click();

    await expect(headings).toHaveCount(20);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
  });

  test('shows the empty state when no session matches the search', async ({ page }) => {
    await endToolbarButtons(page).first().click();
    await visible(page.getByRole('searchbox')).fill('no such session');

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('shows only favorited sessions under Favorites', async ({ page }) => {
    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Favorite' })).click();
    await expect(page.getByRole('alertdialog', { name: 'Favorite Added' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();

    await segmentButton(page, 'Favorites').click();

    await expect(visible(page.locator('ion-item-sliding')).getByRole('heading')).toHaveText(['Ionic Tooling']);
    await expect(visible(page.locator('ion-item-divider'))).toHaveText(['9:15 am']);

    await segmentButton(page, 'All').click();
    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
  });

  test('shows the empty state under Favorites when there are none', async ({ page }) => {
    await segmentButton(page, 'Favorites').click();

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(0);
  });

  test('removes a session from Favorites with its sliding item', async ({ page }) => {
    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Favorite' })).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await segmentButton(page, 'Favorites').click();
    await expect(sessionLink(page, 'Ionic Tooling')).toBeVisible();

    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Remove' })).click();
    await expect(page.getByRole('alertdialog', { name: 'Remove Favorite' })).toBeVisible();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click();

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('the filter modal can exclude a track and include it again', async ({ page }) => {
    // Filter is the last toolbar button on Material Design.
    await endToolbarButtons(page).last().click();
    const modal = page.locator('ion-modal');
    await expect(modal.getByText('Filter Sessions')).toBeVisible();
    await expect(modal.getByRole('checkbox', { name: 'Food' })).toBeChecked();

    await modal.getByRole('checkbox', { name: 'Food' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(sessionLink(page, 'Breakfast')).toBeHidden();
    await expect(sessionLink(page, 'Lunch')).toBeHidden();
    await expect(sessionLink(page, 'Ionic Tooling')).toBeVisible();
    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(18);

    await endToolbarButtons(page).last().click();
    await expect(modal.getByRole('checkbox', { name: 'Food' })).not.toBeChecked();
    await modal.getByRole('checkbox', { name: 'Food' }).click();
    await expect(modal.getByRole('checkbox', { name: 'Food' })).toBeChecked();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
    await expect(sessionLink(page, 'Lunch')).toBeVisible();
    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(20);
  });

  test('deselecting every track in the filter modal shows no sessions', async ({ page }) => {
    await endToolbarButtons(page).last().click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('button', { name: 'Deselect All' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });
});

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  button,
  isIos,
  openSchedule,
  openSearch,
  segmentButton,
  sessionItem,
  sessionLink,
  swipeOpen,
  visible,
} from './helpers';

/* Favorites a session from the All segment with its sliding item and confirms the alert. */
const addFavorite = async (page: Page, name: string): Promise<void> => {
  await swipeOpen(page, sessionItem(page, name));
  await visible(page.getByRole('button', { name: 'Favorite' })).click();
  await expect(page.getByRole('alertdialog', { name: 'Favorite Added' })).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
};

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
    const searchbox = await openSearch(page);
    await searchbox.fill('VUE');

    const headings = visible(page.locator('ion-item-sliding')).getByRole('heading');
    await expect(headings).toHaveText(["What's New in Vue", 'Building with Ionic and Vue']);
    await expect(sessionLink(page, 'Breakfast')).toBeHidden();

    await visible(page.getByRole('button', { name: 'reset' })).click();

    await expect(headings).toHaveCount(20);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
  });

  test('cancelling the search hides the searchbar and shows every session again', async ({ page }) => {
    test.skip(await isIos(page), 'The iOS searchbar stays under the large title and has no Cancel button');
    const searchbox = await openSearch(page);
    const searchbar = visible(page.locator('ion-searchbar'));
    await searchbox.fill('VUE');
    const headings = visible(page.locator('ion-item-sliding')).getByRole('heading');
    await expect(headings).toHaveCount(2);

    await searchbar.getByRole('button', { name: 'cancel' }).click();

    await expect(searchbar).toHaveCount(0);
    await expect(headings).toHaveCount(20);
  });

  test('shows the empty state when no session matches the search', async ({ page }) => {
    await (await openSearch(page)).fill('no such session');

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('shows only favorited sessions under Favorites', async ({ page }) => {
    await addFavorite(page, 'Ionic Tooling');

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
    await addFavorite(page, 'Ionic Tooling');
    await segmentButton(page, 'Favorites').click();
    await expect(sessionLink(page, 'Ionic Tooling')).toBeVisible();

    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Remove' })).click();
    await expect(page.getByRole('alertdialog', { name: 'Remove Favorite' })).toBeVisible();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click();

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('the filter modal can exclude a track and include it again', async ({ page }) => {
    await button(page, 'Filter').click();
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

    await button(page, 'Filter').click();
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
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('button', { name: 'Deselect All' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('the filter toolbar buttons keep their casing', async ({ page }) => {
    test.skip(await isIos(page), 'Only Material Design uppercases button text');
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');

    // Material Design uppercases button text, and the filter's toolbar buttons opt out of that.
    for (const name of ['Reset', 'Done', 'Deselect All', 'Select All']) {
      await expect(modal.getByRole('button', { name, exact: true })).toHaveCSS('text-transform', 'capitalize');
    }
  });

  test('Select All in the filter modal brings the sessions back after Deselect All', async ({ page }) => {
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('button', { name: 'Deselect All' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();
    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();

    await button(page, 'Filter').click();
    await expect(modal.getByRole('checkbox', { checked: true })).toHaveCount(0);
    await modal.getByRole('button', { name: 'Select All', exact: true }).click();
    await expect(modal.getByRole('checkbox', { checked: false })).toHaveCount(0);
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(20);
    await expect(visible(page.getByText('No Sessions Found'))).toBeHidden();
  });

  test('Reset in the filter deselects every track', async ({ page }) => {
    test.skip(await isIos(page), 'iOS shows Cancel instead of Reset');
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('button', { name: 'Reset' }).click();
    await expect(modal.getByRole('checkbox', { checked: true })).toHaveCount(0);

    await modal.getByRole('checkbox', { name: 'Workshop' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(1);
    await expect(sessionLink(page, 'Ionic Workshop')).toBeVisible();
  });

  test('Cancel in the filter closes it without applying the changes', async ({ page }) => {
    test.skip(!(await isIos(page)), 'Material Design shows Reset instead of Cancel');
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('checkbox', { name: 'Food' }).click();
    await expect(modal.getByRole('checkbox', { name: 'Food' })).not.toBeChecked();

    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).toBeHidden();

    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
    await expect(visible(page.locator('ion-item-sliding'))).toHaveCount(20);

    await button(page, 'Filter').click();
    await expect(modal.getByRole('checkbox', { name: 'Food' })).toBeChecked();
  });

  test('search and the track filter combine', async ({ page }) => {
    await button(page, 'Filter').click();
    const modal = page.locator('ion-modal');
    await modal.getByRole('checkbox', { name: 'Ionic' }).click();
    await modal.getByRole('button', { name: 'Done' }).click();
    await expect(modal).toBeHidden();

    await (await openSearch(page)).fill('ionic');

    // Only the sessions whose name contains "ionic" and that are outside the Ionic track are left.
    const headings = visible(page.locator('ion-item-sliding')).getByRole('heading');
    await expect(headings).toHaveCount(12);
    await expect(sessionLink(page, 'Ionic Tooling')).toBeVisible();
    await expect(sessionLink(page, 'Getting Started with Ionic')).toBeHidden();
    await expect(sessionLink(page, 'Breakfast')).toBeHidden();

    // Clearing the search keeps the track filter.
    await visible(page.getByRole('button', { name: 'reset' })).click();

    await expect(headings).toHaveCount(17);
    await expect(sessionLink(page, 'Breakfast')).toBeVisible();
    await expect(sessionLink(page, 'Getting Started with Ionic')).toBeHidden();
  });

  test('favoriting a session that is already a favorite offers to remove it', async ({ page }) => {
    await addFavorite(page, 'Ionic Tooling');

    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Favorite' })).click();
    const alert = page.getByRole('alertdialog', { name: 'Favorite already added' });
    await expect(alert).toContainText('Would you like to remove this session from your favorites?');
    await alert.getByRole('button', { name: 'Cancel' }).click();
    await expect(alert).toBeHidden();

    // Cancel keeps the favorite.
    await segmentButton(page, 'Favorites').click();
    await expect(visible(page.locator('ion-item-sliding')).getByRole('heading')).toHaveText(['Ionic Tooling']);

    await segmentButton(page, 'All').click();
    await swipeOpen(page, sessionItem(page, 'Ionic Tooling'));
    await visible(page.getByRole('button', { name: 'Favorite' })).click();
    await alert.getByRole('button', { name: 'Remove' }).click();
    await expect(alert).toBeHidden();

    await segmentButton(page, 'Favorites').click();
    await expect(visible(page.getByText('No Sessions Found'))).toBeVisible();
  });

  test('the icon-only buttons have accessible names', async ({ page }) => {
    if (await isIos(page)) {
      // iOS shows the searchbar under the large title instead of a Search button.
      await expect(button(page, 'Search')).toHaveCount(0);
      await expect(visible(page.getByRole('searchbox'))).toBeVisible();
    } else {
      await expect(button(page, 'Search')).toBeVisible();
    }
    await expect(button(page, 'Filter')).toBeVisible();
    await expect(button(page, 'Share')).toBeVisible();
  });

  test('the share button opens the social share buttons', async ({ page }) => {
    const networks = ['Vimeo', 'Instagram', 'Twitter', 'Facebook'];
    for (const name of networks) {
      await expect(button(page, name)).toHaveCount(0);
    }

    await button(page, 'Share').click();

    for (const name of networks) {
      await expect(button(page, name)).toBeVisible();
    }
    // The loading indicator only stays up for one second, so record its message when it opens.
    await page.evaluate(() => {
      document.addEventListener(
        'ionLoadingWillPresent',
        (event) => {
          document.body.dataset.loadingMessage = (event.target as HTMLElement & { message: string }).message;
        },
        { once: true },
      );
    });
    await button(page, 'Vimeo').click();

    await expect(page.locator('body')).toHaveAttribute('data-loading-message', 'Posting to Vimeo');
  });

  test('the posting message shows for one second', async ({ page }) => {
    await button(page, 'Share').click();
    // Record the duration the loading indicator is given and how long it stays open.
    const timing = page.evaluate(
      () =>
        new Promise<{ duration: number; shownFor: number }>((resolve) => {
          document.addEventListener(
            'ionLoadingDidPresent',
            (presented) => {
              const shownAt = performance.now();
              const { duration } = presented.target as HTMLElement & { duration: number };
              document.addEventListener(
                'ionLoadingDidDismiss',
                () => resolve({ duration, shownFor: performance.now() - shownAt }),
                { once: true },
              );
            },
            { once: true },
          );
        }),
    );
    await button(page, 'Vimeo').click();

    const { duration, shownFor } = await timing;
    expect(duration).toBe(1000);
    // It closes itself once the duration is up, plus the time its leave animation takes.
    expect(shownFor).toBeGreaterThanOrEqual(1000);
    expect(shownFor).toBeLessThan(2000);
  });
});

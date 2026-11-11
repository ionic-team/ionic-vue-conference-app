import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { DATA_TIMEOUT, openMenu, openSchedule, visible, visibleTitle } from './helpers';

// The About page has no toolbar title; its content starts with an "About" heading instead.
const expectAboutPage = async (page: Page): Promise<void> => {
  await expect(visible(page.getByRole('heading', { name: 'About', level: 3 }))).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  // Keep the map tests off the network: the tiles are decoration, not app behavior.
  await page.route('https://*.tile.openstreetmap.org/**', (route) => route.abort());
  await openSchedule(page);
});

test.describe('Navigation', () => {
  test('the side menu reaches each page', async ({ page }) => {
    const pages = [
      { link: 'Speakers', url: /\/tabs\/speakers$/, title: 'Speakers' },
      { link: 'Map', url: /\/tabs\/map$/, title: 'Map' },
      { link: 'About', url: /\/tabs\/about$/, title: null },
      { link: 'Login', url: /\/login$/, title: 'Login' },
      { link: 'Support', url: /\/support$/, title: 'Support' },
      { link: 'Signup', url: /\/signup$/, title: 'Signup' },
      { link: 'Schedule', url: /\/tabs\/schedule$/, title: 'Schedule' },
    ];

    for (const { link, url, title } of pages) {
      const menu = await openMenu(page);
      await menu.getByRole('link', { name: link }).click();

      await expect(page).toHaveURL(url);
      await expect(menu).toBeHidden();
      if (title) {
        await expect(visibleTitle(page)).toHaveText(title);
      } else {
        await expectAboutPage(page);
      }
    }
  });

  test('the tab bar reaches each tab', async ({ page }) => {
    const tabs = [
      { name: 'Speakers', url: /\/tabs\/speakers$/ },
      { name: 'Map', url: /\/tabs\/map$/ },
      { name: 'About', url: /\/tabs\/about$/ },
      { name: 'Schedule', url: /\/tabs\/schedule$/ },
    ];

    for (const { name, url } of tabs) {
      await page.getByRole('tab', { name }).click();

      await expect(page).toHaveURL(url);
      await expect(page.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true');
      if (name === 'About') {
        await expectAboutPage(page);
      } else {
        await expect(visibleTitle(page)).toHaveText(name);
      }
    }
  });

  test('the menu reopens the tutorial', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('button', { name: 'Show Tutorial' }).click();

    await expect(page).toHaveURL(/\/tutorial$/);
    await expect(page.getByRole('heading', { name: 'Welcome to ICA' })).toBeVisible();
  });

  test('the Map page renders the map with the conference locations', async ({ page }) => {
    await page.getByRole('tab', { name: 'Map' }).click();
    await expect(visibleTitle(page)).toHaveText('Map');

    const map = visible(page.locator('.map-canvas'));
    await expect(map).toHaveClass(/leaflet-container/);
    await expect(map).toHaveClass(/show-map/);
    await expect(map.getByRole('button', { name: 'Marker' })).toHaveCount(3, { timeout: DATA_TIMEOUT });
  });

  test('the About page shows the conference date and location', async ({ page }) => {
    await page.getByRole('tab', { name: 'About' }).click();

    const about = visible(page.locator('ion-content')).filter({ hasText: 'The Ionic Conference is a one-day event' });
    await expect(about).toContainText('happening on May 17, 2047');
    await expect(about.getByRole('button', { name: 'Location, Madison, WI' })).toBeVisible();
    await expect(about).toContainText('ica2047');
  });

  test('the Support form confirms when a message is sent', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(page.getByText('This does not actually send a support request.')).toBeVisible();

    const message = visible(page.getByRole('textbox', { name: 'Enter your support message below' }));
    await message.fill('The schedule is great!');
    await visible(page.getByRole('button', { name: 'Submit' })).click();

    await expect(page.getByText('Your support request has been sent.')).toBeVisible();
    await expect(message).toHaveValue('');
  });

  test('the dark mode toggle switches the dark palette', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/ion-palette-dark/);

    const menu = await openMenu(page);
    const toggle = menu.getByRole('switch', { name: 'Dark Mode' });
    await toggle.click();

    await expect(toggle).toBeChecked();
    await expect(html).toHaveClass(/ion-palette-dark/);

    await toggle.click();

    await expect(toggle).not.toBeChecked();
    await expect(html).not.toHaveClass(/ion-palette-dark/);
  });
});

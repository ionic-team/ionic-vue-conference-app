import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { button, DATA_TIMEOUT, login, openMenu, openSchedule, visible, visibleTitle } from './helpers';

// The About page has no toolbar title; its content starts with an "About" heading instead.
const expectAboutPage = async (page: Page): Promise<void> => {
  await expect(visible(page.getByRole('heading', { name: 'About', level: 3 }))).toBeVisible();
};

/* Opens the About page's More options popover. */
const openAboutOptions = async (page: Page): Promise<Locator> => {
  await page.getByRole('tab', { name: 'About' }).click();
  await expectAboutPage(page);
  await button(page, 'More options').click();
  const popover = visible(page.locator('ion-popover')).filter({ hasText: 'Learn Ionic' });
  await expect(popover).toBeVisible();
  return popover;
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

  test('the About page shows the location chosen in the location select', async ({ page }) => {
    await page.getByRole('tab', { name: 'About' }).click();
    await expectAboutPage(page);
    const image = (location: string) => visible(page.locator(`.about-header .about-image.${location}`));
    await expect(image('madison')).toHaveCSS('opacity', '1');

    // The select's own button sits under its visible control, so tap the select like a user would.
    await visible(page.locator('ion-select')).click();
    const alert = page.getByRole('alertdialog', { name: 'Select a Location' });
    await alert.getByRole('radio', { name: 'Austin, TX' }).click();
    await alert.getByRole('button', { name: 'OK' }).click();
    await expect(alert).toHaveCount(0);

    await expect(visible(page.getByRole('button', { name: 'Location, Austin, TX' }))).toBeVisible();
    // Each location has its own header image, and the chosen one fades in over the others.
    await expect(image('austin')).toHaveCSS('opacity', '1');
    await expect(image('madison')).toHaveCSS('opacity', '0');
  });

  test('the About page shows the date chosen in the date picker', async ({ page }) => {
    await page.getByRole('tab', { name: 'About' }).click();
    const about = visible(page.locator('ion-content')).filter({ hasText: 'The Ionic Conference is a one-day event' });
    await expect(about).toContainText('happening on May 17, 2047');

    await about.getByRole('button', { name: /^Date/ }).click();
    const picker = visible(page.locator('ion-popover ion-datetime'));
    await picker.getByRole('button', { name: 'Monday, May 20' }).click();

    await expect(about).toContainText('happening on May 20, 2047');
    await expect(about.getByRole('button', { name: 'Date May 20, 2047' })).toBeVisible();
  });

  test('the About page More options open the Ionic links in a new tab', async ({ page, context }) => {
    // The links open external sites; answer them locally so the test stays off the network.
    await context.route(/^https:\/\/(showcase\.)?(ionicframework|github)\.com\//, (route) =>
      route.fulfill({ body: '' }),
    );
    const links = [
      { name: 'Learn Ionic', url: 'https://ionicframework.com/getting-started' },
      { name: 'Documentation', url: 'https://ionicframework.com/docs/' },
      { name: 'Showcase', url: 'https://showcase.ionicframework.com/' },
      { name: 'GitHub Repo', url: 'https://github.com/ionic-team/ionic' },
    ];

    for (const { name, url } of links) {
      const popover = await openAboutOptions(page);
      const popup = page.waitForEvent('popup');
      await popover.getByRole('button', { name }).click();

      const tab = await popup;
      await expect(tab).toHaveURL(url);
      await tab.close();
      await expect(popover).toBeHidden();
      await expect(page).toHaveURL(/\/tabs\/about$/);
    }
  });

  test('the About page More options open the Support page', async ({ page }) => {
    const popover = await openAboutOptions(page);
    await popover.getByRole('button', { name: 'Support' }).click();

    await expect(page).toHaveURL(/\/support$/);
    await expect(popover).toBeHidden();
    await expect(visibleTitle(page)).toHaveText('Support');
  });

  test('the Support page says that messages are not actually sent', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();

    await expect(page.getByText('This does not actually send a support request.')).toBeVisible();
  });

  test('the Support page confirms when a message is sent', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(visibleTitle(page)).toHaveText('Support');

    const message = visible(page.getByRole('textbox', { name: 'Enter your support message below' }));
    await message.fill('The schedule is great!');
    await visible(page.getByRole('button', { name: 'Submit' })).click();

    await expect(page.getByText('Your support request has been sent.')).toBeVisible();
    await expect(message).toHaveValue('');
    await expect(page.getByText('Support message is required')).toBeHidden();
  });

  test('the Support page shows the confirmation even while the notice is still open', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await visible(page.getByRole('textbox', { name: 'Enter your support message below' })).fill(
      'The schedule is great!',
    );
    await expect(page.getByText('This does not actually send a support request.')).toBeVisible();

    await visible(page.getByRole('button', { name: 'Submit' })).click();

    await expect(page.getByText('Your support request has been sent.')).toBeVisible();
    // Sending closes the notice before the confirmation opens. Count the toasts right away instead of
    // waiting, since the notice also closes on its own after 3 seconds.
    expect(await visible(page.locator('ion-toast')).count()).toBe(1);
  });

  test('the Support page requires a message', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(visibleTitle(page)).toHaveText('Support');

    await visible(page.getByRole('button', { name: 'Submit' })).click();

    await expect(visible(page.getByText('Support message is required'))).toBeVisible();
    await expect(page.getByText('Your support request has been sent.')).toHaveCount(0);

    await visible(page.getByRole('textbox', { name: 'Enter your support message below' })).fill('Hello');
    await expect(visible(page.getByText('Support message is required'))).toHaveCount(0);
  });

  test('the Support page asks before leaving with an unsent message', async ({ page }) => {
    let menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(visibleTitle(page)).toHaveText('Support');
    const message = visible(page.getByRole('textbox', { name: 'Enter your support message below' }));
    await message.fill('Unsent message');

    menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Schedule' }).click();
    const alert = page.getByRole('alertdialog', { name: 'Leave this page?' });
    await expect(alert).toContainText('Your support message will not be submitted.');
    await alert.getByRole('button', { name: 'Stay' }).click();

    await expect(alert).toHaveCount(0);
    await expect(page).toHaveURL(/\/support$/);
    await expect(visibleTitle(page)).toHaveText('Support');
    await expect(message).toHaveValue('Unsent message');

    menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Schedule' }).click();
    await alert.getByRole('button', { name: 'Leave' }).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expect(visibleTitle(page)).toHaveText('Schedule');
  });

  test('the Support page asks before showing the tutorial with an unsent message', async ({ page }) => {
    let menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(visibleTitle(page)).toHaveText('Support');
    const message = visible(page.getByRole('textbox', { name: 'Enter your support message below' }));
    await message.fill('Unsent message');

    menu = await openMenu(page);
    await menu.getByRole('button', { name: 'Show Tutorial' }).click();
    const alert = page.getByRole('alertdialog', { name: 'Leave this page?' });
    await alert.getByRole('button', { name: 'Stay' }).click();

    // Staying leaves the menu and the tutorial state as they were.
    await expect(alert).toHaveCount(0);
    await expect(page).toHaveURL(/\/support$/);
    await expect(message).toHaveValue('Unsent message');
    expect(await page.evaluate(() => localStorage.getItem('CapacitorStorage.ion_did_tutorial'))).toBe('true');

    menu = await openMenu(page);
    await menu.getByRole('button', { name: 'Show Tutorial' }).click();
    await alert.getByRole('button', { name: 'Leave' }).click();

    await expect(page).toHaveURL(/\/tutorial$/);
  });

  test('the Support page leaves without asking when the message is empty', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Support' }).click();
    await expect(visibleTitle(page)).toHaveText('Support');

    await (await openMenu(page)).getByRole('link', { name: 'Schedule' }).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expect(visibleTitle(page)).toHaveText('Schedule');
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
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

  test('the dark mode toggle is in the menu while logged in', async ({ page }) => {
    await login(page, 'ionitron');

    const menu = await openMenu(page);
    await expect(menu.getByRole('button', { name: 'Logout' })).toBeVisible();
    await menu.getByRole('switch', { name: 'Dark Mode' }).click();

    await expect(page.locator('html')).toHaveClass(/ion-palette-dark/);
  });
});

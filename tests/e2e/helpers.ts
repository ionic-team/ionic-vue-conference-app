import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

// Generous bound for the first render of anything read from /data/data.json.
export const DATA_TIMEOUT = 15_000;

// Ionic keeps pages it has shown in the DOM (hidden), so only look at visible elements.
export const visible = (locator: Locator): Locator => locator.filter({ visible: true });

export const visibleTitle = (page: Page): Locator => visible(page.locator('ion-title')).first();

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* The link that opens a session from the schedule. */
export const sessionLink = (page: Page, name: string): Locator =>
  visible(page.getByRole('link', { name: new RegExp(`^${escapeRegExp(name)} `) }));

/* A session's sliding item on the schedule (its text lives here, not in the link's shadow root). */
export const sessionItem = (page: Page, name: string): Locator =>
  visible(page.locator('ion-item-sliding')).filter({
    has: page.getByRole('heading', { name, exact: true }),
  });

export const segmentButton = (page: Page, name: 'All' | 'Favorites'): Locator =>
  visible(page.locator('ion-segment-button', { hasText: name }));

/* The visible pages inside the tabs (an outgoing page can still be visible mid-transition). */
export const tabPage = (page: Page): Locator => visible(page.locator('ion-tabs ion-router-outlet > .ion-page'));

/* Whether Ionic picked iOS mode, which it marks on the html element. */
export const isIos = async (page: Page): Promise<boolean> =>
  (await page.locator('html').getAttribute('mode')) === 'ios';

/* The toolbar back button, named "back" in Material Design and labelled "Back" in iOS. */
export const backButton = (page: Page): Locator =>
  // The iOS page transition animates a copy of the back button outside the toolbar and leaves it hidden there.
  visible(page.locator('ion-toolbar').getByRole('button', { name: /^back$/i }));

/* A button found by its exact accessible name, e.g. the toolbar's icon-only "Search" or "Add favorite". */
export const button = (scope: Page | Locator, name: string): Locator =>
  visible(scope.getByRole('button', { name, exact: true }));

/* Shows the schedule's searchbar: iOS has it under the large title, Material Design behind the Search button. */
export const openSearch = async (page: Page): Promise<Locator> => {
  if (!(await isIos(page))) {
    await button(page, 'Search').click();
  }
  return visible(page.getByRole('searchbox'));
};

/* Skips the tutorial and waits for the schedule's sessions to load. */
export const openSchedule = async (page: Page): Promise<void> => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page).toHaveURL(/\/tabs\/schedule$/);
  await expect(sessionLink(page, 'Breakfast')).toBeVisible({ timeout: DATA_TIMEOUT });
};

export const fillCredentials = async (page: Page, username: string, password: string): Promise<void> => {
  await visible(page.getByRole('textbox', { name: 'Username' })).fill(username);
  await visible(page.getByRole('textbox', { name: 'Password' })).fill(password);
};

export const openLogin = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await menu.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(visibleTitle(page)).toHaveText('Login');
};

/* Logs in from the menu's Login page, which then opens the schedule. */
export const login = async (page: Page, username: string): Promise<void> => {
  await openLogin(page);
  await fillCredentials(page, username, 'secret');
  await visible(page.getByRole('button', { name: 'Login' })).click();
  await expect(page).toHaveURL(/\/tabs\/schedule$/);
};

export const openMenu = async (page: Page): Promise<Locator> => {
  const menu = page.getByRole('navigation', { name: 'menu' });
  // Let the menu finish closing if a menu item was just tapped.
  await expect(menu).toBeHidden();
  // Right after a navigation the outgoing page's menu button can still be visible and then
  // disappear mid-click, so retry until the menu is open. Every menu button opens the same menu.
  await expect(async () => {
    if (!(await menu.isVisible())) {
      await visible(page.getByRole('button', { name: 'menu', exact: true }))
        .first()
        .click({ timeout: 1000 });
    }
    await expect(menu).toBeVisible({ timeout: 1000 });
  }).toPass();
  // The menu shows as soon as it starts opening, but only takes focus (and so closes on Escape) once it is open.
  await expect
    .poll(() => menu.evaluate((element) => (element as HTMLElement & { isOpen: () => Promise<boolean> }).isOpen()))
    .toBe(true);
  return menu;
};

/* Swipes a session's sliding item to the left to reveal its options. */
export const swipeOpen = async (page: Page, slidingItem: Locator): Promise<void> => {
  // A sliding item ignores a new swipe while it is still animating closed.
  await expect(slidingItem).not.toHaveClass(/item-sliding-active-slide/);
  const box = await slidingItem.boundingBox();
  if (!box) throw new Error('The item to swipe is not visible');
  const y = box.y + box.height / 2;
  const startX = box.x + box.width - 20;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX - 250, y, { steps: 10 });
  await page.mouse.up();
};

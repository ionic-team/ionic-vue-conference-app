import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

// Generous bound for the first render of anything read from /data/data.json.
export const DATA_TIMEOUT = 15_000;

// Ionic keeps pages it has shown in the DOM (hidden), so only look at visible elements.
export const visible = (locator: Locator): Locator => locator.filter({ visible: true });

export const visibleTitle = (page: Page): Locator => visible(page.locator('ion-title')).first();

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The link that opens a session from the schedule. */
export const sessionLink = (page: Page, name: string): Locator =>
  visible(page.getByRole('link', { name: new RegExp(`^${escapeRegExp(name)} `) }));

/** A session's sliding item on the schedule (its text lives here, not in the link's shadow root). */
export const sessionItem = (page: Page, name: string): Locator =>
  visible(page.locator('ion-item-sliding')).filter({
    has: page.getByRole('heading', { name, exact: true }),
  });

export const segmentButton = (page: Page, name: 'All' | 'Favorites'): Locator =>
  visible(page.locator('ion-segment-button', { hasText: name }));

/** The visible pages inside the tabs (an outgoing page can still be visible mid-transition). */
export const tabPage = (page: Page): Locator => visible(page.locator('ion-tabs ion-router-outlet > .ion-page'));

// The toolbar's icon-only buttons have no accessible name, so find them by position.
// On the schedule (Material Design) they are: search, filter. On a session: favorite, share.
export const endToolbarButtons = (scope: Page | Locator): Locator =>
  visible(scope.locator('ion-header ion-buttons[slot="end"] ion-button'));

/** Skips the tutorial and waits for the schedule's sessions to load. */
export const openSchedule = async (page: Page): Promise<void> => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page).toHaveURL(/\/tabs\/schedule$/);
  await expect(sessionLink(page, 'Breakfast')).toBeVisible({ timeout: DATA_TIMEOUT });
};

export const openMenu = async (page: Page): Promise<Locator> => {
  await visible(page.getByRole('button', { name: 'menu' })).click();
  const menu = page.getByRole('navigation', { name: 'menu' });
  await expect(menu).toBeVisible();
  return menu;
};

/** Swipes a session's sliding item to the left to reveal its options. */
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

import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openMenu, openSchedule, visible, visibleTitle } from './helpers';

const fillCredentials = async (page: Page, username: string, password: string): Promise<void> => {
  await visible(page.getByRole('textbox', { name: 'Username' })).fill(username);
  await visible(page.getByRole('textbox', { name: 'Password' })).fill(password);
};

const openLogin = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await menu.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(visibleTitle(page)).toHaveText('Login');
};

const closeMenu = async (page: Page, menu: Locator): Promise<void> => {
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
};

const expectLoggedOut = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await expect(menu.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Signup' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Account' })).toHaveCount(0);
  await expect(menu.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  await closeMenu(page, menu);
};

test.beforeEach(async ({ page }) => {
  await openSchedule(page);
});

test.describe('Account', () => {
  test('the menu starts logged out', async ({ page }) => {
    await expectLoggedOut(page);
  });

  test('logging in with a username and password opens the schedule', async ({ page }) => {
    await openLogin(page);
    await fillCredentials(page, 'ionitron', 'secret');
    await visible(page.getByRole('button', { name: 'Login' })).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
  });

  test('the Login page links to Signup', async ({ page }) => {
    await openLogin(page);
    await visible(page.getByRole('button', { name: 'Signup' })).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(visibleTitle(page)).toHaveText('Signup');
  });

  test('signing up with a username and password opens the schedule', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Signup' }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await fillCredentials(page, 'ionitron', 'secret');
    await visible(page.getByRole('button', { name: 'Create' })).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
  });

  test('the Account page redirects to Login while logged out', async ({ page }) => {
    await page.goto('/account');

    await expect(page).toHaveURL(/\/login$/);
    await expect(visibleTitle(page)).toHaveText('Login');
  });

  // Login.vue never dispatches the store's logIn action (it is a TODO) and Menu.vue hard-codes
  // `loggedIn` to false, so the user is never marked logged in.
  test.fixme('logging in marks the user logged in', async ({ page }) => {
    await openLogin(page);
    await fillCredentials(page, 'ionitron', 'secret');
    await visible(page.getByRole('button', { name: 'Login' })).click();

    const menu = await openMenu(page);
    await expect(menu.getByRole('link', { name: 'Account' })).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Login' })).toBeHidden();
  });

  // Blocked by the login bug above; Menu.vue's logout() and Account.vue's logOutUser() are also no-ops.
  test.fixme('logging out returns to the logged-out state', async ({ page }) => {
    await openLogin(page);
    await fillCredentials(page, 'ionitron', 'secret');
    await visible(page.getByRole('button', { name: 'Login' })).click();
    await (await openMenu(page)).getByRole('button', { name: 'Logout' }).click();

    const menu = await openMenu(page);
    await expect(menu.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Signup' })).toBeVisible();
  });
});

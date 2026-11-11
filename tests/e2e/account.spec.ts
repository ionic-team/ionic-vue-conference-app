import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { DATA_TIMEOUT, openMenu, openSchedule, visible, visibleTitle } from './helpers';

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

const login = async (page: Page, username: string): Promise<void> => {
  await openLogin(page);
  await fillCredentials(page, username, 'secret');
  await visible(page.getByRole('button', { name: 'Login' })).click();
  await expect(page).toHaveURL(/\/tabs\/schedule$/);
};

const closeMenu = async (page: Page, menu: Locator): Promise<void> => {
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
};

const expectLoggedIn = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await expect(menu.getByRole('link', { name: 'Account' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Logout' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Login' })).toHaveCount(0);
  await expect(menu.getByRole('link', { name: 'Signup' })).toHaveCount(0);
  await closeMenu(page, menu);
};

const expectLoggedOut = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await expect(menu.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Signup' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Account' })).toHaveCount(0);
  await expect(menu.getByRole('button', { name: 'Logout' })).toHaveCount(0);
  await closeMenu(page, menu);
};

const openAccount = async (page: Page): Promise<void> => {
  const menu = await openMenu(page);
  await menu.getByRole('link', { name: 'Account' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(visibleTitle(page)).toHaveText('Account');
};

const accountUsername = (page: Page): Locator => visible(page.locator('ion-content.page-account h2'));

// Waits for the app to come back after a reload (the menu button only shows once it has mounted).
const reload = async (page: Page): Promise<void> => {
  await page.reload();
  await expect(visible(page.getByRole('button', { name: 'menu' }))).toBeVisible({ timeout: DATA_TIMEOUT });
};

test.beforeEach(async ({ page }) => {
  await openSchedule(page);
});

test.describe('Account', () => {
  test('the menu starts logged out', async ({ page }) => {
    await expectLoggedOut(page);
  });

  test('logging in with a username and password opens the schedule', async ({ page }) => {
    await login(page, 'ionitron');
  });

  test('logging in marks the user logged in', async ({ page }) => {
    await login(page, 'ionitron');

    await expectLoggedIn(page);
  });

  test('logging in requires a username and a password', async ({ page }) => {
    await openLogin(page);
    await visible(page.getByRole('button', { name: 'Login' })).click();

    await expect(visible(page.getByText('Username is required'))).toBeVisible();
    await expect(visible(page.getByText('Password is required'))).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    await visible(page.getByRole('textbox', { name: 'Username' })).fill('ionitron');
    await expect(visible(page.getByText('Username is required'))).toHaveCount(0);
    await visible(page.getByRole('button', { name: 'Login' })).click();

    await expect(page).toHaveURL(/\/login$/);
    await expectLoggedOut(page);
  });

  test('a required field shows its message once it has been touched', async ({ page }) => {
    await openLogin(page);
    const username = visible(page.getByRole('textbox', { name: 'Username' }));
    await expect(visible(page.getByText('Username is required'))).toHaveCount(0);

    await username.focus();
    await username.blur();

    await expect(visible(page.getByText('Username is required'))).toBeVisible();
    await expect(visible(page.getByText('Password is required'))).toHaveCount(0);
  });

  test('the Login page links to Signup', async ({ page }) => {
    await openLogin(page);
    await visible(page.getByRole('button', { name: 'Signup' })).click();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(visibleTitle(page)).toHaveText('Signup');
  });

  test('signing up logs the user in', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Signup' }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await fillCredentials(page, 'newbie', 'secret');
    await visible(page.getByRole('button', { name: 'Create' })).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expectLoggedIn(page);
    await openAccount(page);
    await expect(accountUsername(page)).toHaveText('newbie');
  });

  test('signing up requires a username and a password', async ({ page }) => {
    const menu = await openMenu(page);
    await menu.getByRole('link', { name: 'Signup' }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await visible(page.getByRole('textbox', { name: 'Username' })).fill('newbie');
    await visible(page.getByRole('button', { name: 'Create' })).click();

    await expect(visible(page.getByText('Password is required'))).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
    await expectLoggedOut(page);
  });

  test('the Account page redirects to Login while logged out', async ({ page }) => {
    await page.goto('/account');

    await expect(page).toHaveURL(/\/login$/);
    await expect(visibleTitle(page)).toHaveText('Login');
  });

  test('the Account page shows the username and can change it', async ({ page }) => {
    await login(page, 'ionitron');
    await openAccount(page);
    await expect(accountUsername(page)).toHaveText('ionitron');

    await visible(page.getByText('Change Username')).click();
    const alert = page.getByRole('alertdialog', { name: 'Change Username' });
    const input = alert.getByRole('textbox');
    await expect(input).toHaveValue('ionitron');
    await input.fill('capacitor');
    await alert.getByRole('button', { name: 'Ok' }).click();
    await expect(alert).toBeHidden();

    await expect(accountUsername(page)).toHaveText('capacitor');

    // The new username is saved, and the Account page opens directly while logged in.
    await page.reload();
    await expect(accountUsername(page)).toHaveText('capacitor', { timeout: DATA_TIMEOUT });
  });

  test('cancelling the username change keeps the username', async ({ page }) => {
    await login(page, 'ionitron');
    await openAccount(page);

    await visible(page.getByText('Change Username')).click();
    const alert = page.getByRole('alertdialog', { name: 'Change Username' });
    await alert.getByRole('textbox').fill('capacitor');
    await alert.getByRole('button', { name: 'Cancel' }).click();
    await expect(alert).toBeHidden();

    await expect(accountUsername(page)).toHaveText('ionitron');
  });

  test('logging out returns to the logged-out state', async ({ page }) => {
    await login(page, 'ionitron');
    await (await openMenu(page)).getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/tabs\/schedule$/);
    await expectLoggedOut(page);

    // Logging out is saved too.
    await reload(page);
    await expectLoggedOut(page);
  });

  test('logging out from the Account page opens the login page', async ({ page }) => {
    await login(page, 'ionitron');
    await openAccount(page);

    await visible(page.locator('ion-content.page-account').getByText('Logout')).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(visibleTitle(page)).toHaveText('Login');
    await expectLoggedOut(page);
  });

  test('stays logged in after a reload', async ({ page }) => {
    await login(page, 'ionitron');

    await reload(page);

    await expectLoggedIn(page);
    await openAccount(page);
    await expect(accountUsername(page)).toHaveText('ionitron');
  });
});

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { backButton, button, DATA_TIMEOUT, openSchedule, tabPage, visible, visibleTitle } from './helpers';

const speakerCard = (page: Page, name: string) =>
  visible(page.locator('ion-card')).filter({ has: page.getByRole('heading', { name, exact: true }) });

// The speaker list also shows each name as a heading, so find the detail page by its bio's sign-off.
const speakerDetail = (page: Page) => tabPage(page).filter({ hasText: 'Say hello on social media!' });

test.beforeEach(async ({ page }) => {
  await openSchedule(page);
  await page.getByRole('tab', { name: 'Speakers' }).click();
  await expect(page).toHaveURL(/\/tabs\/speakers$/);
});

test.describe('Speakers', () => {
  test('lists the speakers sorted by name with their sessions', async ({ page }) => {
    await expect(visibleTitle(page)).toHaveText('Speakers');

    const names = visible(page.locator('ion-card')).getByRole('heading', { level: 2 });
    await expect(names).toHaveCount(13, { timeout: DATA_TIMEOUT });
    await expect(names.first()).toHaveText('Burt Bear');
    await expect(names.last()).toHaveText('Ted Turtle');

    const burt = speakerCard(page, 'Burt Bear');
    await expect(burt.getByRole('img', { name: 'Burt Bear profile picture' })).toBeVisible();
    await expect(burt.getByRole('heading', { level: 3 })).toHaveText([
      'The Ionic Package',
      'Push Notifications in Ionic',
      'About Burt Bear',
    ]);
  });

  test('opens the speaker detail from the speaker list', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();

    await expect(page).toHaveURL(/\/tabs\/speakers\/speaker\/1$/);
    const detail = speakerDetail(page);
    await expect(detail.getByRole('heading', { name: 'Burt Bear', level: 2 })).toBeVisible();
    await expect(detail.getByRole('img', { name: 'Burt Bear' })).toBeVisible();
    await expect(detail).toContainText("Burt is a Bear. Burt's interests include poetry");
    await expect(detail.getByText('GitHub', { exact: true })).toBeVisible();
  });

  test('the speaker detail Contact and Share buttons have accessible names', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();

    const detail = speakerDetail(page);
    await expect(button(detail, 'Contact')).toBeVisible();
    await expect(button(detail, 'Share')).toBeVisible();
  });

  test('the speaker detail Contact button offers to email or call the speaker', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();

    await button(speakerDetail(page), 'Contact').click();

    const sheet = page.getByRole('dialog', { name: 'Contact Burt Bear' });
    await expect(sheet.getByRole('button')).toHaveText([
      'Email ( burt@example.com )',
      'Call ( +1-541-754-3010 )',
      'Cancel',
    ]);
    await sheet.getByRole('button', { name: 'Cancel' }).click();
    await expect(sheet).toHaveCount(0);
  });

  test('the speaker detail Contact options open the email and phone links', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();
    await expect(speakerDetail(page)).toBeVisible();
    // Record the links instead of opening them, since mailto and tel links would leave the page.
    await page.evaluate(() => {
      window.open = (url) => {
        document.body.dataset.openedUrl = String(url);
        return null;
      };
    });
    const sheet = page.getByRole('dialog', { name: 'Contact Burt Bear' });

    await button(speakerDetail(page), 'Contact').click();
    await sheet.getByRole('button', { name: 'Email ( burt@example.com )' }).click();
    await expect(sheet).toHaveCount(0);
    await expect(page.locator('body')).toHaveAttribute('data-opened-url', 'mailto:burt@example.com');

    await button(speakerDetail(page), 'Contact').click();
    await sheet.getByRole('button', { name: 'Call ( +1-541-754-3010 )' }).click();
    await expect(sheet).toHaveCount(0);
    await expect(page.locator('body')).toHaveAttribute('data-opened-url', 'tel:+1-541-754-3010');
  });

  test('the speaker detail Share button opens the share options', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();

    await button(speakerDetail(page), 'Share').click();

    const sheet = page.getByRole('dialog', { name: 'Share Burt Bear' });
    await expect(sheet.getByRole('button')).toHaveText(['Copy Link', 'Share via ...', 'Cancel']);
    await sheet.getByRole('button', { name: 'Cancel' }).click();
    await expect(sheet).toHaveCount(0);
  });

  test('opens the speaker detail by tapping the speaker', async ({ page }) => {
    await speakerCard(page, 'Rachel Rabbit')
      .getByRole('button', { name: /^Rachel Rabbit profile picture/ })
      .click();

    await expect(page).toHaveURL(/\/tabs\/speakers\/speaker\/12$/);
    await expect(speakerDetail(page).getByRole('heading', { name: 'Rachel Rabbit', level: 2 })).toBeVisible();
  });

  test('opens the session detail from a session on the speaker card', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'The Ionic Package' }).click();

    await expect(page).toHaveURL(/\/tabs\/speakers\/session\/15$/);
    const session = tabPage(page).filter({ has: page.getByRole('heading', { name: 'The Ionic Package', level: 1 }) });
    await expect(session).toContainText('1:30 pm – 2:00 pm');
    await expect(session).toContainText('Grand Ballroom B');
  });

  test('the back button returns from the speaker detail to the speaker list', async ({ page }) => {
    await speakerCard(page, 'Burt Bear').getByRole('button', { name: 'About Burt Bear' }).click();
    await expect(speakerDetail(page)).toBeVisible();

    await backButton(page).click();

    await expect(page).toHaveURL(/\/tabs\/speakers$/);
    await expect(visibleTitle(page)).toHaveText('Speakers');
    await expect(speakerCard(page, 'Burt Bear')).toBeVisible();
  });
});

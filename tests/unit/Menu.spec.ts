import { Preferences } from '@capacitor/preferences';
import { menuController } from '@ionic/vue';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { createTestStore } from './store/createTestStore';

import Menu from '@/components/Menu.vue';
import type { StoreState } from '@/store';

const { push, testStore } = vi.hoisted(() => ({
  push: vi.fn().mockResolvedValue(undefined),
  testStore: { current: null as unknown },
}));

vi.mock('@/store', () => ({ useStore: () => testStore.current }));
vi.mock('@/router', () => ({
  default: { push, currentRoute: { value: { path: '/tabs/schedule' } } },
}));
vi.mock('@ionic/vue', async () => ({
  ...(await import('./ionicStubs')).ionTags(
    'IonContent',
    'IonMenuButton',
    'IonButtons',
    'IonHeader',
    'IonIcon',
    'IonItem',
    'IonLabel',
    'IonList',
    'IonListHeader',
    'IonMenu',
    'IonMenuToggle',
    'IonTitle',
    'IonToolbar',
    'IonToggle',
  ),
  menuController: { enable: vi.fn().mockResolvedValue(undefined) },
}));

// The labels of the menu's items, in order.
const itemLabels = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('ion-label').map((label) => label.text());

// The menu item with this label.
const menuItem = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.findAll('ion-item').find((item) => item.find('ion-label').exists() && item.text() === label)!;

enableAutoUnmount(afterEach);

describe('Menu', () => {
  let store: Store<StoreState>;

  beforeEach(async () => {
    push.mockClear();
    vi.mocked(menuController.enable).mockClear();
    await Preferences.clear();
    store = createTestStore();
    testStore.current = store;
  });

  it('shows Login and Signup while logged out', () => {
    const wrapper = mount(Menu);

    expect(itemLabels(wrapper)).toEqual(expect.arrayContaining(['Login', 'Signup', 'Support']));
    expect(itemLabels(wrapper)).not.toContain('Account');
    expect(itemLabels(wrapper)).not.toContain('Logout');
  });

  it('shows Account and Logout once logged in', async () => {
    const wrapper = mount(Menu);

    await store.dispatch('logIn', 'ionitron');
    await flushPromises();

    expect(itemLabels(wrapper)).toEqual(expect.arrayContaining(['Account', 'Logout', 'Support']));
    expect(itemLabels(wrapper)).not.toContain('Login');
    expect(itemLabels(wrapper)).not.toContain('Signup');
  });

  it.each([false, true])(
    'shows the Dark Mode toggle at the end of the Account list (logged in: %s)',
    async (loggedIn) => {
      if (loggedIn) await store.dispatch('logIn', 'ionitron');
      const wrapper = mount(Menu);
      await flushPromises();

      const account = wrapper.findAll('ion-list').find((list) => list.find('ion-list-header').text() === 'Account')!;
      const items = account.findAll('ion-item');
      expect(items.at(-1)!.find('ion-toggle').text()).toBe('Dark Mode');
      expect(wrapper.findAll('ion-toggle')).toHaveLength(1);
    },
  );

  it('logs out and opens the schedule', async () => {
    await store.dispatch('logIn', 'ionitron');
    const wrapper = mount(Menu);

    await menuItem(wrapper, 'Logout').trigger('click');
    await flushPromises();

    expect(store.state.user.isAuthenticated).toBe(false);
    expect((await Preferences.get({ key: 'hasLoggedIn' })).value).toBeNull();
    expect(push).toHaveBeenCalledWith('/tabs/schedule');
    expect(itemLabels(wrapper)).toEqual(expect.arrayContaining(['Login', 'Signup']));
  });

  it('resets the tutorial flag when opening the tutorial', async () => {
    await Preferences.set({ key: 'ion_did_tutorial', value: 'true' });
    const wrapper = mount(Menu);
    await flushPromises();

    await menuItem(wrapper, 'Show Tutorial').trigger('click');
    await flushPromises();

    expect((await Preferences.get({ key: 'ion_did_tutorial' })).value).toBe('false');
    expect(push).toHaveBeenCalledWith('/tutorial');
    expect(menuController.enable).toHaveBeenCalledWith(false);
  });

  it('keeps the tutorial flag and the menu when the tutorial does not open', async () => {
    await Preferences.set({ key: 'ion_did_tutorial', value: 'true' });
    /* Vue Router resolves with a navigation failure when a guard cancels the navigation. */
    push.mockResolvedValueOnce(new Error('Navigation aborted'));
    const wrapper = mount(Menu);
    await flushPromises();

    await menuItem(wrapper, 'Show Tutorial').trigger('click');
    await flushPromises();

    expect((await Preferences.get({ key: 'ion_did_tutorial' })).value).toBe('true');
    expect(menuController.enable).not.toHaveBeenCalledWith(false);
  });
});

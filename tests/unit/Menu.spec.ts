import { Preferences } from '@capacitor/preferences';
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Menu from '@/components/Menu.vue';

const { push } = vi.hoisted(() => ({
  push: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/store', () => ({
  useStore: () => ({ getters: { isDarkMode: false } }),
}));
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
  beforeEach(async () => {
    push.mockClear();
    await Preferences.clear();
  });

  it('shows Login and Signup while logged out', () => {
    const wrapper = mount(Menu);

    expect(itemLabels(wrapper)).toEqual(expect.arrayContaining(['Login', 'Signup', 'Support']));
    expect(itemLabels(wrapper)).not.toContain('Account');
    expect(itemLabels(wrapper)).not.toContain('Logout');
  });

  it('resets the tutorial flag when opening the tutorial', async () => {
    await Preferences.set({ key: 'ion_did_tutorial', value: 'true' });
    const wrapper = mount(Menu);
    await flushPromises();

    await menuItem(wrapper, 'Show Tutorial').trigger('click');
    await flushPromises();

    expect((await Preferences.get({ key: 'ion_did_tutorial' })).value).toBe('false');
    expect(push).toHaveBeenCalledWith('/tutorial');
  });
});

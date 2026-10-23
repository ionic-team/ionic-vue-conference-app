import { Preferences } from '@capacitor/preferences';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Menu from './Menu.vue';

const { push, slot } = vi.hoisted(() => ({
  push: vi.fn().mockResolvedValue(undefined),
  slot: { template: '<div><slot /></div>' },
}));

vi.mock('@/store', () => ({
  useStore: () => ({ getters: { isDarkMode: false } }),
}));
vi.mock('@/router', () => ({
  default: { push, currentRoute: { value: { path: '/tabs/schedule' } } },
}));
vi.mock('@ionic/vue', () => ({
  IonContent: slot,
  IonMenuButton: slot,
  IonButtons: slot,
  IonHeader: slot,
  IonIcon: slot,
  IonItem: slot,
  IonLabel: slot,
  IonList: slot,
  IonListHeader: slot,
  IonMenu: slot,
  IonMenuToggle: slot,
  IonTitle: slot,
  IonToolbar: slot,
  IonToggle: slot,
  menuController: { enable: vi.fn().mockResolvedValue(undefined) },
}));

describe('Menu', () => {
  beforeEach(async () => {
    push.mockClear();
    await Preferences.clear();
  });

  it('resets the tutorial flag when opening the tutorial', async () => {
    await Preferences.set({ key: 'ion_did_tutorial', value: 'true' });
    const wrapper = mount(Menu);
    await flushPromises();

    await (wrapper.vm as any).openTutorial();

    expect((await Preferences.get({ key: 'ion_did_tutorial' })).value).toBe('false');
    expect(push).toHaveBeenCalledWith('/tutorial');
  });
});

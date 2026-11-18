import { Preferences } from '@capacitor/preferences';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Tutorial from '@/views/Tutorial.vue';

const { navigate, slot } = vi.hoisted(() => ({
  navigate: vi.fn(),
  slot: { template: '<div><slot /></div>' },
}));

// plugin-vue turns the absolute image paths in the template into imports.
vi.mock('/assets/img/ica-slidebox-img-1.png', () => ({ default: '' }));
vi.mock('/assets/img/ica-slidebox-img-2.png', () => ({ default: '' }));
vi.mock('/assets/img/ica-slidebox-img-3.png', () => ({ default: '' }));
vi.mock('/assets/img/ica-slidebox-img-4.png', () => ({ default: '' }));

vi.mock('@ionic/vue', () => ({
  IonPage: slot,
  IonHeader: slot,
  IonToolbar: slot,
  IonButtons: slot,
  IonContent: slot,
  IonIcon: slot,
  IonButton: slot,
  menuController: { enable: vi.fn().mockResolvedValue(undefined) },
  useIonRouter: () => ({ navigate }),
}));

describe('Tutorial', () => {
  beforeEach(async () => {
    navigate.mockClear();
    await Preferences.clear();
  });

  it('shows the tutorial when it was not done yet', async () => {
    const wrapper = mount(Tutorial);
    await flushPromises();

    expect(navigate).not.toHaveBeenCalled();
    expect(wrapper.find('.slider').exists()).toBe(true);
  });

  it('goes to the schedule when the tutorial was already done', async () => {
    await Preferences.set({ key: 'ion_did_tutorial', value: 'true' });

    const wrapper = mount(Tutorial);
    await flushPromises();

    expect(navigate).toHaveBeenCalledWith('/tabs/schedule', 'root', 'replace');
    expect(wrapper.find('.slider').exists()).toBe(false);
  });

  it('saves the tutorial as done when skipping it', async () => {
    const wrapper = mount(Tutorial);
    await flushPromises();

    await (wrapper.vm as any).navigateToSchedule();

    expect((await Preferences.get({ key: 'ion_did_tutorial' })).value).toBe('true');
    expect(navigate).toHaveBeenCalledWith('/tabs/schedule', 'root', 'replace');
  });
});

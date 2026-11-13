import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick, reactive } from 'vue';

import About from '@/views/About.vue';

const { store } = vi.hoisted(() => ({
  store: { current: null as unknown },
}));

vi.mock('vuex', () => ({ useStore: () => store.current }));
vi.mock('@/router', () => ({ default: { push: vi.fn() } }));
vi.mock('@ionic/vue', async () => {
  const { ionInput, ionTags } = await import('./ionicStubs');
  return {
    ...ionTags('IonContent', 'IonHeader', 'IonToolbar', 'IonPage', 'IonButtons', 'IonMenuButton', 'IonButton'),
    ...ionTags('IonIcon', 'IonList', 'IonLabel', 'IonItem', 'IonText', 'IonSelect', 'IonSelectOption', 'IonPopover'),
    IonDatetime: ionInput('ion-datetime'),
    popoverController: { getTop: vi.fn() },
  };
});

const mountAbout = async (schedule: { date: string }[] = []) => {
  const state = reactive({ sessions: { schedule } });
  store.current = { state };
  const wrapper = mount(About);
  await flushPromises();
  return { wrapper, state };
};

// The Date row shows the conference date.
const shownDate = (wrapper: Awaited<ReturnType<typeof mountAbout>>['wrapper']) =>
  wrapper
    .findAll('ion-item')
    .find((item) => item.text().startsWith('Date'))!
    .find('ion-text')
    .text();

enableAutoUnmount(afterEach);

describe('About', () => {
  it('shows the date of the loaded schedule', async () => {
    const { wrapper, state } = await mountAbout();
    expect(shownDate(wrapper)).toBe('May 17, 2047');

    state.sessions.schedule = [{ date: '2047-05-18' }];
    await nextTick();

    expect(shownDate(wrapper)).toBe('May 18, 2047');
  });

  it('shows the date picked in the date picker', async () => {
    const { wrapper } = await mountAbout([{ date: '2047-05-17' }]);

    await wrapper.find('input').setValue('2047-05-20');

    expect(shownDate(wrapper)).toBe('May 20, 2047');
    expect(wrapper.find('p').text()).toContain('May 20, 2047');
  });
});

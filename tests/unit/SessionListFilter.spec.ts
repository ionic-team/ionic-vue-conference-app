import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import SessionListFilter from '@/views/SessionListFilter.vue';

const { dismiss, store } = vi.hoisted(() => ({
  dismiss: vi.fn(),
  store: {
    state: { sessions: { isFirstLoad: false, trackFilters: [] as string[] } },
    commit: vi.fn(),
  },
}));

vi.mock('@/store', () => ({ default: store }));

vi.mock('@ionic/vue', async () => ({
  ...(await import('./ionicStubs')).ionTags(
    'IonPage',
    'IonHeader',
    'IonToolbar',
    'IonButtons',
    'IonButton',
    'IonContent',
    'IonList',
    'IonIcon',
    'IonItem',
    'IonTitle',
    'IonListHeader',
    'IonFooter',
  ),
  IonCheckbox: defineComponent({
    props: { modelValue: Boolean },
    emits: ['update:modelValue'],
    setup:
      (props, { emit, slots }) =>
      () =>
        h('label', [
          h('input', {
            type: 'checkbox',
            checked: props.modelValue,
            onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).checked),
          }),
          slots.default?.(),
        ]),
  }),
  modalController: { dismiss },
}));

const allTracks = [{ name: 'Food' }, { name: 'Ionic' }, { name: 'Vue' }];

const mountFilter = async () => {
  const wrapper = mount(SessionListFilter, { props: { allTracks } });
  await flushPromises();
  return wrapper;
};

const checkedTracks = (wrapper: Awaited<ReturnType<typeof mountFilter>>) =>
  wrapper
    .findAll('label')
    .filter((label) => (label.find('input').element as HTMLInputElement).checked)
    .map((label) => label.text());

const clickButton = async (wrapper: Awaited<ReturnType<typeof mountFilter>>, text: string) => {
  await wrapper
    .findAll('ion-button')
    .find((button) => button.text() === text)!
    .trigger('click');
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
  store.state.sessions.isFirstLoad = false;
  store.state.sessions.trackFilters = ['Food', 'Vue'];
});

describe('SessionListFilter', () => {
  it('lists every track and checks the included ones', async () => {
    const wrapper = await mountFilter();

    expect(wrapper.findAll('label').map((label) => label.text())).toEqual(['Food', 'Ionic', 'Vue']);
    expect(checkedTracks(wrapper)).toEqual(['Food', 'Vue']);
  });

  it('checks every track on the first load', async () => {
    store.state.sessions.isFirstLoad = true;

    const wrapper = await mountFilter();

    expect(checkedTracks(wrapper)).toEqual(['Food', 'Ionic', 'Vue']);
    expect(store.commit).toHaveBeenCalledWith('setFirstLoad', false);
  });

  it('dismisses with the checked tracks when Done is tapped', async () => {
    const wrapper = await mountFilter();

    await wrapper.findAll('input')[0].setValue(false);
    await wrapper.findAll('input')[1].setValue(true);
    await clickButton(wrapper, 'Done');

    expect(dismiss).toHaveBeenCalledWith(['Ionic', 'Vue']);
  });

  it('deselects and selects every track', async () => {
    const wrapper = await mountFilter();

    await clickButton(wrapper, 'Deselect All');
    expect(checkedTracks(wrapper)).toEqual([]);

    await clickButton(wrapper, 'Select All');
    expect(checkedTracks(wrapper)).toEqual(['Food', 'Ionic', 'Vue']);

    await clickButton(wrapper, 'Done');
    expect(dismiss).toHaveBeenCalledWith(['Food', 'Ionic', 'Vue']);
  });

  it('deselects every track with Reset on Material Design', async () => {
    const wrapper = await mountFilter();

    await clickButton(wrapper, 'Reset');

    expect(checkedTracks(wrapper)).toEqual([]);
  });
});

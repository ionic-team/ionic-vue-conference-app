import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { stubFetch } from './fixtures';
import { createTestStore } from './store/createTestStore';

import type { StoreState } from '@/store';
import SpeakerList from '@/views/SpeakerList.vue';

const { push, testStore } = vi.hoisted(() => ({ push: vi.fn(), testStore: { current: null as unknown } }));

vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/store', () => ({ useStore: () => testStore.current }));
vi.mock('@ionic/vue', async () =>
  (await import('./ionicStubs')).ionTags(
    'IonPage',
    'IonHeader',
    'IonToolbar',
    'IonButtons',
    'IonMenuButton',
    'IonContent',
    'IonList',
    'IonItem',
    'IonTitle',
    'IonGrid',
    'IonRow',
    'IonCol',
    'IonLabel',
    'IonCard',
    'IonCardContent',
    'IonCardHeader',
    'IonAvatar',
  ),
);

let store: Store<StoreState>;

const mountSpeakerList = async () => {
  const wrapper = mount(SpeakerList);
  await flushPromises();
  return wrapper;
};

const card = (wrapper: Awaited<ReturnType<typeof mountSpeakerList>>, name: string) =>
  wrapper.findAll('ion-card').find((c) => c.find('h2').text() === name)!;

enableAutoUnmount(afterEach);

beforeEach(() => {
  push.mockClear();
  stubFetch();
  store = createTestStore();
  testStore.current = store;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SpeakerList', () => {
  it('loads the speakers and lists them by name', async () => {
    const wrapper = await mountSpeakerList();

    expect(wrapper.findAll('ion-card h2').map((h2) => h2.text())).toEqual([
      'Ellie Elephant',
      'Rachel Rabbit',
      'Ted Turtle',
    ]);
    expect(card(wrapper, 'Ted Turtle').find('img').attributes('alt')).toBe('Ted Turtle profile picture');
  });

  it("lists each speaker's sessions", async () => {
    const wrapper = await mountSpeakerList();

    expect(
      card(wrapper, 'Rachel Rabbit')
        .findAll('h3')
        .map((h3) => h3.text()),
    ).toEqual(['Ionic Tooling', 'Migrating to Vue', 'About Rachel Rabbit']);
    expect(
      card(wrapper, 'Ellie Elephant')
        .findAll('h3')
        .map((h3) => h3.text()),
    ).toEqual(['University of Ionic', 'About Ellie Elephant']);
  });

  it('opens a speaker and one of their sessions', async () => {
    const wrapper = await mountSpeakerList();
    const items = card(wrapper, 'Rachel Rabbit').findAll('ion-item');

    await items.find((item) => item.text() === 'About Rachel Rabbit')!.trigger('click');
    expect(push).toHaveBeenLastCalledWith('/tabs/speakers/speaker/3');

    await items.find((item) => item.text() === 'Ionic Tooling')!.trigger('click');
    expect(push).toHaveBeenLastCalledWith('/tabs/speakers/session/3');
  });
});

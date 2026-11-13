import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { star, starOutline } from 'ionicons/icons';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { stubFetch } from './fixtures';
import { createTestStore } from './store/createTestStore';

import type { StoreState } from '@/store';
import SessionDetail from '@/views/SessionDetail.vue';

const { route, testStore } = vi.hoisted(() => ({
  route: { params: { sessionId: '2' } },
  testStore: { current: null as unknown },
}));

vi.mock('vue-router', () => ({ useRoute: () => route }));
vi.mock('@/store', () => ({ useStore: () => testStore.current }));
vi.mock('@ionic/vue', async () =>
  (await import('./ionicStubs')).ionTags(
    'IonPage',
    'IonHeader',
    'IonToolbar',
    'IonButtons',
    'IonButton',
    'IonIcon',
    'IonContent',
    'IonList',
    'IonLabel',
    'IonItem',
    'IonBackButton',
    'IonText',
  ),
);

let store: Store<StoreState>;

const mountSessionDetail = async () => {
  const wrapper = mount(SessionDetail);
  await flushPromises();
  return wrapper;
};

// The first button in the end slot is the favorite star.
const favoriteButton = (wrapper: Awaited<ReturnType<typeof mountSessionDetail>>) =>
  wrapper.find('ion-buttons[slot="end"] ion-button');

enableAutoUnmount(afterEach);

beforeEach(() => {
  stubFetch();
  route.params.sessionId = '2';
  store = createTestStore();
  testStore.current = store;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionDetail', () => {
  it('loads the sessions and shows the session from the route', async () => {
    const wrapper = await mountSessionDetail();

    expect(wrapper.find('h1').text()).toBe('Getting Started with Ionic');
    expect(wrapper.find('.session-track-ionic').text()).toBe('Ionic');
    expect(wrapper.find('ion-text').text()).toContain('9:30 am – 9:45 am');
    expect(wrapper.find('ion-text').text()).toContain('Hall 2');
  });

  it('shows the session whose id is in the route', async () => {
    route.params.sessionId = '3';

    const wrapper = await mountSessionDetail();

    expect(wrapper.find('h1').text()).toBe('Ionic Tooling');
  });

  it('toggles the session as a favorite', async () => {
    const wrapper = await mountSessionDetail();
    expect(favoriteButton(wrapper).find('ion-icon').attributes('icon')).toBe(starOutline);

    await favoriteButton(wrapper).trigger('click');

    expect(store.state.sessions.favoriteSessions).toEqual([2]);
    expect(favoriteButton(wrapper).find('ion-icon').attributes('icon')).toBe(star);

    await favoriteButton(wrapper).trigger('click');

    expect(store.state.sessions.favoriteSessions).toEqual([]);
    expect(favoriteButton(wrapper).find('ion-icon').attributes('icon')).toBe(starOutline);
  });

  it('labels the favorite button with what tapping it does', async () => {
    const wrapper = await mountSessionDetail();
    const label = () => favoriteButton(wrapper).attributes('aria-label');
    expect(label()).toBe('Add favorite');

    await favoriteButton(wrapper).trigger('click');
    expect(label()).toBe('Remove favorite');

    await favoriteButton(wrapper).trigger('click');
    expect(label()).toBe('Add favorite');
  });
});

import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { stubFetch } from './fixtures';
import { createTestStore } from './store/createTestStore';

import type { StoreState } from '@/store';
import SessionList from '@/views/SessionList.vue';

const { alertCreate } = vi.hoisted(() => ({ alertCreate: vi.fn() }));

// Render each Ionic component as its own tag so the test can find groups, items and dividers.
vi.mock('@ionic/vue', async () => ({
  ...(await import('./ionicStubs')).ionTags(
    'IonPage',
    'IonHeader',
    'IonTitle',
    'IonToolbar',
    'IonButtons',
    'IonMenuButton',
    'IonSegment',
    'IonSegmentButton',
    'IonButton',
    'IonIcon',
    'IonSearchbar',
    'IonContent',
    'IonList',
    'IonItemGroup',
    'IonItemDivider',
    'IonLabel',
    'IonItemSliding',
    'IonItem',
    'IonItemOptions',
    'IonItemOption',
    'IonListHeader',
    'IonFab',
    'IonFabButton',
    'IonFabList',
  ),
  alertController: { create: alertCreate },
  modalController: { create: vi.fn() },
  loadingController: { create: vi.fn() },
  menuController: { enable: vi.fn() },
}));

type AlertOptions = { header: string; buttons: { text: string; handler: () => void }[] };

let store: Store<StoreState>;

const mountSessionList = async () => {
  const wrapper = mount(SessionList, { global: { plugins: [store] } });
  await flushPromises();
  return wrapper;
};

const groups = (wrapper: Awaited<ReturnType<typeof mountSessionList>>) =>
  wrapper
    .findAll('ion-item-group')
    .filter((group) => group.attributes('hidden') === undefined)
    .map((group) => ({
      time: group.find('ion-item-divider').text(),
      sessions: group.findAll('h3').map((h3) => h3.text()),
    }));

// The sliding item's favorite option for a session.
const favoriteOption = (wrapper: Awaited<ReturnType<typeof mountSessionList>>, name: string) =>
  wrapper
    .findAll('ion-item-sliding')
    .find((item) => item.find('h3').text() === name)!
    .find('ion-item-option');

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
  stubFetch();
  store = createTestStore();
  alertCreate.mockResolvedValue({ present: vi.fn() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionList', () => {
  it('loads the sessions and groups them by time, earliest first within a group', async () => {
    const wrapper = await mountSessionList();

    expect(groups(wrapper)).toEqual([
      { time: '8:00 am', sessions: ['Breakfast'] },
      { time: '9:15 am', sessions: ['University of Ionic', 'Getting Started with Ionic', 'Ionic Tooling'] },
      { time: '10:00 am', sessions: ['Migrating to Vue'] },
    ]);
    expect(wrapper.find('ion-item').attributes('router-link')).toBe('/tabs/schedule/session/1');
  });

  it('shows the times and location of each session', async () => {
    const wrapper = await mountSessionList();

    expect(wrapper.find('ion-item-sliding p').text()).toBe('8:00 am — 9:00 am: Dining Hall');
  });

  it('updates the list when the search changes', async () => {
    const wrapper = await mountSessionList();

    await (wrapper.vm as any).updateSearchTerm({ detail: { value: 'tooling' } });
    await flushPromises();

    expect(store.state.sessions.searchText).toBe('tooling');
    expect(groups(wrapper)).toEqual([{ time: '9:15 am', sessions: ['Ionic Tooling'] }]);
  });

  it('shows the empty state when nothing matches', async () => {
    const wrapper = await mountSessionList();

    await store.dispatch('setSearchText', 'nothing matches this');
    await flushPromises();

    expect(groups(wrapper)).toEqual([]);
    expect(wrapper.find('ion-list-header').isVisible()).toBe(true);
  });

  it('shows only favorites in the Favorites segment', async () => {
    const wrapper = await mountSessionList();
    await store.dispatch('addFavorite', 3);

    (wrapper.vm as any).updateSegment({ detail: { value: 'favorites' } });
    await flushPromises();

    expect(groups(wrapper)).toEqual([{ time: '9:15 am', sessions: ['Ionic Tooling'] }]);
  });

  it('favorites a session from its sliding item', async () => {
    const wrapper = await mountSessionList();

    await favoriteOption(wrapper, 'Ionic Tooling').trigger('click');
    await flushPromises();

    expect(store.state.sessions.favoriteSessions).toEqual([3]);
    expect(alertCreate).toHaveBeenCalledWith(expect.objectContaining({ header: 'Favorite Added' }));
  });

  it('offers to remove a session that is already a favorite', async () => {
    const wrapper = await mountSessionList();
    await store.dispatch('addFavorite', 3);

    await favoriteOption(wrapper, 'Ionic Tooling').trigger('click');
    await flushPromises();

    const alert = alertCreate.mock.calls[0][0] as AlertOptions;
    expect(alert.header).toBe('Favorite already added');

    // The handler closes the sliding item, which the stub doesn't have.
    vi.spyOn(HTMLElement.prototype, 'closest').mockReturnValue({ close: vi.fn() } as any);
    alert.buttons.find((button) => button.text === 'Remove')!.handler();

    expect(store.state.sessions.favoriteSessions).toEqual([]);
  });
});

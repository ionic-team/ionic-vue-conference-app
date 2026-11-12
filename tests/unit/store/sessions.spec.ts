import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { conferenceData, stubFetch } from '../fixtures';

import { createTestStore } from './createTestStore';

import type { StoreState } from '@/store';
import type { Session } from '@/store/modules/sessions';

const session = (overrides: Partial<Session>): Session => ({
  id: 1,
  timeStart: '8:00 am',
  timeEnd: '9:00 am',
  name: 'Session',
  location: 'Hall 1',
  description: '',
  speakerIds: [],
  tracks: ['Ionic'],
  selectedTrackFilters: [],
  groupTime: '8:00 am',
  ...overrides,
});

const sessions: Session[] = [
  session({ id: 1, name: 'Breakfast', tracks: ['Food'] }),
  session({ id: 2, name: 'Getting Started with Ionic', tracks: ['Ionic'] }),
  session({ id: 3, name: 'Ionic Tooling', tracks: ['Tooling'] }),
  session({ id: 4, name: 'Migrating to Vue', tracks: ['Ionic', 'Vue'] }),
];

const names = (list: Session[]) => list.map((s) => s.name);

let store: Store<StoreState>;

beforeEach(() => {
  store = createTestStore();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('sessions getters', () => {
  beforeEach(() => {
    store.commit('updateSessions', sessions);
    store.commit('updateTrackFilters', ['Food', 'Ionic', 'Tooling', 'Vue']);
  });

  it('lists every session when all tracks are included and there is no search', () => {
    expect(names(store.getters.allFiltered)).toEqual(names(sessions));
  });

  it('filters sessions by name, ignoring case', () => {
    store.commit('setSearchText', 'IONIC');

    expect(names(store.getters.allFiltered)).toEqual(['Getting Started with Ionic', 'Ionic Tooling']);
  });

  it('matches the search anywhere in the name', () => {
    store.commit('setSearchText', 'ting');

    expect(names(store.getters.allFiltered)).toEqual(['Getting Started with Ionic', 'Migrating to Vue']);
  });

  it('shows every session again when the search is cleared', () => {
    store.commit('setSearchText', 'tooling');
    store.commit('setSearchText', '');

    expect(store.getters.allFiltered).toHaveLength(sessions.length);
  });

  it('hides the sessions of an excluded track', () => {
    store.commit('removeTrackFilter', 'Food');

    expect(names(store.getters.allFiltered)).not.toContain('Breakfast');
    expect(store.getters.allFiltered).toHaveLength(3);
  });

  it('hides a session when any one of its tracks is excluded', () => {
    store.commit('removeTrackFilter', 'Vue');

    expect(names(store.getters.allFiltered)).not.toContain('Migrating to Vue');
  });

  it('shows the sessions of a track again when it is included', () => {
    store.commit('removeTrackFilter', 'Food');
    store.commit('addTrackFilter', 'Food');

    expect(names(store.getters.allFiltered)).toContain('Breakfast');
  });

  it('shows no sessions when every track is excluded', () => {
    store.commit('updateTrackFilters', []);

    expect(store.getters.allFiltered).toEqual([]);
    expect(store.getters.favoritesFiltered).toEqual([]);
  });

  it('combines the search with the track filters', () => {
    store.commit('setSearchText', 'ionic');
    store.commit('removeTrackFilter', 'Tooling');

    expect(names(store.getters.allFiltered)).toEqual(['Getting Started with Ionic']);
  });

  it('lists only favorite sessions under favorites', () => {
    expect(store.getters.favoritesFiltered).toEqual([]);

    store.commit('addFavorite', 3);
    store.commit('addFavorite', 1);

    expect(names(store.getters.favoritesFiltered)).toEqual(['Breakfast', 'Ionic Tooling']);
  });

  it('applies the search and track filters to favorites too', () => {
    store.commit('updateFavoriteFilter', [1, 2, 3]);
    store.commit('setSearchText', 'ionic');
    store.commit('removeTrackFilter', 'Tooling');

    expect(names(store.getters.favoritesFiltered)).toEqual(['Getting Started with Ionic']);
  });

  it('lists the tracks used by the sessions once, sorted', () => {
    expect(store.getters.allTracks).toEqual(['Food', 'Ionic', 'Tooling', 'Vue']);
  });

  it('sorts the tracks shown in the filter by name', () => {
    store.commit('setTracks', conferenceData.tracks);

    expect(store.getters.allTracksFilter.map((t: { name: string }) => t.name)).toEqual([
      'Food',
      'Ionic',
      'Tooling',
      'Vue',
    ]);
  });

  it('finds the start time of the earliest session', () => {
    store.commit('updateSessions', [
      session({ id: 1, timeStart: '10:30:00' }),
      session({ id: 2, timeStart: '08:15:00' }),
      session({ id: 3, timeStart: '09:00:00' }),
    ]);

    expect(store.getters.conferenceStart).toBe('08:15:00');
  });

  it('has no conference start without sessions', () => {
    store.commit('updateSessions', []);

    expect(store.getters.conferenceStart).toBeNull();
  });
});

describe('sessions mutations', () => {
  it('adds a favorite only once and removes it', () => {
    store.commit('addFavorite', 2);
    store.commit('addFavorite', 2);
    expect(store.state.sessions.favoriteSessions).toEqual([2]);

    store.commit('removeFavorite', 2);
    expect(store.state.sessions.favoriteSessions).toEqual([]);
  });

  it('adds a track filter only once and removes it', () => {
    store.commit('addTrackFilter', 'Ionic');
    store.commit('addTrackFilter', 'Ionic');
    store.commit('addTrackFilter', 'Vue');
    expect(store.state.sessions.trackFilters).toEqual(['Ionic', 'Vue']);

    store.commit('removeTrackFilter', 'Ionic');
    expect(store.state.sessions.trackFilters).toEqual(['Vue']);
  });
});

describe('sessions actions', () => {
  it('loads the sessions from the conference data', async () => {
    const fetch = stubFetch();

    await store.dispatch('loadSessionData');

    expect(fetch).toHaveBeenCalledWith('/data/data.json');
    expect(store.state.sessions.schedule).toEqual(conferenceData.schedule);
    expect(store.state.sessions.sessions).toHaveLength(5);
    expect(store.state.sessions.sessions[1]).toEqual({
      id: 2,
      timeStart: '9:30 am',
      timeEnd: '9:45 am',
      name: 'Getting Started with Ionic',
      location: 'Hall 2',
      description: 'Mobile devices and browsers are now advanced enough...',
      speakerIds: [1],
      tracks: ['Ionic'],
      selectedTrackFilters: [],
      groupTime: '9:15 am',
    });
  });

  it('links sessions to their speakers by name and defaults missing fields', async () => {
    stubFetch();

    await store.dispatch('loadSessionData');

    const byId = (id: number) => store.state.sessions.sessions.find((s) => s.id === id)!;
    expect(byId(5).speakerIds).toEqual([3, 1]);
    expect(byId(1).speakerIds).toEqual([]);
    expect(byId(1).description).toBe('');
  });

  it('includes every track on the first load only', async () => {
    stubFetch();

    await store.dispatch('loadSessionData');

    expect(store.state.sessions.trackFilters).toEqual(['Food', 'Ionic', 'Tooling', 'Vue']);
    expect(store.state.sessions.isFirstLoad).toBe(false);

    store.commit('removeTrackFilter', 'Food');
    await store.dispatch('loadSessionData');

    expect(store.state.sessions.trackFilters).toEqual(['Ionic', 'Tooling', 'Vue']);
  });

  it('keeps the current sessions when loading fails', async () => {
    store.commit('updateSessions', sessions);
    stubFetch({}, false);

    await store.dispatch('loadSessionData');

    expect(store.state.sessions.sessions).toEqual(sessions);
    expect(console.error).toHaveBeenCalledWith('Error loading session data:', expect.any(Error));
  });

  it('loads the tracks for the filter', async () => {
    stubFetch();

    await store.dispatch('fetchTracks');

    expect(store.state.sessions.tracks).toEqual(conferenceData.tracks);
  });

  it('keeps the tracks when loading them fails', async () => {
    stubFetch({}, false);

    await store.dispatch('fetchTracks');

    expect(store.state.sessions.tracks).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading tracks data:', expect.any(Error));
  });

  it('updates the search, track filters and favorites', async () => {
    await store.dispatch('setSearchText', 'vue');
    await store.dispatch('updateTrackFilters', ['Vue']);
    await store.dispatch('addTrackFilter', 'Ionic');
    await store.dispatch('removeTrackFilter', 'Vue');
    await store.dispatch('addFavorite', 4);
    await store.dispatch('addFavorite', 5);
    await store.dispatch('removeFavorite', 4);

    expect(store.state.sessions.searchText).toBe('vue');
    expect(store.state.sessions.trackFilters).toEqual(['Ionic']);
    expect(store.state.sessions.favoriteSessions).toEqual([5]);

    await store.dispatch('updateFavoriteFilter', [1, 2]);
    expect(store.state.sessions.favoriteSessions).toEqual([1, 2]);
  });
});

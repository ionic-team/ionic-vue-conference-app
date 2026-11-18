import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { stubFetch } from '../fixtures';

import { createTestStore } from './createTestStore';

import type { StoreState } from '@/store';

let store: Store<StoreState>;

beforeEach(() => {
  store = createTestStore();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('speakers', () => {
  it('loads the speakers from the conference data', async () => {
    const fetch = stubFetch();

    const speakers = await store.dispatch('loadSpeakerData');

    expect(fetch).toHaveBeenCalledWith('/data/data.json');
    expect(store.state.speakers.speakers).toEqual(speakers);
    expect(store.state.speakers.speakers[0]).toEqual({
      id: 1,
      name: 'Ted Turtle',
      profilePic: '/assets/img/speakers/turtle.jpg',
      twitter: 'ionicframework',
      github: '',
      instagram: '',
      about: 'Ted is a Turtle.',
      title: 'Software Engineer',
      location: 'Everywhere',
      email: 'ted@example.com',
      phone: '+1-541-754-3010',
      sessions: [],
    });
  });

  it('fills the missing speaker fields with empty values', async () => {
    stubFetch();

    await store.dispatch('loadSpeakerData');

    expect(store.state.speakers.speakers[1]).toMatchObject({
      id: 2,
      name: 'Ellie Elephant',
      twitter: '',
      about: '',
      title: '',
      email: '',
      sessions: [],
    });
  });

  it('rejects and keeps the current speakers when loading fails', async () => {
    stubFetch({}, false);

    await expect(store.dispatch('loadSpeakerData')).rejects.toThrow('HTTP error! Status: 500');

    expect(store.state.speakers.speakers).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading speaker data:', expect.any(Error));
  });

  it('finds speakers by id and sorts them by name', async () => {
    stubFetch();
    await store.dispatch('loadSpeakerData');

    expect(store.getters.allSpeakers).toHaveLength(3);
    expect(store.getters.getSpeakerById(3).name).toBe('Rachel Rabbit');
    expect(store.getters.getSpeakerById(99)).toBeUndefined();
    expect(store.getters.getSpeakersByIds([1, 3]).map((s: { name: string }) => s.name)).toEqual([
      'Ted Turtle',
      'Rachel Rabbit',
    ]);
    expect(store.getters.getSpeakersSortedByName.map((s: { name: string }) => s.name)).toEqual([
      'Ellie Elephant',
      'Rachel Rabbit',
      'Ted Turtle',
    ]);
  });
});

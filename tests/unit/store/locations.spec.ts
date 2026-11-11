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

describe('locations', () => {
  it('loads the map locations and numbers them', async () => {
    const fetch = stubFetch();

    await store.dispatch('locations/loadLocations');

    expect(fetch).toHaveBeenCalledWith('/data/data.json');
    expect(store.state.locations.locations).toEqual([
      { id: 1, name: 'Monona Terrace Convention Center', lat: 43.071584, lng: -89.38012, center: true },
      { id: 2, name: 'Ionic HQ', lat: 43.074395, lng: -89.381056 },
    ]);
  });

  it('falls back to the convention center when the data has no map', async () => {
    stubFetch({ schedule: [] });

    await store.dispatch('locations/loadLocations');

    expect(store.state.locations.locations).toEqual([
      { id: 1, name: 'Monona Terrace Convention Center', lat: 43.071584, lng: -89.38012, center: true },
    ]);
    expect(console.error).toHaveBeenCalledWith('Error loading locations:', expect.any(Error));
  });

  it('falls back to the convention center when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await store.dispatch('locations/loadLocations');

    expect(store.state.locations.locations).toHaveLength(1);
    expect(store.state.locations.locations[0].center).toBe(true);
  });
});

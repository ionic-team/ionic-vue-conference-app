import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { createTestStore } from './createTestStore';

import type { StoreState } from '@/store';

let store: Store<StoreState>;

beforeEach(() => {
  store = createTestStore();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('user', () => {
  it('starts logged out and before the tutorial', () => {
    expect(store.state.user).toEqual({
      pictureLocation: null,
      userName: null,
      isAuthenticated: false,
      hasSeenTutorial: false,
    });
  });

  it('logs in with a username after a short delay', async () => {
    vi.useFakeTimers();

    await store.dispatch('logIn', 'ionitron');
    expect(store.state.user.isAuthenticated).toBe(false);

    vi.advanceTimersByTime(50);

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('ionitron');
  });

  it('updates the user picture after a short delay', async () => {
    vi.useFakeTimers();

    await store.dispatch('updateUserPicture', '/avatar.png');
    vi.advanceTimersByTime(50);

    expect(store.state.user.pictureLocation).toBe('/avatar.png');
  });

  it('marks the tutorial as seen', async () => {
    await store.dispatch('sawTutorial');
    expect(store.state.user.hasSeenTutorial).toBe(true);

    await store.dispatch('setHasSeenTutorial', false);
    expect(store.state.user.hasSeenTutorial).toBe(false);
  });
});

describe('dark mode', () => {
  it('toggles dark mode on and off', async () => {
    expect(store.getters.isDarkMode).toBe(false);

    await store.dispatch('toggleDarkMode');
    expect(store.getters.isDarkMode).toBe(true);

    await store.dispatch('toggleDarkMode');
    expect(store.getters.isDarkMode).toBe(false);
  });
});

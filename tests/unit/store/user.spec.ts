import { Preferences } from '@capacitor/preferences';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Store } from 'vuex';

import { createTestStore } from './createTestStore';

import type { StoreState } from '@/store';

let store: Store<StoreState>;

const saved = async (key: string) => (await Preferences.get({ key })).value;

beforeEach(async () => {
  await Preferences.clear();
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

  it('logs in and saves the login', async () => {
    await store.dispatch('logIn', 'ionitron');

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('ionitron');
    expect(await saved('hasLoggedIn')).toBe('true');
    expect(await saved('username')).toBe('ionitron');
  });

  it('signs up by logging in', async () => {
    await store.dispatch('signUp', 'newbie');

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('newbie');
    expect(await saved('hasLoggedIn')).toBe('true');
    expect(await saved('username')).toBe('newbie');
  });

  it('logs out, resetting the user and forgetting the saved login', async () => {
    await store.dispatch('logIn', 'ionitron');
    store.commit('updateUserPicture', '/avatar.png');

    await store.dispatch('logOut');

    expect(store.state.user).toEqual({
      pictureLocation: null,
      userName: null,
      isAuthenticated: false,
      hasSeenTutorial: false,
    });
    expect(await saved('hasLoggedIn')).toBeNull();
    expect(await saved('username')).toBeNull();
  });

  it('can log in again after logging out', async () => {
    await store.dispatch('logIn', 'ionitron');
    await store.dispatch('logOut');
    await store.dispatch('logIn', 'capacitor');

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('capacitor');
  });

  it('changes and saves the username', async () => {
    await store.dispatch('logIn', 'ionitron');

    await store.dispatch('setUserName', 'capacitor');

    expect(store.state.user.userName).toBe('capacitor');
    expect(store.state.user.isAuthenticated).toBe(true);
    expect(await saved('username')).toBe('capacitor');
  });

  it('restores a saved login', async () => {
    await Preferences.set({ key: 'hasLoggedIn', value: 'true' });
    await Preferences.set({ key: 'username', value: 'ionitron' });

    await store.dispatch('loadUserData');

    expect(store.state.user.isAuthenticated).toBe(true);
    expect(store.state.user.userName).toBe('ionitron');
  });

  it('stays logged out without a saved login', async () => {
    await store.dispatch('loadUserData');

    expect(store.state.user.isAuthenticated).toBe(false);
    expect(store.state.user.userName).toBeNull();
  });

  it('gives every store its own state', async () => {
    await store.dispatch('logIn', 'ionitron');
    await store.dispatch('addFavorite', 3);

    const other = createTestStore();

    expect(other.state.user.isAuthenticated).toBe(false);
    expect(other.state.sessions.favoriteSessions).toEqual([]);
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

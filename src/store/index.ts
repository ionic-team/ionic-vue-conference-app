import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';

import type { DarkModeState } from './modules/darkMode';
import darkMode from './modules/darkMode';
import type { LocationState } from './modules/locations';
import locations from './modules/locations';
import type { SessionState } from './modules/sessions';
import sessions from './modules/sessions';
import type { SpeakerState } from './modules/speakers';
import speakers from './modules/speakers';
import type { User } from './modules/user';
import user from './modules/user';

export interface StoreState {
  locations: LocationState;
  sessions: SessionState;
  speakers: SpeakerState;
  user: User;
  darkMode: DarkModeState;
}

const store = createStore<StoreState>({
  modules: {
    locations,
    sessions,
    speakers,
    user,
    darkMode,
  },
  strict: process.env.NODE_ENV !== 'production',
});

export function useStore(): Store<StoreState> {
  return baseUseStore();
}

export default store;

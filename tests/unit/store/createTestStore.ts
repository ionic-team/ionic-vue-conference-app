import type { Module, Store } from 'vuex';
import { createStore } from 'vuex';

import type { StoreState } from '@/store';
import darkMode from '@/store/modules/darkMode';
import locations from '@/store/modules/locations';
import sessions from '@/store/modules/sessions';
import speakers from '@/store/modules/speakers';
import user from '@/store/modules/user';

// The modules declare their state as plain objects, which every store built from them would
// share. Snapshot each initial state once and give every test store its own copy.
const withFreshState = <S>(module: Module<S, any>): Module<S, any> => {
  const initial = structuredClone(module.state as S);
  return { ...module, state: () => structuredClone(initial) };
};

const modules = {
  darkMode: withFreshState(darkMode),
  locations: withFreshState(locations),
  sessions: withFreshState(sessions),
  speakers: withFreshState(speakers),
  user: withFreshState(user),
};

/* A store wired like the app's, with fresh state. */
export const createTestStore = (): Store<StoreState> => createStore<StoreState>({ modules, strict: true });

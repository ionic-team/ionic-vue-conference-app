import type { Store } from 'vuex';
import { createStore } from 'vuex';

import type { StoreState } from '@/store';
import darkMode from '@/store/modules/darkMode';
import locations from '@/store/modules/locations';
import sessions from '@/store/modules/sessions';
import speakers from '@/store/modules/speakers';
import user from '@/store/modules/user';

/* A store wired like the app's. Each module's state is a function, so every store gets fresh state. */
export const createTestStore = (): Store<StoreState> =>
  createStore<StoreState>({ modules: { darkMode, locations, sessions, speakers, user }, strict: true });

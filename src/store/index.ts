import Vue from 'vue';
import Vuex from 'vuex';
import locations, { LocationState } from './modules/locations';
import sessions, { SessionState } from './modules/sessions';
import speakers, { Speaker } from './modules/speakers';
import user, { User } from './modules/user';

export interface StoreState {
  locations: LocationState,
  sessions: SessionState,
  speakers: Speaker[],
  user: User
}

Vue.use(Vuex);

export default new Vuex.Store<StoreState>({
  modules: {
    locations,
    sessions,
    speakers,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
});

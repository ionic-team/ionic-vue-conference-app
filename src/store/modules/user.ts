import { Preferences } from '@capacitor/preferences';
import type { Module } from 'vuex';

export interface User {
  pictureLocation: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
}

// The same Preferences keys the Angular and React conference apps use.
export const HAS_LOGGED_IN = 'hasLoggedIn';
export const USERNAME = 'username';

// A function, so every store (and every reset) gets its own copy instead of sharing one object.
const defaultState = (): User => ({
  pictureLocation: null,
  userName: null,
  isAuthenticated: false,
  hasSeenTutorial: false,
});

const userStore: Module<User, {}> = {
  state: defaultState,
  mutations: {
    sawTutorial(state) {
      state.hasSeenTutorial = true;
    },
    logIn(state, userName: string) {
      state.userName = userName;
      state.isAuthenticated = true;
    },
    logOut(state) {
      Object.assign(state, defaultState());
    },
    setUserName(state, userName: string) {
      state.userName = userName;
    },
    updateUserPicture(state, pictureLocation: string) {
      state.pictureLocation = pictureLocation;
    },
    setHasSeenTutorial(state, value: boolean) {
      state.hasSeenTutorial = value;
    },
  },
  actions: {
    sawTutorial({ commit }) {
      commit('sawTutorial');
    },
    // Restores the logged-in user saved by logIn or signUp.
    async loadUserData({ commit }) {
      const [{ value: hasLoggedIn }, { value: userName }] = await Promise.all([
        Preferences.get({ key: HAS_LOGGED_IN }),
        Preferences.get({ key: USERNAME }),
      ]);
      if (hasLoggedIn === 'true') {
        commit('logIn', userName ?? '');
      }
    },
    async logIn({ commit }, userName: string) {
      await Preferences.set({ key: HAS_LOGGED_IN, value: 'true' });
      await Preferences.set({ key: USERNAME, value: userName });
      commit('logIn', userName);
    },
    // Signing up has no account to create, so it logs the user in like the other apps.
    async signUp({ dispatch }, userName: string) {
      await dispatch('logIn', userName);
    },
    async logOut({ commit }) {
      await Preferences.remove({ key: HAS_LOGGED_IN });
      await Preferences.remove({ key: USERNAME });
      commit('logOut');
    },
    async setUserName({ commit }, userName: string) {
      await Preferences.set({ key: USERNAME, value: userName });
      commit('setUserName', userName);
    },
    updateUserPicture({ commit }, pictureLocation: string) {
      setTimeout(() => {
        commit('updateUserPicture', pictureLocation);
      }, 50);
    },
    setHasSeenTutorial({ commit }, value: boolean) {
      commit('setHasSeenTutorial', value);
    },
  },
};

export default userStore;

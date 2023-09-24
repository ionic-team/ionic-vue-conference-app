import { Module } from 'vuex';

export interface User {
  pictureLocation: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
}

const defaultState: User = {
  pictureLocation: null,
  userName: null,
  isAuthenticated: false,
  hasSeenTutorial: false
};

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
      Object.assign(state, defaultState);
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
    logIn({ commit }, userName: string) {
      setTimeout(() => {
        commit('logIn', userName);
      }, 50);
    },
    logOut({ commit }) {
      setTimeout(() => {
        commit('logOut');
      }, 50);
    },
    updateUserPicture({ commit }, pictureLocation: string) {
      setTimeout(() => {
        commit('updateUserPicture', pictureLocation);
      }, 50);
    },
    setHasSeenTutorial({ commit }, value: boolean) {
      commit('setHasSeenTutorial', value);
    },
  }
};

export default userStore;
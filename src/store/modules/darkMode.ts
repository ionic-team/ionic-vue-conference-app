import { Module } from 'vuex';

export interface DarkModeState {
  darkMode: boolean;
}

const darkModeStore: Module<DarkModeState, {}> = {
  state: {
    darkMode: false,
  },
  mutations: {
    setDarkMode(state, darkMode: boolean) {
      state.darkMode = darkMode;
    },
  },
  actions: {
    toggleDarkMode({ commit, state }) {
      const newDarkMode = !state.darkMode;
      commit('setDarkMode', newDarkMode);
    },
  },
  getters: {
    isDarkMode(state) {
      return state.darkMode;
    },
  },
};

export default darkModeStore;

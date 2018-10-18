export interface User {
  pictureLocation: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
}

export default {
  state: <User>{
    pictureLocation: null,
    userName: null,
    isAuthenticated: false,
    hasSeenTutorial: false
  },
  mutations: {},
  actions: {},
  getters: {}
};

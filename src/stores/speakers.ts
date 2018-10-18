export interface Speaker {
  id: number,
  name: string,
  profilePic: string,
  twitter: string,
  about: string,
  location: string,
  email: string,
  phone: string
}

export default {
  state: <Speaker[]>[],
  mutations: {},
  actions: {},
  getters: {}
};

export interface Session {
  id: number,
  dateTimeStart: string,
  dateTimeEnd: string,
  name: string,
  location: string,
  description: string,
  speakerIds: number[],
  tracks: string[]
}

export default {
  state: {
    searchText: '',
    trackFilters: [],
    sessions: <Session[]>[],
    favoriteSessions: <Session[]>[],
    filterFavorites: false
  },
  mutations: {},
  actions: {},
  getters: {}
};

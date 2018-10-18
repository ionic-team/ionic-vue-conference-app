import { StoreOptions } from 'vuex';

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

export interface SessionState {
  searchText: string;
  trackFilters: string[];
  sessions: Session[];
  favoriteSessions: number[];
  filterFavorites: boolean
}

const defaultState: SessionState = {
  searchText: '',
  trackFilters: [],
  sessions: [],
  favoriteSessions: [],
  filterFavorites: false
}

const sessionStore: StoreOptions<SessionState> = {
  state: defaultState,
  mutations: {
    setSearchText(state: SessionState, searchText: string) {
      state.searchText = searchText;
    },
    addTrackFilter(state: SessionState, trackName: string) {
      if (!state.trackFilters.includes(trackName)) {
        state.trackFilters.push(trackName)
      }
    },
    removeTrackFilter(state: SessionState, trackName: string) {
      state.trackFilters = state.trackFilters.filter(tn => tn !== trackName);
    },
    updateTrackFilters(state: SessionState, trackNames: string[]) {
      state.trackFilters = trackNames;
    },
    addFavorite(state: SessionState, sessionId: number) {
      if (!state.favoriteSessions.includes(sessionId)) {
        state.favoriteSessions.push(sessionId);
      }
    },
    removeFavorite(state: SessionState, sessionId: number) {
      state.favoriteSessions = state.favoriteSessions.filter(fsId => fsId !== sessionId);
    },
    updateFavoriteFilter(state: SessionState) {}
  },
  actions: {
    setSearchText({ commit }, searchText: string) {
      commit('setSearchText', searchText)
    }
  },
  getters: {
    visibleSessions(state: SessionState) {
      let filteredSessions = state.sessions;

      if (state.searchText) {
        const lowerSearchText = state.searchText.toLowerCase();
        filteredSessions = filteredSessions.filter(session => (
          session.name.toLowerCase().indexOf(lowerSearchText) !== -1)
        );
      }

      if (state.trackFilters.length > 0) {
        filteredSessions = filteredSessions.filter(session => (
          session.tracks.some(sessionTrackName => (
            state.trackFilters.some(trackName => trackName === sessionTrackName)
          ))
        ));
      }

      return filteredSessions;
    }
  }
};

export default sessionStore;

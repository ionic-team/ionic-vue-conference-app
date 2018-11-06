import { Module } from 'vuex';
import { parse as parseDate } from 'date-fns';

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
}

export interface SessionGroup {
  startTime: string,
  sessions: Session[]
}

const defaultState: SessionState = {
  searchText: '',
  trackFilters: [],
  sessions: [],
  favoriteSessions: []
}

const sessionStore: Module<SessionState, {}> = {
  state: defaultState,
  mutations: {
    updateSessions(state, sessions: Session[]) {
      state.sessions = sessions;
    },
    setSearchText(state, searchText: string) {
      state.searchText = searchText;
    },
    addTrackFilter(state, trackName: string) {
      if (!state.trackFilters.includes(trackName)) {
        state.trackFilters.push(trackName)
      }
    },
    removeTrackFilter(state, trackName: string) {
      state.trackFilters = state.trackFilters.filter(tn => tn !== trackName);
    },
    updateTrackFilters(state, trackNames: string[]) {
      state.trackFilters = trackNames;
    },
    addFavorite(state, sessionId: number) {
      if (!state.favoriteSessions.includes(sessionId)) {
        state.favoriteSessions.push(sessionId);
      }
    },
    removeFavorite(state, sessionId: number) {
      state.favoriteSessions = state.favoriteSessions.filter(fsId => fsId !== sessionId);
    },
    updateFavoriteFilter(state, sessionIds: number[]) {
      state.favoriteSessions = sessionIds;
    }
  },
  actions: {
    async loadSessionData({ commit }) {
      const response = await fetch('/data/sessions.json');
      const data = await response.json();
      commit('updateSessions', data);
    },
    setSearchText({ commit }, searchText: string) {
      commit('setSearchText', searchText)
    },
    addTrackFilter({ commit }, trackName: string) {
      commit('addTrackFilter', trackName);
    },
    removeTrackFilter({ commit }, trackName: string) {
      commit('removeTrackFilter', trackName);
    },
    updateTrackFilters({ commit }, trackNames: string[]) {
      commit('updateTrackFilters', trackNames);
    },
    addFavorite({ commit }, sessionId: number) {
      commit('addFavorite', sessionId);
    },
    removeFavorite({ commit }, sessionId: number) {
      commit('removeFavorite', sessionId);
    },
    updateFavoriteFilter({ commit }, sessionIds: number[]) {
      commit('updateFavoriteFilter', sessionIds);
    },
  },
  getters: {
    conferenceStart(state) {
      const firstSession = state.sessions
        .concat()
        .sort((a, b) => (
          parseDate(a.dateTimeStart).valueOf() - parseDate(b.dateTimeStart).valueOf()
        ))[0];
      return firstSession ? firstSession.dateTimeStart : null;
    },
    allTracks(state) {
      return state.sessions
        .reduce((all, session) => all.concat(session.tracks), <string[]>[])
        .filter((trackName, index, array) => array.indexOf(trackName) === index)
        .sort();
    },
    allFiltered(state) {
      let searchSessions = searchText(state.searchText);
      let searchTracks = filterByTrack(state.trackFilters);

      return state.sessions
        .filter(searchSessions)
        .filter(searchTracks);
    },
    favoritesFiltered(state) {
      let searchSessions = searchText(state.searchText);
      let searchTracks = filterByTrack(state.trackFilters);

      function isFavorite(session: Session) {
        return state.favoriteSessions.indexOf(session.id) !== -1;
      }

      return state.sessions
        .filter(isFavorite)
        .filter(searchSessions)
        .filter(searchTracks);
    }
  }
};

function searchText(searchText: string) {
  if (!searchText) {
    return () => true;
  }
  const lowerSearchText = searchText.toLowerCase();
  return (session: Session) => session.name.toLowerCase().indexOf(lowerSearchText) !== -1;
}

function filterByTrack(trackFilters: string[]) {
  if (trackFilters.length === 0) {
    return () => true;
  }
  return (session: Session) => (
    session.tracks.some(sessionTrackName => (
      trackFilters.some(trackName => trackName === sessionTrackName)
    ))
  );
}

export default sessionStore;

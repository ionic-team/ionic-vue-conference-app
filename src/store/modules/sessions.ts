import { Module } from 'vuex';
import { parse as parseDate } from 'date-fns';

export interface Session {
  id: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: number[];
  tracks: string[];
  selectedTrackFilters: string[];
}

export interface SessionState {
  searchText: string;
  trackFilters: string[];
  sessions: Session[];
  favoriteSessions: number[];
  tracks: any[];
  selectedTrackFilters: string[];
  isFirstLoad: boolean;
}

export interface SessionGroup {
  startTime: string,
  sessions: Session[],
  isFirstLoad: true,
}

const defaultState: SessionState = {
  searchText: '',
  trackFilters: [],
  sessions: [],
  favoriteSessions: [],
  tracks: [],
  selectedTrackFilters: [],
  isFirstLoad: true
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
    updateSelectedTrackFilters(state, trackFilters) {
      state.selectedTrackFilters = trackFilters;
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
    },
    setTracks(state, tracks) {
      state.tracks = tracks;
    },
    setFirstLoad(state, value: boolean) {
      state.isFirstLoad = value;
    },
  },
  actions: {
    loadSessionData({ commit }) {
      return fetch('/data/sessions.json')
        .then(response => {
          if (!response.ok) {
            throw Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          commit('updateSessions', data);
        })
        .catch(error => {
          console.error('Error loading session data:', error);
        });
    },
    fetchTracks({ commit }) {
      return fetch('/data/tracks.json')
      .then(response => {
        if (!response.ok) {
          throw Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        commit('setTracks', data);
      })
      .catch(error => {
        console.error('Error loading session data:', error);
      });
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
    setSelectedTrackFilters({ commit }, trackFilters) {
      commit('updateSelectedTrackFilters', trackFilters);
    },
  },
  getters: {
    conferenceStart(state) {
      const firstSession = state.sessions
        .concat()
        .sort((a, b) => (
          parseDate(a.dateTimeStart, 'yyyy-MM-dd HH:mm:ss', new Date()).valueOf() -
          parseDate(b.dateTimeStart, 'yyyy-MM-dd HH:mm:ss', new Date()).valueOf()
        ))[0];
      return firstSession ? firstSession.dateTimeStart : null;
    },
    allTracks(state) {
      return state.sessions
        .reduce((all, session) => all.concat(session.tracks), <string[]>[])
        .filter((trackName, index, array) => array.indexOf(trackName) === index)
        .sort();
    },
    allTracksFilter(state) {
      return state.tracks;
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

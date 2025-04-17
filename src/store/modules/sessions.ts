import { Module } from 'vuex';
import { parse as parseDate, format as formatDate } from 'date-fns';

export interface Session {
  id: number;
  timeStart: string;
  timeEnd: string;
  name: string;
  location: string;
  description: string;
  speakerIds: number[];
  tracks: string[];
  selectedTrackFilters: string[];
  groupTime: string;
  hide?: boolean;
}

export interface SessionState {
  searchText: string;
  trackFilters: string[];
  sessions: Session[];
  favoriteSessions: number[];
  tracks: any[];
  selectedTrackFilters: string[];
  isFirstLoad: boolean;
  schedule: any[];
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
  isFirstLoad: true,
  schedule: []
}

const sessionStore: Module<SessionState, {}> = {
  state: defaultState,
  mutations: {
    updateSessions(state, sessions: Session[]) {
      state.sessions = sessions;
    },
    updateSchedule(state, schedule: any[]) {
      state.schedule = schedule;
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
    loadSessionData({ commit, state }) {
      return fetch('/data/data.json')
        .then(response => {
          if (!response.ok) {
            throw Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          commit('updateSchedule', data.schedule);

          // Create a map of speaker names to IDs
          const speakerNameToId = new Map(
            data.speakers.map((s: any) => [s.name, parseInt(s.id)])
          );

          const sessions = data.schedule[0].groups.flatMap((group: any) =>
            group.sessions.map((session: any) => ({
              id: parseInt(session.id),
              timeStart: session.timeStart,
              timeEnd: session.timeEnd,
              name: session.name,
              location: session.location,
              description: session.description || '',
              speakerIds: (session.speakerNames || []).map((name: string) => speakerNameToId.get(name)),
              tracks: session.tracks,
              selectedTrackFilters: [],
              groupTime: group.time
            }))
          );
          commit('updateSessions', sessions);

          // If this is the first load, initialize all tracks as selected
          if (state.isFirstLoad) {
            const allTracks = [...new Set(sessions.flatMap((s: Session) => s.tracks))];
            commit('updateTrackFilters', allTracks);
            commit('setFirstLoad', false);
          }
        })
        .catch(error => {
          console.error('Error loading session data:', error);
        });
    },
    fetchTracks({ commit }) {
      return fetch('/data/data.json')
        .then(response => {
          if (!response.ok) {
            throw Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          commit('setTracks', data.tracks);
        })
        .catch(error => {
          console.error('Error loading tracks data:', error);
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
    }
  },
  getters: {
    conferenceStart(state) {
      const firstSession = state.sessions
        .concat()
        .sort((a, b) => (
          parseDate(a.timeStart, 'HH:mm:ss', new Date()).valueOf() -
          parseDate(b.timeStart, 'HH:mm:ss', new Date()).valueOf()
        ))[0];
      return firstSession ? firstSession.timeStart : null;
    },
    allTracks(state) {
      return state.sessions
        .reduce((all, session) => all.concat(session.tracks), <string[]>[])
        .filter((trackName, index, array) => array.indexOf(trackName) === index)
        .sort();
    },
    allTracksFilter(state) {
      return state.tracks
        ? state.tracks.slice().sort((a, b) => a.name.localeCompare(b.name))
        : [];
    },
    allFiltered(state) {
      return state.sessions.filter((session: Session) => {
        // If no tracks are selected, show no sessions
        if (state.trackFilters.length === 0) return false;

        // Check if session matches track filters
        const matchesTracks = session.tracks.every(track => state.trackFilters.includes(track));

        // Check if session matches search text
        const matchesSearch = state.searchText
          ? session.name.toLowerCase().includes(state.searchText.toLowerCase())
          : true;

        return matchesTracks && matchesSearch;
      });
    },
    favoritesFiltered(state) {
      return state.sessions.filter((session: Session) => {
        if (!state.favoriteSessions.includes(session.id)) return false;

        // If no tracks are selected, show no sessions
        if (state.trackFilters.length === 0) return false;

        // Check if session matches track filters
        const matchesTracks = session.tracks.every(track => state.trackFilters.includes(track));

        // Check if session matches search text
        const matchesSearch = state.searchText
          ? session.name.toLowerCase().includes(state.searchText.toLowerCase())
          : true;

        return matchesTracks && matchesSearch;
      });
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

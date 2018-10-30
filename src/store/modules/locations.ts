import { Module } from 'vuex';

export interface Location {
  id: number;
  name?: string;
  lat: number;
  lng: number;
}

export interface LocationState {
  mapCenterId: number
  locations: Location[]
}

const locationStore: Module<LocationState, {}> = {
  state: {
    mapCenterId: 1,
    locations: []
  },
  mutations: {
    updateLocations(state, locations: Location[]) {
      state.locations = locations;
    },
  },
  actions: {
    async loadLocationData({ commit }) {
      const response = await fetch('/data/locations.json');
      const data = await response.json();
      commit('updateLocations', data);
    }
  },
  getters: {
    mapCenter(state) {
      return state.locations.find(l => l.id === state.mapCenterId)
    },
    allLocations(state) {
      return state.locations.filter(l => l.id !== state.mapCenterId)
    }
  }
};

export default locationStore;

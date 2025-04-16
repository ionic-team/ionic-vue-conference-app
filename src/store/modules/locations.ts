import { Module } from 'vuex';

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  center?: boolean;
}

export interface LocationState {
  locations: Location[];
}

const locationsModule: Module<LocationState, any> = {
  namespaced: true,
  state: {
    locations: []
  },
  mutations: {
    setLocations(state, locations: Location[]) {
      state.locations = locations;
    }
  },
  actions: {
    async loadLocations({ commit }) {
      try {
        const response = await fetch('/data/data.json');
        const data = await response.json();

        if (data.map && Array.isArray(data.map)) {
          // Add IDs to locations
          const locations = data.map.map((location: any, index: number) => ({
            ...location,
            id: index + 1
          }));
          commit('setLocations', locations);
        } else {
          throw new Error('Invalid data format: map array not found');
        }
      } catch (error) {
        console.error('Error loading locations:', error);
        // Set default locations if data cannot be loaded
        commit('setLocations', [
          {
            id: 1,
            name: 'Monona Terrace Convention Center',
            lat: 43.071584,
            lng: -89.38012,
            center: true
          }
        ]);
      }
    }
  }
};

export default locationsModule;

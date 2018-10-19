import { Module } from 'vuex';

export interface Location {
  name?: string;
  lat: number;
  lng: number;
}

export interface LocationState {
  mapCenter: Location,
  locations: Location[]
}

const locationStore: Module<LocationState, {}> = {
  state: {
    mapCenter: {
      lat: 43.071584,
      lng: -89.380120,
    },
    locations: []
  }
};

export default locationStore;

export interface Location {
  name?: string;
  lat: number;
  lng: number;
}

export interface LocationState {
  mapCenter: Location,
  locations: Location[]
}

export default {
  state: <LocationState>{
    mapCenter: {
      lat: 43.071584,
      lng: -89.380120,
    },
    locations: []
  },
  mutations: {},
  actions: {},
  getters: {}
};

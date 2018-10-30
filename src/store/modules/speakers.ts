import { Module } from 'vuex';

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

export interface SpeakerState {
  speakers: Speaker[]
}

const speakerStore: Module<SpeakerState, {}> = {
  state: {
    speakers: []
  },
  mutations: {
    updateSpeakers(state, speakers: Speaker[]) {
      state.speakers = speakers;
    },
  },
  actions: {
    async loadSpeakerData({ commit }) {
      const response = await fetch('/data/speakers.json');
      const data = await response.json();
      commit('updateSpeakers', data);
    }
  }
};

export default speakerStore;

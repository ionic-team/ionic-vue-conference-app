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
  getters: {
    allSpeakers(state) {
      return state.speakers.concat().sort((a, b) => {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
    }
  }
};

export default speakerStore;

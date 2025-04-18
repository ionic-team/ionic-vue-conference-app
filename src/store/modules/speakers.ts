import { Module } from 'vuex';
import { Session } from './sessions';

export interface Speaker {
  id: number;
  name: string;
  profilePic: string;
  twitter: string;
  github: string;
  instagram: string;
  about: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  sessions: Session[];
}

export interface SpeakerState {
  speakers: Speaker[];
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
  getters: {
    allSpeakers: (state): Speaker[] => state.speakers,

    // Get a specific speaker by ID
    getSpeakerById: (state) => (id: number): Speaker | undefined => {
      return state.speakers.find(speaker => speaker.id === id);
    },

    // Get multiple speakers by their IDs
    getSpeakersByIds: (state) => (ids: number[]): Speaker[] => {
      return state.speakers.filter(speaker => ids.includes(speaker.id));
    },

    // Get speakers sorted by name
    getSpeakersSortedByName: (state): Speaker[] => {
      return [...state.speakers].sort((a, b) => a.name.localeCompare(b.name));
    }
  },
  actions: {
    loadSpeakerData({ commit }) {
      return fetch('/data/data.json')
        .then(response => {
          if (!response.ok) {
            throw Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const speakers = data.speakers.map((speaker: any): Speaker => ({
            id: parseInt(speaker.id),
            name: speaker.name || '',
            profilePic: speaker.profilePic,
            twitter: speaker.twitter || '',
            github: speaker.github || '',
            instagram: speaker.instagram || '',
            about: speaker.about || '',
            title: speaker.title || '',
            location: speaker.location || '',
            email: speaker.email || '',
            phone: speaker.phone || '',
            sessions: speaker.sessions || []
          }));
          commit('updateSpeakers', speakers);
          return speakers;
        })
        .catch(error => {
          console.error('Error loading speaker data:', error);
          throw error;
        });
    }
  }
};

export default speakerStore;

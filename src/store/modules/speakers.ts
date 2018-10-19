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

const speakerStore: Module<Speaker[], {}> = {
  state: []
};

export default speakerStore;

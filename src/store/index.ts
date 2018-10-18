import Vue from 'vue';
import Vuex from 'vuex';
import locations from './modules/locations';
import sessions from './modules/sessions';
import speakers from './modules/speakers';
import user from './modules/user';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    locations,
    sessions,
    speakers,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
})

import Vue from 'vue';
import Vuex from 'vuex';
import locations from './locations';
import sessions from './sessions';
import speakers from './speakers';
import user from './user';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    locations,
    sessions,
    speakers,
    user
  }
})

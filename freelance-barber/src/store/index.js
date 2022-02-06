import { createStore } from 'vuex'

import barbersModule from './modules/barbers/index.js';

export default createStore({
  state() {
    return {
      userId: 'b3',
    }
  },
  getters: {
    userId(state) {
      return state.userId;
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    barbers: barbersModule
  }
})

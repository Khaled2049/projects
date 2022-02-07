import { createStore } from 'vuex'

import barbersModule from './modules/barbers/index.js';
import requestsModule from './modules/requests/index.js';

export default createStore({
  state() {
    return {
      userId: 'b1',
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
    barbers: barbersModule,
    requests: requestsModule
  }
})

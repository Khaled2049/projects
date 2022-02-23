import { createStore } from 'vuex'

import barbersModule from './modules/barbers/index.js';
import requestsModule from './modules/requests/index.js';
import authModule from './modules/auth/index.js'

export default createStore({
  mutations: {
  },
  actions: {
  },
  modules: {
    barbers: barbersModule,
    requests: requestsModule,
    auth: authModule
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import tokenModule from './token_module.js'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {

  },
  mutations: {

  },
  getters: {

  },
  actions: {

  },
  modules: {
    token: tokenModule
  }
})

export default vuex

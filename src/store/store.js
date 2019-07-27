import Vue from 'vue'
import Vuex from 'vuex'
import tokenModule from './token_module.js'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    id: '',
    rid: ''
  },
  mutations: {
    storeIds (state, id, rid) {
      state.id = id
      state.rid = rid
    }
  },
  getters: {
    getId (state) {
      return state.id
    },
    getRid (state) {
      return state.rid
    }
  },
  actions: {
    storeIdsCommit ({ commit }, id, rid) {
      commit('storeIds', id, rid)
    }
  },
  modules: {
    token: tokenModule
  }
})

export default vuex

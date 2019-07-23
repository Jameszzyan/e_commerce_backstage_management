const tokenModule = {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    storeToken (state, data) {
      state.token = data
    },
    deleteToken (state) {
      state.token = ''
    }
  },
  getters: {
    getToken (state) {
      return state.token
    }
  },
  actions: {
    storeTokenCommit ({ commit }, data) {
      commit('storeToken', data)
    },
    deleteTokenCommit ({ commit }) {
      commit('deleteToken')
    }
  }
}

export default tokenModule

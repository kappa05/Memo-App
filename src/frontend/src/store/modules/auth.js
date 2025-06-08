import axios from 'axios'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null
}

const getters = {
  isLoggedIn: state => !!state.token,
  currentUser: state => state.user,
  token: state => state.token
}

const actions = {
  async login({ commit }, credentials) {
    const response = await axios.post('/api/auth/login', credentials)
    const { token, user } = response.data
    commit('SET_TOKEN', token)
    commit('SET_USER', user)
    return user
  },

  async logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('SET_TOKEN', '')
    commit('SET_USER', null)
  }
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER(state, user) {
    state.user = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 
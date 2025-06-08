import { createStore } from 'vuex'
import auth from './modules/auth'
import memo from './modules/memo'
import category from './modules/category'

export default createStore({
  state: {
    error: null
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  modules: {
    auth,
    memo,
    category
  }
}) 
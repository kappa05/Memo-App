import axios from 'axios'

const state = {
  categories: [],
  loading: false,
  error: null
}

const getters = {
  allCategories: state => state.categories,
  isLoading: state => state.loading,
  error: state => state.error
}

const actions = {
  async fetchCategories({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/categories')
      commit('SET_CATEGORIES', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createCategory({ commit }, category) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.post('/api/categories', category)
      commit('ADD_CATEGORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateCategory({ commit }, { id, category }) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.put(`/api/categories/${id}`, category)
      commit('UPDATE_CATEGORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteCategory({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await axios.delete(`/api/categories/${id}`)
      commit('DELETE_CATEGORY', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_CATEGORY(state, category) {
    state.categories.push(category)
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.categories.findIndex(c => c.id === updatedCategory.id)
    if (index !== -1) {
      state.categories.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY(state, id) {
    state.categories = state.categories.filter(c => c.id !== id)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} 
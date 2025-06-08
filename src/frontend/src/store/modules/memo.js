import axios from 'axios'

const state = {
  memos: [],
  currentMemo: null,
  loading: false,
  error: null
}

const getters = {
  allMemos: state => state.memos,
  currentMemo: state => state.currentMemo,
  isLoading: state => state.loading,
  error: state => state.error
}

const actions = {
  async fetchMemos({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/memos')
      commit('SET_MEMOS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchMemo({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get(`/api/memos/${id}`)
      commit('SET_CURRENT_MEMO', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createMemo({ commit }, memo) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.post('/api/memos', memo)
      commit('ADD_MEMO', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateMemo({ commit }, { id, memo }) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.put(`/api/memos/${id}`, memo)
      commit('UPDATE_MEMO', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteMemo({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await axios.delete(`/api/memos/${id}`)
      commit('DELETE_MEMO', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_MEMOS(state, memos) {
    state.memos = memos
  },
  SET_CURRENT_MEMO(state, memo) {
    state.currentMemo = memo
  },
  ADD_MEMO(state, memo) {
    state.memos.unshift(memo)
  },
  UPDATE_MEMO(state, updatedMemo) {
    const index = state.memos.findIndex(m => m.id === updatedMemo.id)
    if (index !== -1) {
      state.memos.splice(index, 1, updatedMemo)
    }
  },
  DELETE_MEMO(state, id) {
    state.memos = state.memos.filter(m => m.id !== id)
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
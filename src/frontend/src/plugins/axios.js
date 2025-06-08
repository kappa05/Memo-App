import axios from 'axios'
import store from '../store'

// ベースURLの設定
axios.defaults.baseURL = 'http://localhost:3000'

// リクエストインターセプター
axios.interceptors.request.use(
  config => {
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
axios.interceptors.response.use(
  response => response,
  error => {
    store.commit('SET_ERROR', error)
    return Promise.reject(error)
  }
)

export default axios 
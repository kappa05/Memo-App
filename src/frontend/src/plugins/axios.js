import axios from 'axios'
import store from '../store'

// ベースURLの設定
axios.defaults.baseURL = 'http://localhost:3000'

// リクエストインターセプター
axios.interceptors.request.use(
  config => {
    // リクエストのログ出力
    console.log('🚀 Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    })

    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // リクエストのエラーログ出力
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
axios.interceptors.response.use(
  response => {
    // レスポンスのログ出力
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  error => {
    // エラーレスポンスのログ出力
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    store.commit('SET_ERROR', error)
    return Promise.reject(error)
  }
)

export default axios 
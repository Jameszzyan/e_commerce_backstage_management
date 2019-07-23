import axios from 'axios'
import store from '../store/store.js'
import router from '../routers/router.js'

// 设置axios拦截器，在请求头设置token，在响应头判断如果返回error就清除token
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  var token = sessionStorage.getItem('token')
  store.state.token.token = token
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        store.dispatch('deleteTokenCommit')
        router.replace({
          path: '/login'
        })
    }
  }
  return Promise.reject(error)
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

export default axios

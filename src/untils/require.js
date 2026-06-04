import axios from 'axios'
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})
//请求拦截器
service.interceptors.request.use(
  (config) => {
    //发起请求前
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response
    //响应成功
    if (data.code === 200 || data.code === '200') {
      return data.data
    } else {
      if (data.code === -1 || data.code === '-1') {
        if (!config.url.includes('/login')) {
          ElMessage.error('登录过期，请重新登录')
          //移除token
          localStorage.removeItem('token')
          //移除登录信息
          localStorage.removeItem('userInfo')
          //跳转到登录页
          window.location.href = '/auth/login'
        }
      } else if (data.code === "BUSINESS_ERROR") {
        ElMessage.error(data.message)
      }
      else {
        ElMessage.error('网络超时，请求失败')
        return Promise.reject('请求失败')
      }
    }
    //响应失败
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
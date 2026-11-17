import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * axios 二次封装
 * baseURL: /api —— 通过 Vite dev 代理转发到后端 http://localhost:3000
 * 生产环境可改为后端实际地址
 */
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器：统一携带 token 等
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理 code 与错误提示
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res.data
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '网络异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service

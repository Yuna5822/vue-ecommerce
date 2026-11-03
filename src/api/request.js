import axios from 'axios'
import { ElMessage } from 'element-plus'
import { mockAdapter } from './mock'

/**
 * axios 二次封装
 * adapter: mockAdapter —— 当前使用 mock 数据；
 * 接入真实后端时删除 adapter，并修改 baseURL 即可，业务代码零改动
 */
const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: mockAdapter
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

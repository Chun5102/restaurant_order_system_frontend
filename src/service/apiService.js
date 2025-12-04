import { startLoading, stopLoading } from '@/utils/loadingService'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 600000,
})

apiService.interceptors.request.use(
  (config) => {
    startLoading()
    return config
  },
  (error) => Promise.reject(error),
)

apiService.interceptors.response.use(
  (response) => {
    stopLoading()
    const res = response.data
    if (res.responseCode !== '200') {
      ElMessage.error(res.data || res.message || '發生錯誤')
      return Promise.reject(res)
    }
    return res
  },
  (error) => Promise.reject(error),
)
export default apiService

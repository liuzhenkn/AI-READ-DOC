import axios from 'axios'
import { message } from 'antd'

const ERROR_WHITE_LIST = [
  '/api/checkout/query',
]

axios.defaults.timeout = 10000
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  const { data } = response
  if (data.status?.code === 0) {
    return Promise.resolve(data.body)
  } else {
    const requestPath = response.config.url.split('?')[0]
    if (ERROR_WHITE_LIST.includes(requestPath)) {
      return Promise.reject(response)
    }

    message.error(data.status?.detail || '请求失败')
    return Promise.reject(response)
  }
}, error => {
  message.error(error?.status?.detail || '请求失败')
  return Promise.reject(error)
})

export default axios

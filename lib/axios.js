import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  const isFormData =
    config.data instanceof FormData ||
    config.headers?.['Content-Type'] === 'multipart/form-data' ||
    config.headers?.['content-type'] === 'multipart/form-data'

  if (!isFormData) {
    config.headers = config.headers || {}
    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json'
    }
  } else {
    if (config.headers) {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
  }

  return config
})

export default api
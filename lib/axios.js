import axios from 'axios'

// Normalize NEXT_PUBLIC_API_URL so callers can use root-relative paths like '/tasks' or '/auth/login'.
// If the env value doesn't include '/api', append it so services using '/tasks' resolve to '.../api/tasks'.
const rawBaseURL = process.env.NEXT_PUBLIC_API_URL?.trim()
let normalizedBaseURL = rawBaseURL ? rawBaseURL.replace(/\/+$/, '') : ''
if (normalizedBaseURL && !normalizedBaseURL.endsWith('/api')) {
  normalizedBaseURL += '/api'
}

const api = axios.create({
  baseURL: normalizedBaseURL || undefined,
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
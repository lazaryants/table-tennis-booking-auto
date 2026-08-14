import axios from 'axios'

const TOKEN_KEY = 'jwt-token'
const REFRESH_TOKEN_KEY = 'jwt-refresh-token'

const instance = axios.create({
  baseURL: '/api/'
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post('/api/token/refresh/', {
        refresh: refreshToken
      })
      .then(response => {
        const accessToken = response.data.access

        if (!accessToken) {
          throw new Error('No access token returned')
        }

        localStorage.setItem(TOKEN_KEY, accessToken)

        return accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

instance.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const accessToken = await refreshAccessToken()

        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem('username')

        if (window.location.pathname !== '/auth') {
          window.location.href =
            '/auth?message=session_expired'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default instance

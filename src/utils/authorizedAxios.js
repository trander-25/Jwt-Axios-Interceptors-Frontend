import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

// Create custom Axios instance for the project
let authorizedAxiosInstance = axios.create()

// Set request timeout to 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Enable automatic cookie sending for httpOnly JWT tokens
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Configure Interceptors (intercept between Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Add a request interceptor: Intercept API requests
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Get access token from localStorage and attach to header
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    // Add "Bearer" prefix following OAuth 2.0 standard
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, function (error) {
  // Handle request error
  return Promise.reject(error)
})

// Promise for refresh token API call to prevent multiple simultaneous requests
let refreshTokenPromise = null

// Add a response interceptor: Intercept responses received from API
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lies within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  /** Important: Automatic Refresh Token handling */
  // If 401 error - force logout
  if (error.response?.status === 401) {
    handleLogoutAPI().then(() => {
      // If using cookies, remember to remove userInfo from localStorage
      localStorage.removeItem('userInfo')

      // Redirect to login page
      location.href = '/login'
    })
  }

  // If 410 error - refresh access token and retry original request
  const originalRequest = error.config
  if (error.response?.status === 410 && originalRequest) {
    if (!refreshTokenPromise) {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken')
      // Call refresh token API
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then((res) => {
          // Update access token in localStorage
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
          // Note: accessToken is also updated in cookies by the backend
        })
        .catch((_error) => {
          // If refresh fails, logout user
          handleLogoutAPI().then(() => {
            // For localStorage case
            localStorage.removeItem('userInfo')
            // Redirect to login page after logout
            location.href = '/login'
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          // Reset promise regardless of success or failure
          refreshTokenPromise = null
        })
    }

    // Return promise that retries original request after token refresh
    return refreshTokenPromise.then(() => {
      // Retry the original failed request with new token
      return authorizedAxiosInstance(originalRequest)
    })
  }

  // Show error toast for all errors except 410 (handled above)
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance
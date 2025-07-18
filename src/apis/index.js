import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
  // Clear tokens and user info from localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userInfo')

  // Call logout API to remove httpOnly cookies from backend
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, { refreshToken })
}
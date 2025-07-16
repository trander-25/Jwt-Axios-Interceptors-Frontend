import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
  // Truong hop 1: dung localStorage - chi xoa thong tin user trong local phai FE
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userInfo')

  // Truong hop 2: dung http only cookies - goi API de xu li remove cookies
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`)
}
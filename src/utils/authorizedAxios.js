import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (phục vụ
// trường hợp nếu chúng ta sử dụng JWT tokens (refresh & access) theo cơ chế httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Configure Interceptors (intercept between Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Add a request interceptor: Intercept API requests
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  // Lay access vs refreshToken tu localStorage va dinh kem header
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    // Cần thêm "Bearer" vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
    // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như: Basic token, Digest token, OAuth token,...vv
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nhận yêu cầu refreshToken đầu tiên thì hold lại việc gọi API refresh_token
// cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó thay vì cứ thờ gọi lại refreshTokenAPI liên
// tục với mỗi request lỗi
let refreshTokenPromise = null

// Add a response interceptor: Intercept responses received from API
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lies within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  /** Khu vực Quan trọng: Xử lý Refresh Token tự động */
  // Nếu như nhận mã 401 từ BE, thì gọi api logout luôn
  if (error.response?.status === 401) {
    handleLogoutAPI().then(() => {
      // Nếu trường hợp dùng cookie thì nhớ xóa userInfo trong localstorage
      // localStorage.removeItem('userInfo')

      // Điều hướng tới trang Login sau khi logout thành công
      location.href = '/login'
    })
  }

  // Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequest = error.config
  console.log('originalRequest:', originalRequest)
  if (error.response?.status === 410 && originalRequest) {
    if (!refreshTokenPromise) {
      // Lấy refreshToken từ localStorage (cho trường hợp localstorage)
      const refreshToken = localStorage.getItem('refreshToken')
      // Gọi api refresh token
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then((res) => {
          // Lấy và gán lại accessToken vào localStorage (cho trường hợp localstorage)
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
          // Đồng thời lưu ý là accessToken cũng đã được update lại ở Cookie rồi nhé (cho trường hợp Cookie)
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
          handleLogoutAPI().then(() => {
            // Nếu trường hợp dùng cookie thì nhớ xóa userInfo trong localStorage
            // localStorage.removeItem('userInfo')

            // Điều hướng tới trang Login sau khi logout thành công
            location.href = '/login'
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          // Loi hay thanh cong thi van set ve null
          refreshTokenPromise = null
        })
    }

    // Cuoi cung moi return refreshTokenPromise trong treuogn hop success
    return refreshTokenPromise.then(() => {
      // Quan trọng: return lại axios instance của chúng ta kết hợp cái originalRequest để
      // gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequest)
    })

  }

  // Ngoai tru ma 410-GONE, refresh API
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})// Cau hinh bo danh chan Interceptor giua cac request va response

export default authorizedAxiosInstance
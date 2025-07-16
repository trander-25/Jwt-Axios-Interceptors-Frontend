// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { handleLogoutAPI } from '~/apis'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
      // console.log(res.data)
      // const userinfoFromLocalStorage = localStorage.getItem('userInfo')
      // console.log('userinfoFromLocalStorage:', JSON.parse(userinfoFromLocalStorage))
      setUser(res.data)
    }
    fetchData()
  }, [])
  // dup api
  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
      // console.log(res.data)
      // const userinfoFromLocalStorage = localStorage.getItem('userInfo')
      // console.log('userinfoFromLocalStorage:', JSON.parse(userinfoFromLocalStorage))
      setUser(res.data)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    // Gọi API Logout
    await handleLogoutAPI()
    // Nếu trường hợp dùng cookie thì nhớ xóa userInfo trong localStorage
    localStorage.removeItem('userInfo')

    // Dieu huong toi trang Login khi logout thanh cong
    navigate('/login')
  }

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1120px',
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em'
    }}>
      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Button
        type='button'
        variant='contained'
        color='info'
        size='large'
        sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
        onClick={handleLogout}
      >
        Loggout
      </Button>

      <Divider sx={{ my: 2 }} />
    </Box>
  )
}

export default Dashboard

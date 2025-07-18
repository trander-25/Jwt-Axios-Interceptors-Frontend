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
      setUser(res.data)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    // Call logout API
    await handleLogoutAPI()
    // Remove user info from localStorage
    localStorage.removeItem('userInfo')

    // Navigate to login page after successful logout
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
        This is the Dashboard page accessible only after user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; successfully logs in.
      </Alert>

      <Button
        type='button'
        variant='contained'
        color='info'
        size='large'
        sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Divider sx={{ my: 2 }} />
    </Box>
  )
}

export default Dashboard

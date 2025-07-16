// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

/**
* Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
* Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
* https://reactrouter.com/en/main/components/outlet
* Một bài hướng dẫn khá đầy đủ:
* https://www.robinwieruch.de/react-router-private-routes/
*/
const ProtectRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const UnauthoziedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) return <Navigate to='/dashboard' replace={true} />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnauthoziedRoutes />}>
        <Route path='/login' element={<Login />} />
      </Route>

      <Route element={<ProtectRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>

    </Routes>
  )
}

export default App

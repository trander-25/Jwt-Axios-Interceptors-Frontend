import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

/**
 * Protected routes component using React Router's Outlet
 * Clean solution for handling authentication-required routes
 * https://reactrouter.com/en/main/components/outlet
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const UnauthoziedRoutes = () => {
  // Redirect authenticated users away from auth pages
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

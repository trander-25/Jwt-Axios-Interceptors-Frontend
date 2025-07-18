import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
// Toast notifications
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Router configuration
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-left" theme="colored" />
  </BrowserRouter>
)

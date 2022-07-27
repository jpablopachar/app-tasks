import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/Auth-Provider'
import AuthLayout from './layouts/Auth-Layout'
import ProtectedRoute from './layouts/Protected-Route'
import ConfirmAccount from './pages/Confirm-Account'
import ForgotPassword from './pages/Forgot-Password'
import Login from './pages/Login'
import NewPassword from './pages/New-Password'
import Projects from './pages/Projects'
import Register from './pages/Register'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="forgot-password/:token" element={<NewPassword />} />
            <Route path="confirm/:token" element={<ConfirmAccount />} />
          </Route>
          <Route path='/projects' element={<ProtectedRoute/>}>
            <Route index element={<Projects/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

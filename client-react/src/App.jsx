import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/Auth-Layout'
import ConfirmAccount from './pages/Confirm-Account'
import ForgotPassword from './pages/Forgot-Password'
import Login from './pages/Login'
import NewPassword from './pages/New-Password'
import Register from './pages/Register'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="forgot-password/:token" element={<NewPassword />} />
          <Route path="confirm/:token" element={<ConfirmAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

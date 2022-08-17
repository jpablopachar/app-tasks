import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/Auth-Provider'
import { ProjectsProvider } from './context/Projects-Provider'
import AuthLayout from './layouts/Auth-Layout'
import ProtectedRoute from './layouts/Protected-Route'
import ConfirmAccount from './pages/Confirm-Account'
import EditProject from './pages/Edit-Project'
import ForgotPassword from './pages/Forgot-Password'
import Login from './pages/Login'
import NewCollaborator from './pages/New-Collaborator'
import NewPassword from './pages/New-Password'
import NewProject from './pages/New-Project'
import Project from './pages/Project'
import Projects from './pages/Projects'
import Register from './pages/Register'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <Routes>
            <Route path="/" element={<AuthLayout/>}>
              <Route index element={<Login/>}/>
              <Route path="register" element={<Register/>} />
              <Route path="forgot-password" element={<ForgotPassword/>} />
              <Route path="forgot-password/:token" element={<NewPassword/>} />
              <Route path="confirm/:token" element={<ConfirmAccount/>} />
            </Route>
            <Route path='/projects' element={<ProtectedRoute/>}>
              <Route index element={<Projects/>} />
              <Route path='create-project' element={<NewProject/>}/>
              <Route path=':id' element={<Project/>}/>
              <Route path='edit/:id' element={<EditProject/>}/>
              <Route path='new-collaborator/:id' element={<NewCollaborator/>}/>
            </Route>
          </Routes>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

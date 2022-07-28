import { Navigate, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { auth, loading } = useAuth()

  if (loading) return 'Cargando...'

  return (
    <>
      {auth._id
        ? (
        <div className="bg-gray-100">
          <Header />
          <div className="md:flex md:min-h-screen">
            <Sidebar />
          </div>
          <main className="p-10 flex-1">
            <Outlet />
          </main>
        </div>
          )
        : (
        <Navigate to="/" />
          )}
    </>
  )
}

export default ProtectedRoute

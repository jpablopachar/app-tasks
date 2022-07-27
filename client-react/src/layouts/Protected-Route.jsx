import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { auth, loading } = useAuth()

  console.log(auth)

  if (loading) return 'Cargando...'

  return (<>{auth._id ? (<h1>Hola mundo!</h1>) : <Navigate to="/" />}</>)
}

export default ProtectedRoute

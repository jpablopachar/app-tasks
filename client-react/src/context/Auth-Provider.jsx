import { createContext, useEffect, useState } from 'react'
import { axiosClient } from '../config/Axios-Client'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(true)

  // const navigate = useNavigate()

  useEffect(() => {
    const authenticatedUser = async () => {
      const token = localStorage.getItem('token')

      console.log(token)

      if (!token) {
        setLoading(false)

        return
      }

      try {
        const { data } = await axiosClient('/users/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        console.log(data)

        setAuth(data)
        // navigate('/projects')
      } catch (error) {
        setAuth({})
      }

      setLoading(false)
    }

    authenticatedUser()
  }, [])

  const logOut = () => {
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, loading, setLoading, logOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

export default AuthContext

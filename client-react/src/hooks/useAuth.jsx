import { useContext } from 'react'
import AuthContext from '../context/Auth-Provider'

export const useAuth = () => useContext(AuthContext)

import { useAuth } from './useAuth'
import { useProjects } from './useProjects'

export const useAdmin = () => {
  const { project } = useProjects()
  const { auth } = useAuth()

  return project.creator === auth._id
}

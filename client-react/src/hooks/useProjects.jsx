import { useContext } from 'react'
import ProjectsContext from '../context/Projects-Provider'

export const useProjects = () => useContext(ProjectsContext)

import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../config/Axios-Client'
import { useAuth } from '../hooks/useAuth'

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState({})
  const [project, setProject] = useState({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(false)

  const navigate = useNavigate()
  const { auth } = useAuth()

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) return

        const { data } = await axiosClient('/projects', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        setProjects(data)
      } catch (error) {
        console.log(error)
      }
    }

    getProjects()
  }, [auth])

  const showAlert = (alert) => {
    setAlert(alert)

    setTimeout(() => {
      setAlert({})
    }, 5000)
  }

  const submitProject = async (project) => {
    if (project.id) {
      await editProject(project)
    } else {
      await newProject(project)
    }
  }

  const editProject = async (project) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.put(
        `/projects/${project._id}`,
        project,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const updatedProjects = projects.map((currentProject) =>
        currentProject._id === data._id ? data : currentProject
      )

      setProject(updatedProjects)
      showAlert({ msg: 'Proyecto actualizado correctamente', error: false })
      setTimeout(() => {
        setAlert({})
        navigate('/projects')
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const newProject = async (project) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post(
        `/projects/${project._id}`,
        project,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProject([...projects, data])
      showAlert({ msg: 'Proyecto creado correctamente', error: false })
      setTimeout(() => {
        setAlert({})
        navigate('/projects')
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const getProject = async (id) => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient(`/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      setProject(data)
      setAlert({})
    } catch (error) {
      navigate('/projects')
      setAlert({ msg: error.response.data.msg, error: true })
      setTimeout(() => {
        setAlert({})
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.delete(`/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const updatedProjects = projects.filter((project) => project._id !== id)

      setProjects(updatedProjects)
      showAlert({ msg: data.msg, error: false })
      setTimeout(() => {
        setAlert({})
        navigate('/projects')
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    setSearch(!search)
  }

  const logOutProjects = () => {
    setProjects([])
    setProject({})
    setAlert({})
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        showAlert,
        alert,
        submitProject,
        getProject,
        project,
        loading,
        deleteProject,
        search,
        handleSearch,
        logOutProjects
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }

export default ProjectsContext

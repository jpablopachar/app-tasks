import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { axiosClient } from '../config/Axios-Client'
import { useAuth } from '../hooks/useAuth'

const ProjectsContext = createContext()

let socket

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState({})
  const [project, setProject] = useState({})
  const [loading, setLoading] = useState(false)
  const [modalFormTask, setModalFormTask] = useState(false)
  const [task, setTask] = useState({})
  const [modalDeleteTask, setModalDeleteTask] = useState(false)
  const [collaborator, setCollaborator] = useState({})
  const [modalDeleteCollaborator, setModalDeleteCollaborator] = useState(false)
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

        console.log(data)

        setProjects(data)
      } catch (error) {
        console.log(error)
      }
    }

    getProjects()
  }, [auth])

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL)
  }, [])

  const showAlert = (alert) => {
    setAlert(alert)

    setTimeout(() => {
      setAlert({})
    }, 5000)
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

      console.log(data)

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

  const newProject = async (project) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post('/projects', project, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

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

  const submitProject = async (project) => {
    if (project.id) {
      await editProject(project)
    } else {
      await newProject(project)
    }
  }

  const newTask = async (task) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post('/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      setAlert({})
      setModalFormTask(false)

      socket.emit('new task', data)
    } catch (error) {
      console.log(error)
    }
  }

  const editTask = async (task) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.put(`tasks/${task._id}`, task, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      setAlert({})
      setModalFormTask(false)

      socket.emit('edit task', data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.delete(`tasks/${task._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      setAlert({ msg: data.msg, error: false })
      setModalDeleteTask(false)

      socket.emit('remove task', task)

      setTask({})
      setTimeout(() => {
        setAlert({})
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post(
        `/task/status/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTask({})
      setAlert({})

      socket.emit('change status', data)
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleModalTask = () => {
    setModalFormTask(!modalFormTask)
    setTask({})
  }

  const handleModalEditTask = (task) => {
    setTask(task)
    setModalFormTask(true)
  }

  const handleModalDeleteTask = (task) => {
    setTask(task)
    setModalDeleteTask(!modalDeleteTask)
  }

  const submitTask = async (task) => {
    if (task?.id) {
      await editTask(task)
    } else {
      await newTask(task)
    }
  }

  const addCollaborator = async (email) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post(
        `/projects/collaborators/${project._id}`,
        email,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setAlert({ msg: data.msg, error: false })
      setCollaborator({})
      setTimeout(() => {
        setAlert({})
      }, 3000)
    } catch (error) {
      setAlert({ msg: error.response.data.msg, error: true })
    }
  }

  const deleteCollaborator = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post(
        `/projects/delete-collaborator/${project._id}`,
        { id: collaborator._id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const updatedProject = { ...project }

      updatedProject.collaborators = updatedProject.collaborators.filter(
        (currentCollaborator) => currentCollaborator._id !== collaborator._id
      )

      setProject(updatedProject)
      setAlert({ msg: data.msg, error: false })
      setCollaborator({})
      setModalDeleteCollaborator(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleModalDeleteCollaborator = (collaborator) => {
    setModalDeleteCollaborator(!modalDeleteCollaborator)
    setCollaborator(collaborator)
  }

  const submitCollaborator = async (email) => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await axiosClient.post(
        '/projects/collaborators',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setCollaborator(data)
      setAlert({})
    } catch (error) {
      setAlert({ msg: error.response.data.msg, error: true })
    } finally {
      setLoading(false)
    }
  }

  const submitTasksProject = async (task) => {
    const updatedProject = { ...project }

    updatedProject.tasks = [...updatedProject.tasks, task]

    setProject(updatedProject)
  }

  const deleteTaskProject = async (task) => {
    const updatedProject = { ...project }

    updatedProject.tasks = updatedProject.tasks.filter(
      (currentTask) => currentTask._id !== task._id
    )

    setProject(updatedProject)
  }

  const updateTaskProject = async (task) => {
    const updatedProject = { ...project }

    updatedProject.tasks = updatedProject.tasks.map((currentTask) =>
      currentTask._id === task._id ? task : currentTask
    )

    setProject(updatedProject)
  }

  const changeStatusTask = async (task) => {
    const updatedProject = { ...project }

    updatedProject.tasks = updatedProject.tasks.map((currentTask) =>
      currentTask._id === task._id ? task : currentTask
    )

    setProject(updatedProject)
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
        modalFormTask,
        handleModalTask,
        submitTask,
        handleModalEditTask,
        task,
        modalDeleteTask,
        handleModalDeleteTask,
        deleteTask,
        submitCollaborator,
        collaborator,
        addCollaborator,
        handleModalDeleteCollaborator,
        modalDeleteCollaborator,
        deleteCollaborator,
        completeTask,
        search,
        handleSearch,
        submitTasksProject,
        deleteTaskProject,
        updateTaskProject,
        changeStatusTask,
        logOutProjects
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }

export default ProjectsContext

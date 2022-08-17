import { createProject, getProjectById } from '../services/projectService.js'
import {
  createTask, deleteTask, getTaskById,
  getTaskByStatus, setTask
} from '../services/taskService.js'

const getTask = async (req, res) => {
  const task = await getTaskById(req.params.id)

  if (!task) {
    const error = new Error('La tarea no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para ver esta tarea')

    return res.status(403).json({ msg: error.message })
  }

  return res.json(task)
}

const newTask = async (req, res) => {
  const { project } = req.body

  const currentProject = getProjectById(project)

  if (!currentProject) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (currentProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para añadir tareas')

    return res.status(403).json({ msg: error.message })
  }

  const newTask = await createTask(req.body)

  if (newTask) {
    currentProject.tasks.push(newTask._id)

    const result = await createProject(currentProject)

    if (result) {
      return res.json(newTask)
    }
  }
}

const editTask = async (req, res) => {
  const task = await getTaskById(req.params.id)

  if (!task) {
    const error = new Error('La tarea no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para editar esta tarea')

    return res.status(401).json({ msg: error.message })
  }

  const { name, description, priority, deliverDate } = req.body

  task.name = name || task.name
  task.description = description || task.description
  task.priority = priority || task.priority
  task.deliverDate = deliverDate || task.deliverDate

  const updatedTask = await setTask(task)

  return res.json(updatedTask)
}

const removeTask = async (req, res) => {
  const task = await getTaskById(req.params.id)

  if (!task) {
    const error = new Error('La tarea no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para eliminar esta tarea')

    return res.status(401).json({ msg: error.message })
  }

  const currentProject = await getProjectById(task.project)

  if (currentProject) {
    currentProject.tasks.pull(task._id)

    const removeTask = await deleteTask(currentProject, task)

    if (removeTask) {
      return res.json({ msg: 'Tarea eliminada correctamente' })
    }
  }
}

const changeStatus = async (req, res) => {
  const task = await getTaskById(req.params.id)

  if (!task) {
    const error = new Error('La tarea no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('No tienes permisos para ver esta tarea')

    return res.status(401).json({ msg: error.message })
  }

  task.status = !task.status
  task.completed = req.user._id

  const updatedTask = await setTask(task)

  if (updatedTask) {
    const storedTask = await getTaskByStatus(updatedTask)

    if (storedTask) {
      return res.json(storedTask)
    }
  }
}

export { getTask, newTask, editTask, removeTask, changeStatus }


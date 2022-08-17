import Project from '../models/project.js'
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects
} from '../services/projectService.js'
import { getProjectByCollaborators } from '../services/userService.js'

const getAllProjects = async (req, res) => {
  const projects = await getProjects(req.user)

  res.json(projects)
}

const getProject = async (req, res) => {
  const project = await getProjectById(req.params.id)

  if (!project) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('No tienes permisos para ver este proyecto')

    return res.status(401).json({ msg: error.message })
  }

  return res.json(project)
}

const newProject = async (req, res) => {
  const project = new Project(req.body)

  project.creator = req.user._id

  const newProject = await createProject(project)

  return res.json(newProject)
}

const editProject = async (req, res) => {
  const project = await getProjectById(req.params.id)

  if (!project) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para editar este proyecto')

    return res.status(401).json({ msg: error.message })
  }

  const { name, description, deliverDate, client } = req.body

  project.name = name || project.name
  project.description = description || project.description
  project.deliverDate = deliverDate || project.deliverDate
  project.client = client || project.client

  const updatedProject = await createProject(project)

  res.json(updatedProject)
}

const removeProject = async (req, res) => {
  const project = await getProjectById(req.params.id)

  if (!project) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para eliminar este proyecto')

    return res.status(401).json({ msg: error.message })
  }

  const deletedProject = await deleteProject(project)

  if (deletedProject) {
    res.json({ msg: 'Proyecto eliminado correctamente' })
  }
}

const searchCollaborator = async (req, res) => {
  const user = await getProjectByCollaborators(req.body.email)

  if (!user) {
    const error = new Error('El usuario no existe')

    return res.status(404).json({ msg: error.message })
  }

  res.json(user)
}

const addCollaborator = async (req, res) => {
  const project = await getProjectById(req.params.id)

  if (!project) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para agregar colaboradores')

    return res.status(401).json({ msg: error.message })
  }

  const user = await getProjectByCollaborators(req.body.email)

  if (!user) {
    const error = new Error('El usuario no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador')

    return res.status(404).json({ msg: error.message })
  }

  if (project.collaborators.includes(user._id)) {
    const error = new Error('El usuario ya es colaborador')

    return res.status(404).json({ msg: error.message })
  }

  project.collaborators.push(user._id)

  const updatedProject = await createProject(project)

  if (updatedProject) {
    res.json({ msg: 'Colaborador agregado correctamente' })
  }
}

const deleteCollaborator = async (req, res) => {
  const project = await getProjectById(req.params.id)

  if (!project) {
    const error = new Error('El proyecto no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permisos para eliminar colaboradores')

    return res.status(401).json({ msg: error.message })
  }

  project.collaborators.pull(req.body.id)

  const updatedProject = await createProject(project)

  if (updatedProject) {
    res.json({ msg: 'Colaborador eliminado correctamente' })
  }
}

export {
  getAllProjects,
  getProject,
  newProject,
  editProject,
  removeProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator
}


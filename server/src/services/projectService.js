import Project from '../models/project.js'

const getProjects = async (user) => {
  const projects = await Project.find({
    $or: [{ collaborators: { $in: user } }, { creator: { $in: user } }]
  }).select('-tasks')

  return projects
}

const getProjectByTasks = async (id) => {
  const project = await Project.findById(id)
    .populate({
      path: 'tasks',
      populate: { path: 'completed', select: 'name' }
    })
    .populate('collaborators', 'name email')

  return project
}

const getProjectById = async (id) => {
  const project = await Project.findById(id)

  return project
}

const createProject = async (project) => {
  try {
    const newProject = await project.save()

    return newProject
  } catch (error) {
    console.log(error)
  }
}

const deleteProject = async (project) => {
  try {
    await project.deleteOne()

    return true
  } catch (error) {
    console.log(error)
  }
}

export { getProjects, getProjectByTasks, getProjectById, createProject, deleteProject }


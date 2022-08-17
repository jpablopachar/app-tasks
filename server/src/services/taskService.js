import Task from '../models/task.js'

const getTaskById = async (id) => {
  const task = await Task.findById(id).populate('project')

  return task
}

const getTaskByStatus = async (id) => {
  const task = await Task.findById(id)
    .populate('project')
    .populate('completed')

  return task
}

const createTask = async (task) => {
  try {
    const newTask = await Task.create(task)

    return newTask
  } catch (error) {
    console.log(error)
  }
}

const setTask = async (task) => {
  try {
    const newTask = await Task.save()

    return newTask
  } catch (error) {
    console.log(error)
  }
}

const deleteTask = async (project, task) => {
  try {
    await Promise.allSettled([await project.save(), await task.deleteOne()])

    return true
  } catch (error) {
    console.log(error)
  }
}

export { getTaskById, getTaskByStatus, createTask, setTask, deleteTask }


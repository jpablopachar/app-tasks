import User from '../models/user.js'

const getUser = async (email) => {
  const user = await User.findOne({ email })

  return user
}

const getUserToken = async (token) => {
  const user = await User.findOne({ token })

  return user
}

const getProjectByCollaborators = async (email) => {
  const user = await User.findOne({ email }).select(
    '-confirmed -createdAt -password -token -updatedAt -__v'
  )

  return user
}

const createUser = async (user) => {
  const newUser = await user.save()

  return newUser
}

export { getUser, getUserToken, getProjectByCollaborators, createUser }


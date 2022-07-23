import User from '../models/user.js'

export const getUser = async (email) => {
  const user = await User.findOne({ email })

  return user
}

export const getUserToken = async (token) => {
  const user = await User.findOne({ token })

  return user
}

export const createUser = async (user) => {
  await user.save()
}

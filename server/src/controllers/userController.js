// import { emailRegistration } from '../helpers/email.js'
import { generateId } from '../helpers/helpers.js'
import { jwtGenerator } from '../helpers/jwt.js'
import User from '../models/user.js'
import { createUser, getUser, getUserToken } from '../services/userService.js'

const register = (req, res) => {
  const { email } = req.body
  const userExists = getUser(email)

  if (userExists) {
    const error = new Error('Usuario ya registrado')

    return res.status(400).json({ msg: error.message })
  }

  try {
    const user = new User(req.body)

    user.token = generateId()

    createUser(user)

    /* emailRegistration({
      email: user.email,
      name: user.name,
      token: user.token
    }) */

    res.json({
      msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'
    })
  } catch (error) {
    console.log(error)
  }
}

const authenticate = (req, res) => {
  const { email, password } = req.body
  const user = getUser(email)

  if (!user) {
    const error = new Error('El usuario no existe')

    return res.status(404).json({ msg: error.message })
  }

  if (!user.confirmed) {
    const error = new Error('Tu cuenta no ha sido confirmada')

    return res.status(401).json({ msg: error.message })
  }

  if (user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwtGenerator(user._id)
    })
  } else {
    const error = new Error('El password es incorrecto')

    return res.status(403).json({ msg: error.message })
  }
}

const confirm = (req, res) => {
  const { token } = req.params
  const user = getUserToken(token)

  if (!user) {
    const error = new Error('Token no válido')

    return res.status(403).json({ msg: error.message })
  }

  try {
    user.confirmed = true
    user.token = ''

    createUser(user)

    res.json({ msg: 'Usuario confirmado correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const forgetPassword = (req, res) => {
  const { email } = req.body
  const user = getUser(email)

  if (!user) {
    const error = new Error('El usuario no existe')

    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = generateId()

    createUser(user)

    // Enviar email

    res.json({ msg: 'Hemos enviado un email con las instrucciones' })
  } catch (error) {
    console.log(error)
  }
}

const checkToken = (req, res) => {
  const { token } = req.params

  const validToken = getUserToken(token)

  if (!validToken) {
    res.json({ msg: 'Token válido y el usuario existe' })
  } else {
    const error = new Error('Token no válido')

    return res.status(404).json({ msg: error.message })
  }
}

const newPassword = (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const user = getUserToken(token)

  if (user) {
    user.password = password
    user.token = ''

    try {
      createUser(user)

      res.json({ msg: 'Password modificado correctamente' })
    } catch (error) {
      console.log(error)
    }
  } else {
    const error = new Error('Token no válido')

    return res.status(404).json({ msg: error.message })
  }
}

const profile = (req, res) => {
  const { user } = req

  res.json({ user })
}

export {
  register,
  authenticate,
  confirm,
  forgetPassword,
  checkToken,
  newPassword,
  profile
}


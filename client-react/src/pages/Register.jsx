import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [alert, setAlert] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()

    if ([name, email, password, repeatPassword].includes('')) {
      setAlert({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
    }

    if (password !== repeatPassword) {
      setAlert({
        msg: 'Las contraseñas no coinciden',
        error: true
      })
    }

    if (password.length < 6) {
      setAlert({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true
      })
    }

    setAlert({})

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        { name, email, password }
      )

      setAlert({ msg: data.msg, error: false })
      setName('')
      setEmail('')
      setPassword('')
      setRepeatPassword('')
    } catch (error) {
      setAlert({ msg: error.response.data.msg, error: true })
    }
  }

  const { msg } = alert

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea tu cuenta y administra tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alert={alert} />}
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="name"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña de registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password2"
          >
            Repetir contraseña
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repite tu contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Crear cuenta"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/forgot-password"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  )
}

export default Register

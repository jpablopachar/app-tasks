import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import { axiosClient } from '../config/Axios-Client'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (email === '' || email.length < 6) {
      setAlert({
        msg: 'El correo electrónico es obligatorio',
        error: true
      })

      return
    }

    try {
      const { data } = await axiosClient.post('/users/forget-password', {
        email
      })

      setAlert({ msg: data.msg, error: false })
    } catch (error) {
      setAlert({ msg: error.response.data.msg, error: true })
    }
  }

  const { msg } = alert

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu acceso y no pierdas tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alert={alert}/>}
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
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
        <input
          type="submit"
          value="Enviar instrucciones"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/register"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </nav>
    </>
  )
}

export default ForgotPassword

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import { axiosClient } from '../config/Axios-Client'

const NewPassword = () => {
  const [password, setPassword] = useState('')
  const [validToken, setValidToken] = useState(false)
  const [alert, setAlert] = useState({})
  const [changedPassword, setChangedPassword] = useState(false)

  const { token } = useParams()

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axiosClient(`/users/forget-password/${token}`)

        setValidToken(true)
      } catch (error) {
        setAlert({ msg: error.response.data.msg, error: true })
      }
    }

    checkToken()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password.length < 6) {
      setAlert({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true
      })

      return
    }

    try {
      const { data } = await axiosClient.post(
        `/users/forget-password/${token}`,
        { password }
      )

      setAlert({ msg: data.msg, error: false })
      setChangedPassword(true)
    } catch (error) {
      setAlert({ msg: error.response.data.msg, error: true })
    }
  }

  const { msg } = alert

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Restablece tu password y no pierdas acceso a tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alert alert={alert} />}
      {validToken && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu nueva contraseña"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <input
            type="submit"
            value="Guardar nueva contraseña"
            className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}
      {changedPassword && (
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Inicia sesión
        </Link>
      )}
    </>
  )
}

export default NewPassword

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import { axiosClient } from '../config/Axios-Client'

const ConfirmAccount = () => {
  const [alert, setAlert] = useState({})
  const [confirmedAccount, setConfirmedAccount] = useState(false)

  const { token } = useParams()

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const { data } = await axiosClient(`/users/confirm/${token}`)

        setAlert({ msg: data.msg, error: false })
        setConfirmedAccount(true)
      } catch (error) {
        setAlert({ msg: error.response.data.msg, error: true })
      }
    }

    confirmAccount()
  }, [])

  const { msg } = alert

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma tu cuenta y comienza a crear tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alert alert={alert} />}
        {confirmedAccount && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
            Inicia Sesión
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount

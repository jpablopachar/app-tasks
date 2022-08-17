import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import Alert from './Alert'

const ProjectForm = () => {
  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deliverDate, setDeliverDate] = useState('')
  const [client, setClient] = useState('')

  const params = useParams()
  const { showAlert, alert, submitProject, project } = useProjects()

  useEffect(() => {
    if (params.id) {
      setId(params.id)
      setName(project.name)
      setDescription(project.description)
      setDeliverDate(project.deliverDate?.split('T')[0])
      setClient(project.client)
    }
  }, [params])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if ([name, description, deliverDate, client].includes('')) {
      showAlert({ msg: 'Todos los campos son obligatorios', error: true })

      return
    }

    await submitProject({ id, name, description, deliverDate, client })

    setId(null)
    setName('')
    setDescription('')
    setDeliverDate('')
    setClient('')
  }

  const { msg } = alert

  return (
    <form
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {msg && <Alert alert={alert} />}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="name"
        >
          Nombre proyecto
        </label>
        <input
          id="name"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="description"
        >
          Descripción
        </label>
        <textarea
          id="description"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripción del proyecto"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="deliverDate"
        >
          Fecha de entrega
        </label>
        <input
          id="deliverDate"
          type="date"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={deliverDate}
          onChange={(event) => setDeliverDate(event.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="client"
        >
          Nombre cliente
        </label>
        <input
          id="client"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del cliente"
          value={client}
          onChange={(event) => setClient(event.target.value)}
        />
      </div>
      <input
        type="submit"
        value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  )
}

export default ProjectForm

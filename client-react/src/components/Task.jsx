import { formatDate } from '../helpers/formatDate'
import useAdmin from '../hooks/useAdmin'
import useProjects from '../hooks/useProjects'

const Task = ({ task }) => {
  const { handleModalEditTask, handleModalDeleteTask, completeTask } =
    useProjects()
  const admin = useAdmin()

  const { description, name, priority, deliverDate, state, _id } = task

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col  items-start">
        <p className="mb-1 text-xl">{name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-sm">{formatDate(deliverDate)}</p>
        <p className="mb-1 text-gray-600">Prioridad: {priority}</p>
        {state && (
          <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">
            Completada por: {task.completed.name}
          </p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
          <button
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEditTask(task)}
          >
            Editar
          </button>
        )}
        <button
          className={`${
            state ? 'bg-sky-600' : 'bg-gray-600'
          } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completeTask(_id)}
        >
          {state ? 'Completa' : 'Incompleta'}
        </button>

        {admin && (
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalDeleteTask(task)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}

export default Task

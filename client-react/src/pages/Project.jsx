import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { useAdmin } from '../hooks/useAdmin'
import { useProjects } from '../hooks/useProjects'

let socket

const Project = () => {
  const params = useParams()
  const admin = useAdmin()
  const {
    getProject,
    project,
    loading,
    handleModalTask,
    // alert,
    submitTasksProject,
    deleteTaskProject,
    updateTaskProject,
    changeStatusTask
  } = useProjects()

  console.log(params)

  useEffect(() => getProject(params.id), [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL)

    socket.emit('open project', params.id)
  }, [])

  useEffect(() => {
    socket.on('new task', (newTask) => {
      if (newTask.project === project.id) {
        submitTasksProject(newTask)
      }
    })

    socket.on('remove task', (deletedTask) => {
      if (deletedTask.project === project.id) {
        deleteTaskProject(deletedTask)
      }
    })

    socket.on('edit task', (updatedTask) => {
      if (updatedTask.project === project.id) {
        updateTaskProject(updatedTask)
      }
    })

    socket.on('change status', (newTaskStatus) => {
      if (newTaskStatus.project === project.id) {
        changeStatusTask(newTaskStatus)
      }
    })
  })

  const { name } = project
  // const { msg } = alert

  if (loading) return 'Cargando...'

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{name}</h1>
        {admin && (
          <div className="flex items-center gap-2 text-gray-400 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <Link
              to={`/projects/edit/${params.id}`}
              className="uppercase font-bold"
            >
              Editar
            </Link>
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={handleModalTask}
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Nueva Tarea
        </button>
      )}
      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
      {/* <div className="bg-white shadow mt-10 rounded-lg">
        {project.tasks?.length
          ? (
              project.tasks?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
              ))
            )
          : (
          <p className="text-center my-5 p-10">
            No hay tareas en este proyecto
          </p>
            )}
      </div> */}

      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl">Colaboradores</p>
            <Link
              to={`/projects/new-collaborator/${project._id}`}
              className="text-gray-400 hover:text-black uppercase font-bold"
            >
              Añadir
            </Link>
          </div>
          {/* <div className="bg-white shadow mt-10 rounded-lg">
            {project.collaborators?.length
              ? (
                  proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
                  ))
                )
              : (
              <p className="text-center my-5 p-10">
                No hay Colaboradores en este proyecto
              </p>
                )}
          </div> */}
        </>
      )}
      {/* <ModalFormularioTarea/>
      <ModalEliminarTarea/>
      <ModalEliminarColaborador/> */}
    </>
  )
}

export default Project

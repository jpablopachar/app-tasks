import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { Server } from 'socket.io'
import dbConnection from './config/db.js'
import projectRoutes from './routes/projectRouter.js'
import taskRoutes from './routes/taskRouter.js'
import userRoutes from './routes/userRouter.js'

dotenv.config()
dbConnection()

const app = express()
const PORT = process.env.PORT || 3000
const whitelist = [process.env.CLIENT]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de Cors'))
    }
  }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

const server = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
})

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: process.env.CLIENT }
})

io.on('connection', (socket) => {
  socket.on('open project', (project) => {
    socket.join(project)
  })

  socket.on('new task', (task) => {
    const project = task.project

    socket.to(project).emit('Tarea agregada', task)
  })

  socket.on('edit task', (task) => {
    const project = task.project._id

    socket.to(project).emit('Tarea actualizada', task)
  })

  socket.on('remove task', (task) => {
    const project = task.project

    socket.to(project).emit('Tarea eliminada', task)
  })

  socket.on('change status', (task) => {
    const project = task.project._id

    socket.to(project).emit('Nuevo estado', task)
  })
})

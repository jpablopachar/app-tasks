import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import dbConnection from './config/db.js'
import userRoutes from './routes/userRouter.js'

dotenv.config()
dbConnection()

const app = express()
const PORT = process.env.PORT || 3000
const whitelist = [process.env.CLIENT]
const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
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

app.listen(PORT, () => { console.log(`Server on port: ${PORT}`) })

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import dbConnection from './config/db.js'
import userRoutes from './routes/userRouter.js'

dotenv.config()
dbConnection()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/users', userRoutes)

app.listen(PORT, () => { console.log(`Server on port: ${PORT}`) })

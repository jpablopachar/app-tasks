import mongoose from 'mongoose'

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(`Db connected on: ${connection.connection.host}:${connection.connection.port}`)
  } catch (error) {
    console.log(`Failed to connect: ${error.message}`)

    process.exit(1)
  }
}

export default dbConnection

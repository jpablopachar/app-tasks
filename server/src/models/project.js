import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    deliverDate: {
      type: Date,
      default: Date.now()
    },
    client: {
      type: String,
      trim: true,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)

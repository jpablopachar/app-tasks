import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
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
    state: {
      type: Boolean,
      default: false
    },
    deliverDate: {
      type: Date,
      required: true,
      default: Date.now()
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High']
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    completed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)

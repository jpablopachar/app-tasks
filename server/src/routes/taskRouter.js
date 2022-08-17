import { Router } from 'express'
import {
  changeStatus, editTask, getTask,
  newTask, removeTask
} from '../controllers/taskController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = Router()

router.post('/', checkAuth, newTask)
router
  .route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, editTask)
  .delete(checkAuth, removeTask)
router.post('/status/:id', checkAuth, changeStatus)

export default router

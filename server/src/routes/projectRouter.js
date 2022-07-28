import { Router } from 'express'
import {
  editProject,
  getAllProjects,
  getProject,
  newProject,
  removeProject
} from '../controllers/projectController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = Router()

router.route('/').get(checkAuth, getAllProjects).post(checkAuth, newProject)
router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, removeProject)

export default router

import { Router } from 'express'
import {
  addCollaborator,
  deleteCollaborator,
  editProject,
  getAllProjects,
  getProject,
  newProject,
  removeProject,
  searchCollaborator
} from '../controllers/projectController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = Router()

router.route('/').get(checkAuth, getAllProjects).post(checkAuth, newProject)
router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, removeProject)
router.post('/collaborators', checkAuth, searchCollaborator)
router.post('/collaborators/:id', checkAuth, addCollaborator)
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator)

export default router

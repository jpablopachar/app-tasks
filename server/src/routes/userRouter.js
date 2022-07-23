import { Router } from 'express'
import {
  authenticate, checkToken, confirm,
  forgetPassword, newPassword,
  profile, register
} from '../controllers/userController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = Router()

router.post('/', register)
router.post('/login', authenticate)
router.get('/confirm/:token', confirm)
router.post('/forget-password', forgetPassword)
router.route('/forget-password/:token').get(checkToken).post(newPassword)
router.get('/profile', checkAuth, profile)

export default router

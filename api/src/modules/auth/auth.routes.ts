import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { authenticate } from '../../middleware/authenticate'
import * as controller from './auth.controller'

const router = Router()

router.post('/register', asyncHandler(controller.register))
router.post('/login', asyncHandler(controller.login))
router.post('/refresh', asyncHandler(controller.refresh))
router.get('/me', authenticate, asyncHandler(controller.me))

export default router

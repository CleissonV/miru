import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { authenticate } from '../../middleware/authenticate'
import * as controller from './auth.controller'

const router = Router()

router.post('/register', asyncHandler(controller.register))
router.post('/login', asyncHandler(controller.login))
router.post('/refresh', asyncHandler(controller.refresh))
router.get('/me', authenticate, asyncHandler(controller.me))
router.get('/verify-email', asyncHandler(controller.verifyEmail))
router.post('/resend-verification', asyncHandler(controller.resendVerification))
router.post('/forgot-password', asyncHandler(controller.forgotPassword))
router.post('/reset-password', asyncHandler(controller.resetPassword))

export default router

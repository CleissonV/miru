import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { authenticate } from '../../middleware/authenticate'
import * as controller from './user.controller'

const router = Router()

router.patch('/me', authenticate, asyncHandler(controller.updateProfile))
router.patch('/me/password', authenticate, asyncHandler(controller.changePassword))
router.post('/me/avatar', authenticate, controller.uploadAvatar)
router.get('/:username', asyncHandler(controller.profile))
router.get('/:username/entries', asyncHandler(controller.publicEntries))

export default router

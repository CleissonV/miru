import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import * as controller from './media.controller'

const router = Router()

router.get('/trending', asyncHandler(controller.trending))
router.get('/:type/:id', asyncHandler(controller.detail))

export default router

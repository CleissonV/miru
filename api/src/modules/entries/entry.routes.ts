import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { authenticate } from '../../middleware/authenticate'
import * as controller from './entry.controller'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(controller.list))
router.get('/stats', asyncHandler(controller.stats))
router.get('/:id', asyncHandler(controller.getOne))
router.post('/', asyncHandler(controller.create))
router.patch('/:id', asyncHandler(controller.update))
router.delete('/:id', asyncHandler(controller.remove))

export default router

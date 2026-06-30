import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import * as controller from './search.controller'

const router = Router()

router.get('/', asyncHandler(controller.search))

export default router

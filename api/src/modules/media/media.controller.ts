import type { Request, Response } from 'express'
import { ApiError } from '../../utils/apiError'
import * as mediaService from './media.service'
import type { MediaType } from '../../types'

const VALID_TYPES = new Set(['movie', 'series', 'anime', 'dorama'])

export async function detail(req: Request, res: Response) {
  const rawType = req.params.type.toLowerCase()

  if (!VALID_TYPES.has(rawType)) {
    throw ApiError.badRequest('Tipo inválido. Use: movie, series ou anime')
  }

  const type = rawType.toUpperCase() as MediaType
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) throw ApiError.badRequest('ID inválido')

  const result = await mediaService.getDetail(type, id)
  res.json(result)
}

export async function trending(_req: Request, res: Response) {
  const result = await mediaService.getTrending()
  res.json(result)
}

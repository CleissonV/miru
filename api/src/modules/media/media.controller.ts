import type { Request, Response } from 'express'
import { ApiError } from '../../utils/apiError'
import * as mediaService from './media.service'
import type { MediaType } from '../../types'
import type { Lang } from './providers/tmdb'

const VALID_TYPES = new Set(['movie', 'series', 'anime', 'dorama', 'manga'])

function parseLang(raw: unknown): Lang {
  return raw === 'en' ? 'en' : 'pt-BR'
}

export async function detail(req: Request, res: Response) {
  const rawType = req.params.type.toLowerCase()

  if (!VALID_TYPES.has(rawType)) {
    throw ApiError.badRequest('Tipo inválido. Use: movie, series ou anime')
  }

  const type = rawType.toUpperCase() as MediaType
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) throw ApiError.badRequest('ID inválido')

  const result = await mediaService.getDetail(type, id, parseLang(req.query.lang))
  res.json(result)
}

export async function trending(req: Request, res: Response) {
  const result = await mediaService.getTrending(parseLang(req.query.lang))
  res.json(result)
}

import type { Request, Response } from 'express'
import { z } from 'zod'
import * as searchService from './search.service'
import { ApiError } from '../../utils/apiError'
import type { MediaType } from '../../types'

const querySchema = z.object({
  q: z.string().min(1, 'Parâmetro q obrigatório').max(100),
  type: z.enum(['MOVIE', 'SERIES', 'ANIME']).optional(),
})

export async function search(req: Request, res: Response) {
  const parsed = querySchema.safeParse(req.query)

  if (!parsed.success) {
    throw ApiError.badRequest(parsed.error.errors[0].message)
  }

  const { q, type } = parsed.data
  const results = await searchService.search(q, type as MediaType | undefined)
  res.json(results)
}

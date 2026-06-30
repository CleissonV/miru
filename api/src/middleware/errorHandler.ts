import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../utils/apiError'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof ZodError) {
    const message = err.errors.map(e => e.message).join(', ')
    return res.status(400).json({ error: message })
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[Unhandled error]', err)
  }

  return res.status(500).json({ error: 'Erro interno do servidor' })
}

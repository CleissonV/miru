import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { ApiError } from '../utils/apiError'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized()
  }

  const token = header.slice(7)

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    throw ApiError.unauthorized('Token inválido ou expirado')
  }
}

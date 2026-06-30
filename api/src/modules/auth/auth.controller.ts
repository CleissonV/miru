import type { Request, Response } from 'express'
import { db } from '../../db/prisma'
import * as authService from './auth.service'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body)
  const result = await authService.register(body)
  res.status(201).json(result)
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body)
  const result = await authService.login(body)
  res.json(result)
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body)
  const tokens = await authService.refreshTokens(refreshToken)
  res.json(tokens)
}

export async function me(req: Request, res: Response) {
  const user = await db.user.findUnique({
    where: { id: req.user!.sub },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isPublic: true,
      language: true,
      createdAt: true,
    },
  })
  res.json(user)
}

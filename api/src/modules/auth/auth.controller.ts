import type { Request, Response } from 'express'
import { db } from '../../db/prisma'
import * as authService from './auth.service'
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema'

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
      emailVerified: true,
      createdAt: true,
    },
  })
  res.json(user)
}

export async function verifyEmail(req: Request, res: Response) {
  const { token } = verifyEmailSchema.parse(req.query)
  await authService.verifyEmail(token)
  res.json({ message: 'E-mail verificado com sucesso' })
}

export async function resendVerification(req: Request, res: Response) {
  await authService.resendVerification(req.user!.sub)
  res.json({ message: 'E-mail de verificação reenviado' })
}

export async function forgotPassword(req: Request, res: Response) {
  const body = forgotPasswordSchema.parse(req.body)
  await authService.requestPasswordReset(body)
  res.json({ message: 'Se o e-mail existir, um código foi enviado' })
}

export async function resetPassword(req: Request, res: Response) {
  const body = resetPasswordSchema.parse(req.body)
  await authService.resetPassword(body)
  res.json({ message: 'Senha redefinida com sucesso' })
}

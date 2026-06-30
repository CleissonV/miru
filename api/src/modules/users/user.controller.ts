import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as userService from './user.service'
import { uploadAvatar as uploadAvatarMw, avatarUrl } from '../../middleware/upload'
import { ApiError } from '../../utils/apiError'

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  language: z.enum(['pt-BR', 'en']).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
})

export async function profile(req: Request, res: Response) {
  const data = await userService.getPublicProfile(req.params.username)
  res.json(data)
}

export async function publicEntries(req: Request, res: Response) {
  const entries = await userService.getPublicEntries(req.params.username)
  res.json(entries)
}

export async function updateProfile(req: Request, res: Response) {
  const body = updateProfileSchema.parse(req.body)
  const updated = await userService.updateProfile(req.user!.sub, body)
  res.json(updated)
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
  await userService.changePassword(req.user!.sub, currentPassword, newPassword)
  res.json({ message: 'Senha alterada com sucesso' })
}

export function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  uploadAvatarMw(req, res, async (err: unknown) => {
    if (err) return next(ApiError.badRequest(err instanceof Error ? err.message : 'Falha no upload'))
    if (!req.file) return next(ApiError.badRequest('Nenhuma imagem enviada'))

    try {
      const updated = await userService.updateAvatar(req.user!.sub, avatarUrl(req.file.filename))
      res.json(updated)
    } catch (e) {
      next(e)
    }
  })
}

import type { Request, Response } from 'express'
import { z } from 'zod'
import * as userService from './user.service'

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  language: z.enum(['pt-BR', 'en']).optional(),
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

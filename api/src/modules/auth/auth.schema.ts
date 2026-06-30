import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(24, 'Máximo 24 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e _'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  displayName: z.string().max(50).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

export type RegisterBody = z.infer<typeof registerSchema>
export type LoginBody = z.infer<typeof loginSchema>

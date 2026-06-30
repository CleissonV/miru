import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  TMDB_API_KEY: z.string().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  RESEND_API_KEY: z.string().default(''),
  EMAIL_FROM: z.string().default('Miru <onboarding@resend.dev>'),
})

const result = schema.safeParse(process.env)

if (!result.success) {
  console.error('❌ Variáveis de ambiente inválidas:')
  console.error(result.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = result.data

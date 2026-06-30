import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { db } from '../../db/prisma'
import { redis } from '../../lib/redis'
import { env } from '../../config/env'
import { sendEmail, verificationEmailHtml, resetPasswordEmailHtml } from '../../lib/email'
import { ApiError } from '../../utils/apiError'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt'
import type { RegisterBody, LoginBody, ForgotPasswordBody, ResetPasswordBody } from './auth.schema'

const VERIFY_TTL = 60 * 60 * 24 // 24h
const RESET_TTL = 60 * 15 // 15min

async function sendVerificationEmail(userId: string, email: string) {
  const token = crypto.randomBytes(32).toString('hex')
  await redis.setex(`verify_email:${token}`, VERIFY_TTL, userId)
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`
  await sendEmail(email, 'Confirme seu e-mail — Miru', verificationEmailHtml(verifyUrl))
}

export async function register(data: RegisterBody) {
  const existing = await db.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
    select: { email: true, username: true },
  })

  if (existing) {
    const field = existing.email === data.email ? 'email' : 'username'
    throw ApiError.conflict(`Esse ${field} já está em uso`)
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const user = await db.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName ?? data.username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      language: true,
      emailVerified: true,
    },
  })

  await sendVerificationEmail(user.id, user.email)

  const payload = { sub: user.id, username: user.username }

  return {
    user,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export async function login(data: LoginBody) {
  const user = await db.user.findUnique({
    where: { email: data.email },
  })

  const passwordMatches = user
    ? await bcrypt.compare(data.password, user.passwordHash)
    : false

  // Mesmo erro independente se email existe — evita user enumeration
  if (!user || !passwordMatches) {
    throw ApiError.unauthorized('Credenciais inválidas')
  }

  const payload = { sub: user.id, username: user.username }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      language: user.language,
      emailVerified: user.emailVerified,
    },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export async function refreshTokens(token: string) {
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw ApiError.unauthorized('Refresh token inválido ou expirado')
  }

  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, username: true },
  })

  if (!user) throw ApiError.unauthorized('Usuário não encontrado')

  const newPayload = { sub: user.id, username: user.username }

  return {
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload),
  }
}

export async function verifyEmail(token: string) {
  const userId = await redis.get(`verify_email:${token}`)
  if (!userId) throw ApiError.badRequest('Link de verificação inválido ou expirado')

  await db.user.update({ where: { id: userId }, data: { emailVerified: true } })
  await redis.del(`verify_email:${token}`)
}

export async function resendVerification(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw ApiError.notFound('Usuário não encontrado')
  if (user.emailVerified) throw ApiError.conflict('E-mail já verificado')

  await sendVerificationEmail(user.id, user.email)
}

export async function requestPasswordReset(data: ForgotPasswordBody) {
  const user = await db.user.findUnique({ where: { email: data.email } })

  // Não revela se o e-mail existe — evita user enumeration
  if (!user) return

  const code = crypto.randomInt(100000, 999999).toString()
  await redis.setex(`reset_pw:${data.email}`, RESET_TTL, code)
  await sendEmail(data.email, 'Redefinir senha — Miru', resetPasswordEmailHtml(code))
}

export async function resetPassword(data: ResetPasswordBody) {
  const storedCode = await redis.get(`reset_pw:${data.email}`)

  if (!storedCode || storedCode !== data.code) {
    throw ApiError.badRequest('Código inválido ou expirado')
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10)
  await db.user.update({ where: { email: data.email }, data: { passwordHash } })
  await redis.del(`reset_pw:${data.email}`)
}

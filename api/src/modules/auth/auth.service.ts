import bcrypt from 'bcryptjs'
import { db } from '../../db/prisma'
import { ApiError } from '../../utils/apiError'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt'
import type { RegisterBody, LoginBody } from './auth.schema'

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
    },
  })

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

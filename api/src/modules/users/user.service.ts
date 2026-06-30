import bcrypt from 'bcryptjs'
import { db } from '../../db/prisma'
import { ApiError } from '../../utils/apiError'

export async function getPublicProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isPublic: true,
      createdAt: true,
      _count: { select: { entries: true } },
    },
  })

  if (!user) throw ApiError.notFound('Usuário não encontrado')
  if (!user.isPublic) throw ApiError.forbidden('Este perfil é privado')

  return user
}

export async function getPublicEntries(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, isPublic: true },
  })

  if (!user) throw ApiError.notFound('Usuário não encontrado')
  if (!user.isPublic) throw ApiError.forbidden('Este perfil é privado')

  return db.entry.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function updateProfile(
  userId: string,
  data: {
    displayName?: string
    bio?: string
    avatar?: string
    isPublic?: boolean
    language?: string
  },
) {
  return db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isPublic: true,
      language: true,
    },
  })
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw ApiError.notFound('Usuário não encontrado')

  const matches = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!matches) throw ApiError.unauthorized('Senha atual incorreta')

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await db.user.update({ where: { id: userId }, data: { passwordHash } })
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  return db.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      isPublic: true,
      language: true,
    },
  })
}

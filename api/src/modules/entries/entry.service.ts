import { db } from '../../db/prisma'
import { ApiError } from '../../utils/apiError'
import type { CreateEntryBody, UpdateEntryBody, ListEntriesQuery } from './entry.schema'

export async function listEntries(userId: string, query: ListEntriesQuery) {
  const { status, mediaType, page, limit } = query
  const skip = (page - 1) * limit

  const where = {
    userId,
    ...(status && { status }),
    ...(mediaType && { mediaType }),
  }

  const [entries, total] = await Promise.all([
    db.entry.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    db.entry.count({ where }),
  ])

  return {
    entries,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

export async function findEntry(userId: string, entryId: string) {
  const entry = await db.entry.findFirst({ where: { id: entryId, userId } })
  if (!entry) throw ApiError.notFound('Entrada não encontrada')
  return entry
}

export async function createEntry(userId: string, data: CreateEntryBody) {
  const exists = await db.entry.findUnique({
    where: {
      userId_mediaType_externalId: {
        userId,
        mediaType: data.mediaType,
        externalId: data.externalId,
      },
    },
  })

  if (exists) throw ApiError.conflict('Esse título já está na sua lista')

  return db.entry.create({
    data: {
      userId,
      mediaType: data.mediaType,
      externalId: data.externalId,
      status: data.status,
      rating: data.rating ?? null,
      episodesWatched: data.episodesWatched ?? null,
      notes: data.notes ?? null,
      startedAt: data.startedAt ? new Date(data.startedAt) : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  })
}

export async function updateEntry(userId: string, entryId: string, data: UpdateEntryBody) {
  await findEntry(userId, entryId)

  return db.entry.update({
    where: { id: entryId },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.episodesWatched !== undefined && { episodesWatched: data.episodesWatched }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.startedAt !== undefined && {
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
      }),
      ...(data.completedAt !== undefined && {
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      }),
    },
  })
}

export async function deleteEntry(userId: string, entryId: string) {
  await findEntry(userId, entryId)
  await db.entry.delete({ where: { id: entryId } })
}

export async function getStats(userId: string) {
  const entries = await db.entry.findMany({
    where: { userId },
    select: { mediaType: true, status: true, rating: true },
  })

  const types = ['MOVIE', 'SERIES', 'ANIME'] as const
  const statusList = ['PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED'] as const

  const byType = Object.fromEntries(
    types.map((t) => {
      const subset = entries.filter(e => e.mediaType === t)
      const ratings = subset.map(e => e.rating).filter(Boolean) as number[]
      return [t, {
        total: subset.length,
        completed: subset.filter(e => e.status === 'COMPLETED').length,
        avgRating: ratings.length
          ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
          : null,
      }]
    })
  )

  const statusBreakdown = Object.fromEntries(
    statusList.map(s => [s, entries.filter(e => e.status === s).length])
  )

  return { total: entries.length, byType, statusBreakdown }
}

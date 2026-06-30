import { db } from '../../db/prisma'
import { ApiError } from '../../utils/apiError'
import type { MediaType, MediaResult } from '../../types'
import * as tmdb from './providers/tmdb'
import * as jikan from './providers/jikan'

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24h

export async function getDetail(type: MediaType, id: number): Promise<MediaResult> {
  const cached = await db.mediaCache.findUnique({
    where: { externalId_mediaType: { externalId: id, mediaType: type } },
  })

  if (cached && Date.now() - cached.cachedAt.getTime() < CACHE_TTL_MS) {
    return cached.data as unknown as MediaResult
  }

  let result: MediaResult

  if (type === 'MOVIE') result = await tmdb.getMovie(id)
  else if (type === 'SERIES') result = await tmdb.getSeries(id)
  else if (type === 'ANIME') result = await jikan.getAnime(id)
  else if (type === 'DORAMA') result = await tmdb.getDorama(id)
  else throw ApiError.badRequest('Tipo de mídia inválido')

  await db.mediaCache.upsert({
    where: { externalId_mediaType: { externalId: id, mediaType: type } },
    create: { externalId: id, mediaType: type, data: result as object },
    update: { data: result as object, cachedAt: new Date() },
  })

  return result
}

export async function getTrending() {
  const [trending, topAnime, doramas] = await Promise.all([
    tmdb.getTrending(),
    jikan.getTopAnime(),
    tmdb.getTrendingDoramas(),
  ])

  return {
    movies: trending.filter(m => m.type === 'MOVIE').slice(0, 8),
    series: trending.filter(m => m.type === 'SERIES').slice(0, 8),
    anime: topAnime.slice(0, 8),
    doramas: doramas.slice(0, 8),
  }
}

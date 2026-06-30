import { db } from '../../db/prisma'
import { ApiError } from '../../utils/apiError'
import type { MediaType, MediaResult } from '../../types'
import * as tmdb from './providers/tmdb'
import * as jikan from './providers/jikan'
import type { Lang } from './providers/tmdb'

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24h

export async function getDetail(type: MediaType, id: number, lang: Lang = 'pt-BR'): Promise<MediaResult> {
  const cached = await db.mediaCache.findUnique({
    where: { externalId_mediaType: { externalId: id, mediaType: type } },
  })

  // Jikan (anime/manga) não tem dados localizados, cache vale pra qualquer lang
  const cacheIsFresh = cached && Date.now() - cached.cachedAt.getTime() < CACHE_TTL_MS
  if (cacheIsFresh && (type === 'ANIME' || type === 'MANGA')) {
    return cached.data as unknown as MediaResult
  }

  let result: MediaResult

  if (type === 'MOVIE') result = await tmdb.getMovie(id, lang)
  else if (type === 'SERIES') result = await tmdb.getSeries(id, lang)
  else if (type === 'ANIME') result = await jikan.getAnime(id)
  else if (type === 'DORAMA') result = await tmdb.getDorama(id, lang)
  else if (type === 'MANGA') result = await jikan.getManga(id)
  else throw ApiError.badRequest('Tipo de mídia inválido')

  await db.mediaCache.upsert({
    where: { externalId_mediaType: { externalId: id, mediaType: type } },
    create: { externalId: id, mediaType: type, data: result as object },
    update: { data: result as object, cachedAt: new Date() },
  })

  return result
}

export async function getTrending(lang: Lang = 'pt-BR') {
  const [trending, topAnime, doramas, topManga] = await Promise.all([
    tmdb.getTrending(lang),
    jikan.getTopAnime(),
    tmdb.getTrendingDoramas(lang),
    jikan.getTopManga(),
  ])

  return {
    movies: trending.filter(m => m.type === 'MOVIE').slice(0, 8),
    series: trending.filter(m => m.type === 'SERIES').slice(0, 8),
    anime: topAnime.slice(0, 8),
    doramas: doramas.slice(0, 8),
    manga: topManga.slice(0, 8),
  }
}

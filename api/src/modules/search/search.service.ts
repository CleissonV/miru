import type { MediaType, MediaResult } from '../../types'
import * as tmdb from '../media/providers/tmdb'
import * as jikan from '../media/providers/jikan'
import type { Lang } from '../media/providers/tmdb'

export async function search(query: string, type?: MediaType, lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  if (type === 'MOVIE') return tmdb.searchMovies(query, lang)
  if (type === 'SERIES') return tmdb.searchSeries(query, lang)
  if (type === 'ANIME') return jikan.searchAnime(query)
  if (type === 'DORAMA') return tmdb.searchDoramas(query, lang)
  if (type === 'MANGA') return jikan.searchManga(query)

  const [movies, series, anime, doramas, manga] = await Promise.allSettled([
    tmdb.searchMovies(query, lang),
    tmdb.searchSeries(query, lang),
    jikan.searchAnime(query),
    tmdb.searchDoramas(query, lang),
    jikan.searchManga(query),
  ])

  return [
    ...(movies.status === 'fulfilled' ? movies.value : []),
    ...(series.status === 'fulfilled' ? series.value : []),
    ...(anime.status === 'fulfilled' ? anime.value : []),
    ...(doramas.status === 'fulfilled' ? doramas.value : []),
    ...(manga.status === 'fulfilled' ? manga.value : []),
  ]
}

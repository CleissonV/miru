import type { MediaType, MediaResult } from '../../types'
import * as tmdb from '../media/providers/tmdb'
import * as jikan from '../media/providers/jikan'

export async function search(query: string, type?: MediaType): Promise<MediaResult[]> {
  if (type === 'MOVIE') return tmdb.searchMovies(query)
  if (type === 'SERIES') return tmdb.searchSeries(query)
  if (type === 'ANIME') return jikan.searchAnime(query)
  if (type === 'DORAMA') return tmdb.searchDoramas(query)
  if (type === 'MANGA') return jikan.searchManga(query)

  const [movies, series, anime, doramas, manga] = await Promise.allSettled([
    tmdb.searchMovies(query),
    tmdb.searchSeries(query),
    jikan.searchAnime(query),
    tmdb.searchDoramas(query),
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

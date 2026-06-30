import axios from 'axios'
import { env } from '../../../config/env'
import { redis } from '../../../lib/redis'
import type { TmdbMovie, TmdbSeries, MediaResult } from '../../../types'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
const CACHE_TTL = 60 * 60 * 24 // 24h

export type Lang = 'pt-BR' | 'en'

const TMDB_LANG: Record<Lang, string> = { 'pt-BR': 'pt-BR', en: 'en-US' }

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: env.TMDB_API_KEY },
  timeout: 8000,
})

function movieToResult(m: TmdbMovie): MediaResult {
  return {
    id: m.id,
    type: 'MOVIE',
    title: m.title,
    overview: m.overview,
    poster: m.poster_path ? `${POSTER_BASE}${m.poster_path}` : null,
    year: m.release_date ? new Date(m.release_date).getFullYear() : null,
    score: m.vote_average || null,
    episodes: null,
    genres: m.genres?.map(g => g.name) ?? [],
  }
}

function seriesToResult(s: TmdbSeries): MediaResult {
  return {
    id: s.id,
    type: 'SERIES',
    title: s.name,
    overview: s.overview,
    poster: s.poster_path ? `${POSTER_BASE}${s.poster_path}` : null,
    year: s.first_air_date ? new Date(s.first_air_date).getFullYear() : null,
    score: s.vote_average || null,
    episodes: s.number_of_episodes ?? null,
    genres: s.genres?.map(g => g.name) ?? [],
  }
}

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  try {
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit)
  } catch {}

  const data = await fn()

  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(data))
  } catch {}

  return data
}

export async function searchMovies(query: string, lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  return cached(`tmdb:search:movies:${lang}:${query}`, async () => {
    const { data } = await client.get<{ results: TmdbMovie[] }>('/search/movie', {
      params: { query, language: TMDB_LANG[lang] },
    })
    return data.results.slice(0, 10).map(movieToResult)
  })
}

export async function searchSeries(query: string, lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  return cached(`tmdb:search:series:${lang}:${query}`, async () => {
    const { data } = await client.get<{ results: TmdbSeries[] }>('/search/tv', {
      params: { query, language: TMDB_LANG[lang] },
    })
    return data.results.slice(0, 10).map(seriesToResult)
  })
}

export async function getMovie(id: number, lang: Lang = 'pt-BR'): Promise<MediaResult> {
  return cached(`tmdb:movie:${id}:${lang}`, async () => {
    const { data } = await client.get<TmdbMovie>(`/movie/${id}`, {
      params: { language: TMDB_LANG[lang] },
    })
    return movieToResult(data)
  })
}

export async function getSeries(id: number, lang: Lang = 'pt-BR'): Promise<MediaResult> {
  return cached(`tmdb:series:${id}:${lang}`, async () => {
    const { data } = await client.get<TmdbSeries>(`/tv/${id}`, {
      params: { language: TMDB_LANG[lang] },
    })
    return seriesToResult(data)
  })
}

export async function getTrending(lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  return cached(`tmdb:trending:${lang}`, async () => {
    const [moviesRes, seriesRes] = await Promise.all([
      client.get<{ results: TmdbMovie[] }>('/trending/movie/week', { params: { language: TMDB_LANG[lang] } }),
      client.get<{ results: TmdbSeries[] }>('/trending/tv/week', { params: { language: TMDB_LANG[lang] } }),
    ])
    return [
      ...moviesRes.data.results.slice(0, 8).map(movieToResult),
      ...seriesRes.data.results.slice(0, 8).map(seriesToResult),
    ]
  })
}

export async function getTrendingDoramas(lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  return cached(`tmdb:trending:doramas:${lang}`, async () => {
    const { data } = await client.get<{ results: TmdbSeries[] }>('/discover/tv', {
      params: {
        with_origin_country: 'KR',
        sort_by: 'popularity.desc',
        'vote_count.gte': 100,
        language: TMDB_LANG[lang],
      },
    })
    return data.results.slice(0, 8).map(s => ({ ...seriesToResult(s), type: 'DORAMA' as const }))
  })
}

export async function searchDoramas(query: string, lang: Lang = 'pt-BR'): Promise<MediaResult[]> {
  return cached(`tmdb:search:doramas:${lang}:${query}`, async () => {
    const { data } = await client.get<{ results: TmdbSeries[] }>('/search/tv', {
      params: { query, with_origin_country: 'KR', language: TMDB_LANG[lang] },
    })
    return data.results.slice(0, 10).map(s => ({ ...seriesToResult(s), type: 'DORAMA' as const }))
  })
}

export async function getDorama(id: number, lang: Lang = 'pt-BR'): Promise<MediaResult> {
  return cached(`tmdb:dorama:${id}:${lang}`, async () => {
    const { data } = await client.get<TmdbSeries>(`/tv/${id}`, {
      params: { language: TMDB_LANG[lang] },
    })
    return { ...seriesToResult(data), type: 'DORAMA' as const }
  })
}

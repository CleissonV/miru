import axios from 'axios'
import { redis } from '../../../lib/redis'
import type { JikanAnime, MediaResult } from '../../../types'

const CACHE_TTL = 60 * 60 * 24 // 24h

const client = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
})

function toResult(anime: JikanAnime): MediaResult {
  return {
    id: anime.mal_id,
    type: 'ANIME',
    title: anime.title_english ?? anime.title,
    overview: anime.synopsis ?? '',
    poster: anime.images.jpg.large_image_url ?? anime.images.jpg.image_url ?? null,
    year: anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null,
    score: anime.score,
    episodes: anime.episodes,
    genres: anime.genres.map(g => g.name),
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

export async function searchAnime(query: string): Promise<MediaResult[]> {
  return cached(`jikan:search:${query}`, async () => {
    const { data } = await client.get<{ data: JikanAnime[] }>('/anime', {
      params: { q: query, limit: 10, sfw: true },
    })
    return data.data.map(toResult)
  })
}

export async function getAnime(id: number): Promise<MediaResult> {
  return cached(`jikan:anime:${id}`, async () => {
    const { data } = await client.get<{ data: JikanAnime }>(`/anime/${id}`)
    return toResult(data.data)
  })
}

export async function getTopAnime(): Promise<MediaResult[]> {
  return cached('jikan:top', async () => {
    const { data } = await client.get<{ data: JikanAnime[] }>('/top/anime', {
      params: { limit: 12, filter: 'bypopularity' },
    })
    return data.data.map(toResult)
  })
}

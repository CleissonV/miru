import { api } from './client'
import type { MediaResult, TrendingResponse } from '@/types'

export async function getTrending(): Promise<TrendingResponse> {
  const res = await api.get<TrendingResponse>('/media/trending')
  return res.data
}

export async function getMediaDetail(type: string, id: number): Promise<MediaResult> {
  const res = await api.get<MediaResult>(`/media/${type}/${id}`)
  return res.data
}

export async function search(query: string, type?: string): Promise<MediaResult[]> {
  const res = await api.get<MediaResult[]>('/search', { params: { q: query, type } })
  return res.data
}

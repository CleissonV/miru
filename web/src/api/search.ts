import { api } from './client'
import type { MediaResult, MediaType } from '../types'

export async function search(query: string, type?: MediaType): Promise<MediaResult[]> {
  const res = await api.get<MediaResult[]>('/search', {
    params: { q: query, ...(type && { type }) },
  })
  return res.data
}

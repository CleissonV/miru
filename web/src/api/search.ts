import { api } from './client'
import { useAuthStore } from '../stores/authStore'
import type { MediaResult, MediaType } from '../types'

export async function search(query: string, type?: MediaType): Promise<MediaResult[]> {
  const lang = useAuthStore.getState().user?.language ?? 'pt-BR'
  const res = await api.get<MediaResult[]>('/search', {
    params: { q: query, lang, ...(type && { type }) },
  })
  return res.data
}

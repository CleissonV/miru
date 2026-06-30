import { api } from './client'
import { useAuthStore } from '../stores/authStore'
import type { MediaResult, TrendingResponse } from '../types'

function currentLang() {
  return useAuthStore.getState().user?.language ?? 'pt-BR'
}

export async function getTrending(): Promise<TrendingResponse> {
  const res = await api.get<TrendingResponse>('/media/trending', { params: { lang: currentLang() } })
  return res.data
}

export async function getMediaDetail(type: string, id: number): Promise<MediaResult> {
  const res = await api.get<MediaResult>(`/media/${type.toLowerCase()}/${id}`, {
    params: { lang: currentLang() },
  })
  return res.data
}

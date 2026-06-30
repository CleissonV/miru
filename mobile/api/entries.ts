import { api } from './client'
import type { Entry, PaginatedEntries, MediaType, WatchStatus, EntryStats } from '@/types'

export async function listEntries(params?: {
  status?: WatchStatus
  mediaType?: MediaType
  page?: number
  limit?: number
}): Promise<PaginatedEntries> {
  const res = await api.get<PaginatedEntries>('/entries', { params })
  return res.data
}

export async function createEntry(data: {
  mediaType: MediaType
  externalId: number
  status: WatchStatus
  rating?: number
}): Promise<Entry> {
  const res = await api.post<Entry>('/entries', data)
  return res.data
}

export async function updateEntry(
  id: string,
  data: Partial<Pick<Entry, 'status' | 'rating' | 'episodesWatched' | 'notes'>>,
): Promise<Entry> {
  const res = await api.patch<Entry>(`/entries/${id}`, data)
  return res.data
}

export async function deleteEntry(id: string): Promise<void> {
  await api.delete(`/entries/${id}`)
}

export async function getStats(): Promise<EntryStats> {
  const res = await api.get<EntryStats>('/entries/stats')
  return res.data
}

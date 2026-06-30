export type MediaType = 'MOVIE' | 'SERIES' | 'ANIME' | 'DORAMA' | 'MANGA'

export type WatchStatus =
  | 'PLAN_TO_WATCH'
  | 'WATCHING'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'DROPPED'

export type Language = 'pt-BR' | 'en'

export interface User {
  id: string
  email: string
  username: string
  displayName: string | null
  avatar: string | null
  bio: string | null
  isPublic: boolean
  language: Language
  emailVerified: boolean
  createdAt: string
}

export interface MediaResult {
  id: number
  type: MediaType
  title: string
  overview: string
  poster: string | null
  year: number | null
  score: number | null
  episodes: number | null
  genres: string[]
}

export interface Entry {
  id: string
  userId: string
  mediaType: MediaType
  externalId: number
  status: WatchStatus
  rating: number | null
  episodesWatched: number | null
  notes: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedEntries {
  entries: Entry[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TrendingResponse {
  movies: MediaResult[]
  series: MediaResult[]
  anime: MediaResult[]
  doramas: MediaResult[]
  manga: MediaResult[]
}

export interface EntryStats {
  total: number
  byType: Record<MediaType, { total: number; completed: number; avgRating: number | null }>
  statusBreakdown: Record<WatchStatus, number>
}

export const STATUS_LABEL: Record<WatchStatus, string> = {
  PLAN_TO_WATCH: 'Quero Assistir',
  WATCHING: 'Assistindo',
  COMPLETED: 'Concluído',
  ON_HOLD: 'Em Pausa',
  DROPPED: 'Abandonado',
}

export const MEDIA_LABEL: Record<MediaType, string> = {
  MOVIE: 'Filme',
  SERIES: 'Série',
  ANIME: 'Anime',
  DORAMA: 'Dorama',
  MANGA: 'Manga',
}

export const STATUS_COLOR: Record<WatchStatus, string> = {
  PLAN_TO_WATCH: 'text-zinc-400',
  WATCHING: 'text-blue-400',
  COMPLETED: 'text-green-400',
  ON_HOLD: 'text-yellow-400',
  DROPPED: 'text-red-400',
}

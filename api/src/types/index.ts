export type MediaType = 'MOVIE' | 'SERIES' | 'ANIME' | 'DORAMA'
export type WatchStatus = 'PLAN_TO_WATCH' | 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED'

export interface AuthPayload {
  sub: string
  username: string
}

export interface TmdbMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids?: number[]
  genres?: Array<{ id: number; name: string }>
}

export interface TmdbSeries {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
  number_of_episodes?: number
  genre_ids?: number[]
  genres?: Array<{ id: number; name: string }>
}

export interface JikanAnime {
  mal_id: number
  title: string
  title_english: string | null
  synopsis: string | null
  images: {
    jpg: { image_url: string; large_image_url: string }
  }
  aired: { from: string | null }
  score: number | null
  episodes: number | null
  genres: Array<{ mal_id: number; name: string }>
  status: string
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

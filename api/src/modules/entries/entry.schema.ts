import { z } from 'zod'

const statusEnum = z.enum(['PLAN_TO_WATCH', 'WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED'])
const mediaTypeEnum = z.enum(['MOVIE', 'SERIES', 'ANIME'])

export const createEntrySchema = z.object({
  mediaType: mediaTypeEnum,
  externalId: z.number().int().positive(),
  status: statusEnum,
  rating: z.number().min(0).max(10).optional(),
  episodesWatched: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
})

export const updateEntrySchema = createEntrySchema
  .omit({ mediaType: true, externalId: true })
  .partial()

export const listEntriesSchema = z.object({
  status: statusEnum.optional(),
  mediaType: mediaTypeEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateEntryBody = z.infer<typeof createEntrySchema>
export type UpdateEntryBody = z.infer<typeof updateEntrySchema>
export type ListEntriesQuery = z.infer<typeof listEntriesSchema>

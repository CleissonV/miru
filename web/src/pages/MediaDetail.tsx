import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Plus, Check, ChevronDown, Tv } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMediaDetail } from '@/api/media'
import { createEntry, updateEntry, deleteEntry, listEntries } from '@/api/entries'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { formatScore, cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useT, useMediaLabel, useStatusLabel } from '@/i18n/translations'
import { type WatchStatus } from '@/types'

const STATUS_OPTIONS: WatchStatus[] = [
  'PLAN_TO_WATCH',
  'WATCHING',
  'COMPLETED',
  'ON_HOLD',
  'DROPPED',
]

export default function MediaDetail() {
  const { type = '', id = '' } = useParams()
  const { isAuthenticated } = useAuth()
  const language = useAuthStore(s => s.user?.language)
  const qc = useQueryClient()
  const t = useT()
  const MEDIA_LABEL = useMediaLabel()
  const STATUS_LABEL = useStatusLabel()

  const [statusOpen, setStatusOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)

  const mediaId = parseInt(id, 10)

  const { data: media, isLoading } = useQuery({
    queryKey: ['media', type, mediaId, language],
    queryFn: () => getMediaDetail(type, mediaId),
    enabled: !!type && !!mediaId,
  })

  const { data: entriesData } = useQuery({
    queryKey: ['entries'],
    queryFn: () => listEntries({ limit: 100 }),
    enabled: isAuthenticated,
  })

  const currentEntry = entriesData?.entries.find(
    e => e.mediaType === type.toUpperCase() && e.externalId === mediaId,
  )

  const addEntry = useMutation({
    mutationFn: (status: WatchStatus) =>
      createEntry({
        mediaType: type.toUpperCase() as any,
        externalId: mediaId,
        status,
        rating: rating || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      setStatusOpen(false)
    },
  })

  const changeStatus = useMutation({
    mutationFn: (status: WatchStatus) => updateEntry(currentEntry!.id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries'] }),
  })

  const removeEntry = useMutation({
    mutationFn: () => deleteEntry(currentEntry!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries'] }),
  })

  if (isLoading) return <DetailSkeleton />
  if (!media) return null

  return (
    <main className="px-8 py-10">
      {/* Hero banner blur */}
      {media.poster && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-20"
          style={{
            backgroundImage: `url(${media.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'blur(40px)',
          }}
        />
      )}

      <div className="relative flex flex-col gap-10 sm:flex-row sm:gap-12">
        {/* Poster */}
        <div className="mx-auto w-48 shrink-0 sm:mx-0 sm:w-52">
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/60">
            {media.poster ? (
              <img
                src={media.poster}
                alt={media.title}
                className="w-full poster-aspect object-cover"
              />
            ) : (
              <div className="poster-aspect flex items-center justify-center bg-surface-2">
                <Tv size={40} className="text-text-subtle" />
              </div>
            )}
          </div>

          {/* Rating stars under poster */}
          {isAuthenticated && !currentEntry && (
            <div className="mt-3">
              <p className="mb-1.5 text-center text-xs text-text-muted">{t('detail_your_rating')}</p>
              <div className="flex justify-center gap-1">
                {[2, 4, 6, 8, 10].map(v => (
                  <button
                    key={v}
                    onClick={() => setRating(prev => (prev === v ? 0 : v))}
                    className={`text-xl transition-colors ${
                      rating >= v ? 'text-yellow-400' : 'text-text-subtle hover:text-yellow-400/60'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-1 text-center text-xs font-semibold text-yellow-400">{rating}/10</p>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{MEDIA_LABEL[media.type]}</Badge>
            {media.year && (
              <span className="text-sm text-text-muted">{media.year}</span>
            )}
            {media.episodes && (
              <span className="text-sm text-text-muted">{media.episodes} {t('detail_episodes')}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight text-text sm:text-4xl">
            {media.title}
          </h1>

          {media.score && (
            <div className="mt-3 flex items-center gap-1.5">
              <Star size={16} className="text-yellow-400" fill="currentColor" />
              <span className="text-lg font-bold text-yellow-400">{formatScore(media.score)}</span>
              <span className="text-sm text-text-muted">/ 10</span>
            </div>
          )}

          {media.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {media.genres.map(g => <Badge key={g}>{g}</Badge>)}
            </div>
          )}

          {media.overview && (
            <>
              {(media.type === 'ANIME' || media.type === 'MANGA') && (
                <p className="mt-5 text-xs text-text-subtle">
                  {t('detail_lang_note')}
                </p>
              )}
              <p className={cn('max-w-2xl leading-relaxed text-text-muted', media.type === 'ANIME' || media.type === 'MANGA' ? 'mt-1.5' : 'mt-5')}>
                {media.overview}
              </p>
            </>
          )}

          {/* Actions */}
          {isAuthenticated && (
            <div className="mt-8">
              {currentEntry ? (
                <div className="relative inline-block">
                  <button
                    onClick={() => setStatusOpen(v => !v)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-purple-pink px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
                  >
                    <Check size={15} />
                    {STATUS_LABEL[currentEntry.status]}
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {statusOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              changeStatus.mutate(s)
                              setStatusOpen(false)
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-text transition-colors hover:bg-surface-2"
                          >
                            {s === currentEntry.status ? (
                              <Check size={13} className="text-brand-purple shrink-0" />
                            ) : (
                              <span className="w-[13px] shrink-0" />
                            )}
                            {STATUS_LABEL[s]}
                          </button>
                        ))}
                        <div className="border-t border-border">
                          <button
                            onClick={() => removeEntry.mutate()}
                            className="w-full px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            {t('detail_remove_from_list')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative inline-block">
                  <button
                    onClick={() => setStatusOpen(v => !v)}
                    className="flex items-center gap-2 rounded-xl border border-brand-purple/40 bg-brand-purple/10 px-5 py-2.5 text-sm font-semibold text-brand-purple transition-all hover:bg-gradient-purple-pink hover:text-white hover:shadow-glow hover:border-transparent"
                  >
                    <Plus size={16} />
                    {t('detail_add_to_list')}
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {statusOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => addEntry.mutate(s)}
                            className="w-full px-4 py-3 text-left text-sm text-text transition-colors hover:bg-surface-2"
                          >
                            {STATUS_LABEL[s]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function DetailSkeleton() {
  return (
    <main className="px-8 py-10">
      <div className="flex flex-col gap-10 sm:flex-row sm:gap-12">
        <Skeleton className="mx-auto h-72 w-48 rounded-2xl sm:mx-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex gap-2 pt-1">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-6 w-16 rounded-full" />)}
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </main>
  )
}

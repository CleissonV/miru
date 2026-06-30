import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Trash2, Tv, Eye, CheckCircle2, Clock, PauseCircle, XCircle, LayoutGrid, Film, Monitor, Sword, BookOpen } from 'lucide-react'
import { listEntries, deleteEntry, updateEntry } from '@/api/entries'
import { getMediaDetail } from '@/api/media'
import { Badge } from '@/components/ui/Badge'
import { PosterSkeleton } from '@/components/ui/Skeleton'
import { STATUS_COLOR, type WatchStatus, type MediaType, type Entry } from '@/types'
import { useT, useStatusLabel, useMediaLabel } from '@/i18n/translations'
import { cn } from '@/lib/utils'

export default function List() {
  const [status, setStatus] = useState<WatchStatus | undefined>()
  const [mediaType, setMediaType] = useState<MediaType | undefined>()
  const qc = useQueryClient()
  const t = useT()
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  const STATUS_FILTERS: { label: string; value: WatchStatus | undefined; icon: React.ReactNode; color: string }[] = [
    { label: t('status_all'), value: undefined, icon: <LayoutGrid size={13} />, color: 'text-text-muted' },
    { label: STATUS_LABEL.WATCHING, value: 'WATCHING', icon: <Eye size={13} />, color: 'text-brand-purple' },
    { label: STATUS_LABEL.COMPLETED, value: 'COMPLETED', icon: <CheckCircle2 size={13} />, color: 'text-green-400' },
    { label: STATUS_LABEL.PLAN_TO_WATCH, value: 'PLAN_TO_WATCH', icon: <Clock size={13} />, color: 'text-brand-blue' },
    { label: STATUS_LABEL.ON_HOLD, value: 'ON_HOLD', icon: <PauseCircle size={13} />, color: 'text-yellow-400' },
    { label: STATUS_LABEL.DROPPED, value: 'DROPPED', icon: <XCircle size={13} />, color: 'text-red-400' },
  ]

  const TYPE_FILTERS: { label: string; value: MediaType | undefined; icon: React.ReactNode }[] = [
    { label: t('filter_all'), value: undefined, icon: <LayoutGrid size={13} /> },
    { label: t('filter_movies'), value: 'MOVIE', icon: <Film size={13} /> },
    { label: t('filter_series'), value: 'SERIES', icon: <Monitor size={13} /> },
    { label: t('filter_anime'), value: 'ANIME', icon: <Sword size={13} /> },
    { label: t('filter_dorama'), value: 'DORAMA', icon: <span className="text-[11px] leading-none">🌸</span> },
    { label: t('filter_manga'), value: 'MANGA', icon: <BookOpen size={13} /> },
  ]

  const { data, isLoading } = useQuery({
    queryKey: ['entries', status, mediaType],
    queryFn: () => listEntries({ status, mediaType, limit: 100 }),
  })

  const remove = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries'] }),
  })

  const changeRating = useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => updateEntry(id, { rating }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries'] }),
  })

  return (
    <main className="px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">{t('list_title')}</h1>
        {data && (
          <span className="text-sm text-text-muted">
            {data.pagination.total} {data.pagination.total === 1 ? t('list_count_one') : t('list_count_many')}
          </span>
        )}
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-surface p-4 space-y-4">
        {/* Status */}
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            {t('list_status_label')}
          </p>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ label, value, icon, color }) => {
              const active = status === value
              return (
                <button
                  key={label}
                  onClick={() => setStatus(value as WatchStatus | undefined)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                    active
                      ? 'bg-gradient-purple-pink text-white shadow-glow'
                      : cn('border border-border bg-surface-2 hover:bg-surface-3 hover:border-brand-purple/30', color),
                  )}
                >
                  {icon}
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Tipo */}
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            {t('list_type_label')}
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(({ label, value, icon }) => {
              const active = mediaType === value
              return (
                <button
                  key={label}
                  onClick={() => setMediaType(value as MediaType | undefined)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                    active
                      ? 'bg-gradient-pink-blue text-white shadow-glow-pink'
                      : 'border border-border bg-surface-2 text-text-muted hover:bg-surface-3 hover:border-brand-blue/30 hover:text-text',
                  )}
                >
                  {icon}
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => <PosterSkeleton key={i} />)}
        </div>
      ) : !data?.entries.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data.entries.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onRemove={() => remove.mutate(entry.id)}
              onRate={(rating) => changeRating.mutate({ id: entry.id, rating })}
            />
          ))}
        </div>
      )}
    </main>
  )
}


function EntryCard({
  entry,
  onRemove,
  onRate,
}: {
  entry: Entry
  onRemove: () => void
  onRate: (rating: number) => void
}) {
  const { data: media } = useQuery({
    queryKey: ['media', entry.mediaType.toLowerCase(), entry.externalId],
    queryFn: () => getMediaDetail(entry.mediaType.toLowerCase(), entry.externalId),
    staleTime: 1000 * 60 * 60,
  })
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  return (
    <div className="group relative">
      <Link
        to={`/media/${entry.mediaType.toLowerCase()}/${entry.externalId}`}
        className="block overflow-hidden rounded-xl border border-border bg-surface-2 poster-aspect"
      >
        {media?.poster ? (
          <img
            src={media.poster}
            alt={media.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <Tv size={32} />
          </div>
        )}
      </Link>

      {media?.title && (
        <p className="mt-1.5 text-xs font-medium text-text line-clamp-2 leading-tight">
          {media.title}
        </p>
      )}

      <span className={cn('mt-0.5 block text-xs font-medium', STATUS_COLOR[entry.status])}>
        {STATUS_LABEL[entry.status]}
      </span>

      <div className="mt-0.5 flex items-center justify-between">
        <Badge>{MEDIA_LABEL[entry.mediaType]}</Badge>
        <button
          onClick={onRemove}
          className="opacity-0 transition-opacity group-hover:opacity-100 text-text-subtle hover:text-red-400"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-1 flex gap-0.5">
        {[2, 4, 6, 8, 10].map(v => (
          <button
            key={v}
            onClick={() => onRate(v)}
            className={cn(
              'text-sm transition-colors',
              (entry.rating ?? 0) >= v ? 'text-yellow-400' : 'text-text-subtle hover:text-yellow-400/50',
            )}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  const t = useT()
  return (
    <div className="py-24 text-center">
      <span className="text-5xl">見</span>
      <p className="mt-4 text-text-muted">{t('list_empty')}</p>
      <Link
        to="/search"
        className="mt-4 inline-block rounded-xl bg-gradient-purple-pink px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
      >
        {t('list_search_cta')}
      </Link>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MediaResult } from '@/types'
import { MEDIA_LABEL, STATUS_LABEL, type WatchStatus } from '@/types'
import { formatScore, cn } from '@/lib/utils'

interface Props {
  media: MediaResult
  index?: number
  entryStatus?: WatchStatus
}

export default function MediaCard({ media, index = 0, entryStatus }: Props) {
  const href = `/media/${media.type.toLowerCase()}/${media.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link to={href} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2 poster-aspect">
          {media.poster ? (
            <img
              src={media.poster}
              alt={media.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-text-subtle">
              見
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {MEDIA_LABEL[media.type]}
          </span>

          {media.score && (
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-yellow-400 backdrop-blur-sm">
              <Star size={9} fill="currentColor" />
              {formatScore(media.score)}
            </span>
          )}

          {entryStatus && (
            <span className="absolute bottom-2 left-2 rounded-full bg-brand-purple/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {STATUS_LABEL[entryStatus]}
            </span>
          )}
        </div>

        <div className="mt-2 px-0.5">
          <p
            className={cn(
              'text-sm font-medium leading-tight text-text transition-colors line-clamp-2',
              'group-hover:text-brand-purple',
            )}
          >
            {media.title}
          </p>
          {media.year && <p className="mt-0.5 text-xs text-text-muted">{media.year}</p>}
        </div>
      </Link>
    </motion.div>
  )
}

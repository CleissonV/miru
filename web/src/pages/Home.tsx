import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ChevronRight, Star, Play } from 'lucide-react'
import { getTrending } from '@/api/media'
import { useAuthStore } from '@/stores/authStore'
import { formatScore } from '@/lib/utils'
import { MEDIA_LABEL, type MediaResult } from '@/types'

const SECTION_COLORS = {
  movie: 'from-brand-purple to-brand-pink',
  series: 'from-brand-pink to-brand-blue',
  anime: 'from-brand-blue to-brand-purple',
  dorama: 'from-pink-400 to-rose-500',
}

export default function Home() {
  const { isAuthenticated, user } = useAuthStore()

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    staleTime: 1000 * 60 * 10,
  })

  const hero = trending?.movies[0] ?? trending?.series[0] ?? trending?.anime[0]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden">
        {/* Banner image — posters on the right, text space on the left */}
        <img
          src="/hero-banner.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        {/* Gradient: full coverage left + fade right so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/40" />

        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-10">
          {isAuthenticated && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 text-sm font-medium text-text-muted"
            >
              Olá,{' '}
              <span className="font-semibold text-brand-purple">
                {user?.displayName ?? user?.username}
              </span>{' '}
              👋
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl"
          >
            Tudo que você assiste,{' '}
            <span className="text-brand-pink drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]">em um só lugar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 max-w-xl text-base text-text-muted"
          >
            Filmes, séries, animes e doramas. Acompanhe, avalie e descubra novos títulos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 flex gap-3"
          >
            {!isAuthenticated && (
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-purple-pink px-6 py-3 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
              >
                <Play size={15} fill="white" />
                Começar agora
              </Link>
            )}
            <Link
              to="/search"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-text backdrop-blur-sm transition-colors hover:bg-surface-2"
            >
              Explorar títulos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {hero && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-8 py-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-purple" />
            <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Em destaque
            </span>
          </div>
          <Link to={`/media/${hero.type.toLowerCase()}/${hero.id}`}>
            <div className="group relative h-44 overflow-hidden rounded-2xl border border-border bg-surface card-hover">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
              {hero.poster && (
                <img
                  src={hero.poster}
                  alt={hero.title}
                  className="absolute right-0 top-0 h-full w-2/5 object-cover opacity-60 transition-opacity group-hover:opacity-80"
                  style={{
                    maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                  }}
                />
              )}
              <div className="relative z-20 flex h-full flex-col justify-center px-8">
                <span className="mb-2 inline-block w-fit rounded-full bg-gradient-purple-pink px-3 py-0.5 text-xs font-semibold text-white">
                  {MEDIA_LABEL[hero.type]}
                </span>
                <h2 className="text-2xl font-bold text-text">{hero.title}</h2>
                {hero.score && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <Star size={13} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-semibold text-yellow-400">
                      {formatScore(hero.score)}
                    </span>
                  </div>
                )}
                {hero.overview && (
                  <p className="mt-2 max-w-md text-sm text-text-muted line-clamp-2">
                    {hero.overview}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Trending sections */}
      {[
        {
          key: 'movies',
          label: 'Filmes em Alta',
          items: trending?.movies.slice(hero?.type === 'MOVIE' ? 1 : 0),
          gradient: SECTION_COLORS.movie,
        },
        {
          key: 'series',
          label: 'Séries em Alta',
          items: trending?.series,
          gradient: SECTION_COLORS.series,
        },
        {
          key: 'anime',
          label: 'Animes Populares',
          items: trending?.anime,
          gradient: SECTION_COLORS.anime,
        },
        {
          key: 'dorama',
          label: 'Doramas em Alta',
          items: trending?.doramas,
          gradient: SECTION_COLORS.dorama,
        },
      ].map(({ key, label, items, gradient }) => (
        <TrendingRow key={key} label={label} items={items} gradient={gradient} />
      ))}

      <div className="h-8" />
    </div>
  )
}

function TrendingRow({
  label,
  items,
  gradient,
}: {
  label: string
  items?: MediaResult[]
  gradient: string
}) {
  return (
    <section className="px-8 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-1 rounded-full bg-gradient-to-b ${gradient}`} />
          <h2 className="text-base font-semibold text-text">{label}</h2>
        </div>
        <Link
          to="/search"
          className="flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-brand-purple"
        >
          Ver mais <ChevronRight size={13} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {items && items.length > 0
          ? items.slice(0, 10).map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} gradient={gradient} />
            ))
          : Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-32 shrink-0">
                <div className="poster-aspect w-32 rounded-xl skeleton" />
                <div className="mt-2 h-3 w-20 rounded skeleton" />
              </div>
            ))}
      </div>
    </section>
  )
}

function MediaCard({
  item,
  index,
  gradient,
}: {
  item: MediaResult
  index: number
  gradient: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="w-32 shrink-0"
    >
      <Link to={`/media/${item.type.toLowerCase()}/${item.id}`} className="group block">
        <div className="poster-aspect w-32 relative overflow-hidden rounded-xl border border-border bg-surface-2">
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-text-muted">
              見
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-end p-2">
            {item.score && (
              <div className="flex items-center gap-0.5">
                <Star size={10} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs font-semibold text-white">{formatScore(item.score)}</span>
              </div>
            )}
          </div>

          {/* Type indicator */}
          <div className={`absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
        </div>

        <p className="mt-1.5 text-xs font-medium text-text line-clamp-2 leading-tight">
          {item.title}
        </p>
        {item.year && <p className="text-[10px] text-text-muted">{item.year}</p>}
      </Link>
    </motion.div>
  )
}

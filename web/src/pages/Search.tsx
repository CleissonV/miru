import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { search } from '@/api/search'
import MediaCard from '@/components/MediaCard'
import { PosterSkeleton } from '@/components/ui/Skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import type { MediaType } from '@/types'
import { cn } from '@/lib/utils'

const TYPES: { label: string; value: MediaType | undefined }[] = [
  { label: 'Tudo', value: undefined },
  { label: 'Filmes', value: 'MOVIE' },
  { label: 'Séries', value: 'SERIES' },
  { label: 'Animes', value: 'ANIME' },
  { label: 'Doramas', value: 'DORAMA' },
  { label: 'Mangás', value: 'MANGA' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeType, setActiveType] = useState<MediaType | undefined>(
    (searchParams.get('type') as MediaType) ?? undefined,
  )

  const debounced = useDebounce(query)

  useEffect(() => {
    const params: Record<string, string> = {}
    if (debounced) params.q = debounced
    if (activeType) params.type = activeType
    setSearchParams(params, { replace: true })
  }, [debounced, activeType, setSearchParams])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debounced, activeType],
    queryFn: () => search(debounced, activeType),
    enabled: debounced.length > 1,
  })

  const loading = isLoading || isFetching

  return (
    <main className="px-8 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Buscar</h1>

      <div className="relative mb-5">
        <SearchIcon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar filme, série ou anime..."
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-11 pr-4 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
          autoFocus
        />
      </div>

      <div className="mb-8 flex gap-2">
        {TYPES.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setActiveType(value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              activeType === value
                ? 'bg-gradient-purple-pink text-white shadow-glow'
                : 'border border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!debounced || debounced.length < 2 ? (
        <div className="py-24 text-center">
          <SearchIcon size={48} className="mx-auto mb-4 text-text-subtle opacity-40" />
          <p className="text-text-muted">Digite pelo menos 2 caracteres para buscar</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => <PosterSkeleton key={i} />)}
        </div>
      ) : !data?.length ? (
        <div className="py-24 text-center">
          <p className="text-text-muted">
            Nenhum resultado para{' '}
            <strong className="text-text">"{debounced}"</strong>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data.map((item, i) => (
            <MediaCard key={`${item.type}-${item.id}`} media={item} index={i} />
          ))}
        </div>
      )}
    </main>
  )
}

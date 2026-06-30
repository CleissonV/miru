import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function Skeleton({ className }: Props) {
  return <div className={cn('skeleton rounded-md', className)} />
}

export function PosterSkeleton() {
  return <Skeleton className="poster-aspect w-full rounded-lg" />
}

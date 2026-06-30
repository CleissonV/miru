import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'green' | 'yellow' | 'red'
  className?: string
}

const variantClasses = {
  default: 'bg-surface-2 text-text-muted border border-border',
  accent: 'bg-brand-purple/15 text-brand-purple border border-brand-purple/30',
  green: 'bg-green-500/15 text-green-400 border border-green-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/20',
}

export function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

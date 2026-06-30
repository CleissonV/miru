import { useQuery } from '@tanstack/react-query'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { getStats } from '@/api/entries'
import { Skeleton } from '@/components/ui/Skeleton'
import { useT, useStatusLabel, useMediaLabel } from '@/i18n/translations'

const TYPE_COLORS = { MOVIE: '#818cf8', SERIES: '#f472b6', ANIME: '#60a5fa', DORAMA: '#fb7185', MANGA: '#fbbf24' }
const STATUS_COLORS: Record<string, string> = {
  PLAN_TO_WATCH: '#3d3d5c',
  WATCHING: '#818cf8',
  COMPLETED: '#34d399',
  ON_HOLD: '#fbbf24',
  DROPPED: '#f87171',
}

const TOOLTIP_STYLE = {
  background: '#12121f',
  border: '1px solid #1e1e3a',
  borderRadius: 12,
  color: '#e2e2ff',
}

export default function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })
  const t = useT()
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  if (isLoading) return <StatsSkeleton />
  if (!data) return null

  const typeData = Object.entries(data.byType).map(([type, v]) => ({
    name: MEDIA_LABEL[type as keyof typeof MEDIA_LABEL],
    value: v.total,
    color: TYPE_COLORS[type as keyof typeof TYPE_COLORS],
  }))

  const statusData = Object.entries(data.statusBreakdown)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      name: STATUS_LABEL[status as keyof typeof STATUS_LABEL],
      count,
      fill: STATUS_COLORS[status],
    }))

  return (
    <main className="px-8 py-8">
      <h1 className="mb-8 text-2xl font-bold text-text">{t('stats_title')}</h1>

      {/* Summary cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label={t('stats_total')} value={data.total} gradient="from-brand-purple to-brand-pink" />
        {Object.entries(data.byType).map(([type, v]) => (
          <StatCard
            key={type}
            label={MEDIA_LABEL[type as keyof typeof MEDIA_LABEL]}
            value={v.total}
            sub={v.avgRating ? `★ ${v.avgRating.toFixed(1)}` : undefined}
            color={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}
          />
        ))}
      </div>

      {data.total === 0 ? (
        <div className="py-24 text-center text-text-muted">
          <p className="text-lg">{t('stats_empty')}</p>
          <p className="mt-1 text-sm">{t('stats_empty_sub')}</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title={t('stats_by_type')}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, n: string) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-5">
              {typeData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title={t('stats_by_status')}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData} barSize={26}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b6b8a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b6b8a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(129,140,248,0.05)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map(entry => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </main>
  )
}

function StatCard({
  label,
  value,
  sub,
  color,
  gradient,
}: {
  label: string
  value: number
  sub?: string
  color?: string
  gradient?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p
        className={`mt-2 text-4xl font-bold ${gradient ? `gradient-text` : ''}`}
        style={color && !gradient ? { color } : undefined}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-muted">{title}</h2>
      {children}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <main className="px-8 py-8">
      <Skeleton className="mb-8 h-8 w-48 rounded-xl" />
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </main>
  )
}

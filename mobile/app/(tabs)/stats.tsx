import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/api/entries'
import { type MediaType, type WatchStatus } from '@/types'
import { useT, useStatusLabel, useMediaLabel } from '@/i18n/translations'
import { COLORS } from '@/lib/constants'

const MEDIA_COLORS: Record<string, string> = {
  MOVIE: COLORS.accent,
  SERIES: COLORS.pink,
  ANIME: COLORS.blue,
  DORAMA: '#fb7185',
  MANGA: '#fbbf24',
}

const STATUS_COLORS: Record<WatchStatus, string> = {
  WATCHING: COLORS.accent,
  COMPLETED: COLORS.green,
  PLAN_TO_WATCH: COLORS.blue,
  ON_HOLD: COLORS.yellow,
  DROPPED: COLORS.red,
}

export default function StatsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })
  const t = useT()
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  if (isLoading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    )
  }

  if (!data) return null

  const total = data.total

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.heroCard}>
        <Text style={s.heroNum}>{total}</Text>
        <Text style={s.heroLabel}>{t('stats_total_titles')}</Text>
      </View>

      <Text style={s.sectionTitle}>{t('stats_by_type')}</Text>
      {(Object.entries(data.byType) as [MediaType, any][]).map(([type, stat]) => (
        <View key={type} style={s.statRow}>
          <View style={[s.dot, { backgroundColor: MEDIA_COLORS[type] ?? COLORS.muted }]} />
          <Text style={s.statLabel}>{MEDIA_LABEL[type]}</Text>
          <View style={s.statRight}>
            <Text style={s.statValue}>{stat.total}</Text>
            {stat.avgRating != null && (
              <Text style={s.statSub}>★ {stat.avgRating.toFixed(1)}</Text>
            )}
            <Text style={s.statSub}>{stat.completed} {t('stats_completed_suffix')}</Text>
          </View>
        </View>
      ))}

      <Text style={[s.sectionTitle, { marginTop: 20 }]}>{t('stats_by_status')}</Text>
      {(Object.entries(data.statusBreakdown) as [WatchStatus, number][])
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([status, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <View key={status} style={s.barRow}>
              <View style={s.barHeader}>
                <Text style={[s.barLabel, { color: STATUS_COLORS[status] }]}>
                  {STATUS_LABEL[status]}
                </Text>
                <Text style={s.barCount}>{count}</Text>
              </View>
              <View style={s.barTrack}>
                <View style={[s.barFill, { width: `${pct}%`, backgroundColor: STATUS_COLORS[status] }]} />
              </View>
            </View>
          )
        })}

      <View style={{ height: 32 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  loader: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroNum: { fontSize: 52, fontWeight: '800', color: COLORS.accent },
  heroLabel: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statLabel: { flex: 1, color: COLORS.text, fontSize: 14, fontWeight: '600' },
  statRight: { alignItems: 'flex-end', gap: 2 },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  statSub: { color: COLORS.muted, fontSize: 11 },
  barRow: { marginBottom: 14 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 13, fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: COLORS.surface2, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barCount: { fontSize: 12, color: COLORS.muted },
})

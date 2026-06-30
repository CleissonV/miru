import { ScrollView, View, Text, Image, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { getTrending } from '@/api/media'
import { useAuthStore } from '@/stores/authStore'
import { useT } from '@/i18n/translations'
import type { MediaResult } from '@/types'
import { COLORS } from '@/lib/constants'

export default function HomeScreen() {
  const user = useAuthStore(s => s.user)
  const t = useT()
  const { data, isLoading } = useQuery({
    queryKey: ['trending', user?.language],
    queryFn: getTrending,
    staleTime: 1000 * 60 * 10,
  })

  const SECTIONS = [
    { key: 'movies' as const, label: t('home_section_movies'), accent: COLORS.accent },
    { key: 'series' as const, label: t('home_section_series'), accent: COLORS.pink },
    { key: 'anime' as const, label: t('home_section_anime'), accent: COLORS.blue },
    { key: 'doramas' as const, label: t('home_section_dorama'), accent: '#fb7185' },
    { key: 'manga' as const, label: t('home_section_manga'), accent: '#fbbf24' },
  ]

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.greeting}>
          {user ? `${t('home_greeting')}, ${user.displayName ?? user.username} 👋` : `${t('home_greeting')} 👋`}
        </Text>
        <Text style={s.title}>Miru</Text>
        <Text style={s.subtitle}>{t('home_subtitle')}</Text>
      </View>

      {isLoading && (
        <View style={s.loader}>
          <ActivityIndicator color={COLORS.accent} />
        </View>
      )}

      {SECTIONS.map(({ key, label, accent }) => (
        <TrendingRow
          key={key}
          label={label}
          accent={accent}
          items={(data as any)?.[key] ?? []}
          loading={isLoading}
        />
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  )
}

function TrendingRow({
  label, accent, items, loading,
}: {
  label: string
  accent: string
  items: MediaResult[]
  loading: boolean
}) {
  const router = useRouter()

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionBar, { backgroundColor: accent }]} />
        <Text style={s.sectionLabel}>{label}</Text>
      </View>
      <FlatList
        data={loading ? Array(6).fill(null) : items}
        keyExtractor={(item, i) => item ? `${item.type}-${item.id}` : `skeleton-${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        renderItem={({ item }) =>
          item ? (
            <Pressable
              style={s.card}
              onPress={() => router.push(`/media/${item.type.toLowerCase()}/${item.id}`)}
            >
              {item.poster
                ? <Image source={{ uri: item.poster }} style={s.poster} />
                : <View style={[s.poster, s.posterPlaceholder]}><Text style={s.posterEmoji}>見</Text></View>}
              <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
              {item.year ? <Text style={s.cardYear}>{item.year}</Text> : null}
            </Pressable>
          ) : (
            <View style={s.card}>
              <View style={[s.poster, s.skeleton]} />
              <View style={[s.skeletonText, { width: 80 }]} />
            </View>
          )
        }
      />
    </View>
  )
}

const POSTER_W = 104
const POSTER_H = 156

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  greeting: { fontSize: 13, color: COLORS.muted, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  loader: { paddingVertical: 40, alignItems: 'center' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  sectionBar: { width: 3, height: 16, borderRadius: 2 },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  card: { width: POSTER_W },
  poster: { width: POSTER_W, height: POSTER_H, borderRadius: 10, backgroundColor: COLORS.surface, marginBottom: 6 },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  posterEmoji: { fontSize: 28, color: COLORS.muted },
  cardTitle: { fontSize: 11, color: COLORS.text, fontWeight: '500', lineHeight: 14 },
  cardYear: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  skeleton: { opacity: 0.3 },
  skeletonText: { height: 10, borderRadius: 4, backgroundColor: COLORS.surface2, marginTop: 4, opacity: 0.4 },
})

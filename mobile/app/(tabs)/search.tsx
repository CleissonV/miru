import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList, Image, Pressable,
  ActivityIndicator, StyleSheet, ScrollView,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { search } from '@/api/media'
import { useAuthStore } from '@/stores/authStore'
import { useT, useMediaLabel } from '@/i18n/translations'
import type { MediaType, MediaResult } from '@/types'
import { COLORS } from '@/lib/constants'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [activeType, setActiveType] = useState<MediaType | undefined>()
  const router = useRouter()
  const language = useAuthStore(s => s.user?.language)
  const t = useT()

  const TYPE_FILTERS: { label: string; value: MediaType | undefined }[] = [
    { label: t('filter_all'), value: undefined },
    { label: t('filter_movies'), value: 'MOVIE' },
    { label: t('filter_series'), value: 'SERIES' },
    { label: t('filter_anime'), value: 'ANIME' },
    { label: t('filter_dorama'), value: 'DORAMA' },
    { label: t('filter_manga'), value: 'MANGA' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 400)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debounced, activeType, language],
    queryFn: () => search(debounced, activeType),
    enabled: debounced.length > 1,
  })

  const loading = isLoading || isFetching

  return (
    <View style={s.root}>
      <View style={s.searchBox}>
        <TextInput
          style={s.input}
          placeholder={t('search_placeholder')}
          placeholderTextColor={COLORS.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
      >
        {TYPE_FILTERS.map(({ label, value }) => (
          <Pressable
            key={label}
            style={[s.filterBtn, activeType === value && s.filterActive]}
            onPress={() => setActiveType(value)}
          >
            <Text style={[s.filterText, activeType === value && s.filterTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {debounced.length < 2 ? (
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>🔍</Text>
          <Text style={s.emptyText}>{t('search_min_chars')}</Text>
        </View>
      ) : loading ? (
        <View style={s.empty}>
          <ActivityIndicator color={COLORS.accent} />
        </View>
      ) : !data?.length ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>{t('search_no_results')} "{debounced}"</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => `${item.type}-${item.id}`}
          numColumns={3}
          contentContainerStyle={s.grid}
          columnWrapperStyle={s.row}
          renderItem={({ item }) => <ResultCard item={item} onPress={() =>
            router.push(`/media/${item.type.toLowerCase()}/${item.id}`)
          } />}
        />
      )}
    </View>
  )
}

function ResultCard({ item, onPress }: { item: MediaResult; onPress: () => void }) {
  const MEDIA_LABEL = useMediaLabel()
  return (
    <Pressable style={s.card} onPress={onPress}>
      {item.poster
        ? <Image source={{ uri: item.poster }} style={s.poster} />
        : <View style={[s.poster, s.posterPlaceholder]}><Text style={s.posterEmoji}>見</Text></View>}
      <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={s.cardType}>{MEDIA_LABEL[item.type]}</Text>
    </Pressable>
  )
}

const CARD_W = 110

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  searchBox: { padding: 16, paddingBottom: 8 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  filters: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterText: { color: COLORS.muted, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 40, color: COLORS.muted },
  emptyText: { color: COLORS.muted, fontSize: 14 },
  grid: { padding: 12 },
  row: { gap: 10, marginBottom: 10 },
  card: { width: CARD_W },
  poster: { width: CARD_W, height: 165, borderRadius: 10, backgroundColor: COLORS.surface },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  posterEmoji: { fontSize: 24, color: COLORS.muted },
  cardTitle: { fontSize: 11, color: COLORS.text, fontWeight: '500', marginTop: 5, lineHeight: 14 },
  cardType: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
})

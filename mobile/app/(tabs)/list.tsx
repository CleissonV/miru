import { useState } from 'react'
import {
  View, Text, FlatList, Image, Pressable, ScrollView,
  ActivityIndicator, StyleSheet,
} from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { listEntries, deleteEntry } from '@/api/entries'
import { getMediaDetail } from '@/api/media'
import { MEDIA_LABEL, STATUS_LABEL, type WatchStatus, type MediaType, type Entry } from '@/types'
import { COLORS } from '@/lib/constants'

const STATUS_FILTERS: { label: string; value: WatchStatus | undefined; color: string }[] = [
  { label: 'Todos', value: undefined, color: COLORS.muted },
  { label: 'Assistindo', value: 'WATCHING', color: COLORS.accent },
  { label: 'Concluídos', value: 'COMPLETED', color: COLORS.green },
  { label: 'Planejados', value: 'PLAN_TO_WATCH', color: COLORS.blue },
  { label: 'Em Pausa', value: 'ON_HOLD', color: COLORS.yellow },
  { label: 'Abandonados', value: 'DROPPED', color: COLORS.red },
]

const TYPE_FILTERS: { label: string; value: MediaType | undefined }[] = [
  { label: 'Tudo', value: undefined },
  { label: 'Filmes', value: 'MOVIE' },
  { label: 'Séries', value: 'SERIES' },
  { label: 'Animes', value: 'ANIME' },
  { label: 'Doramas', value: 'DORAMA' },
  { label: 'Mangás', value: 'MANGA' },
]

const STATUS_COLOR: Record<WatchStatus, string> = {
  WATCHING: COLORS.accent,
  COMPLETED: COLORS.green,
  PLAN_TO_WATCH: COLORS.blue,
  ON_HOLD: COLORS.yellow,
  DROPPED: COLORS.red,
}

export default function ListScreen() {
  const [status, setStatus] = useState<WatchStatus | undefined>()
  const [mediaType, setMediaType] = useState<MediaType | undefined>()
  const qc = useQueryClient()
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['entries', status, mediaType],
    queryFn: () => listEntries({ status, mediaType, limit: 100 }),
  })

  const remove = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries'] }),
  })

  return (
    <View style={s.root}>
      {/* Status filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
      >
        {STATUS_FILTERS.map(({ label, value, color }) => {
          const active = status === value
          return (
            <Pressable
              key={label}
              style={[s.filterBtn, active && { backgroundColor: COLORS.accent, borderColor: COLORS.accent }]}
              onPress={() => setStatus(value)}
            >
              <Text style={[s.filterText, active ? s.filterActive : { color }]}>{label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[s.filters, { paddingTop: 0 }]}
      >
        {TYPE_FILTERS.map(({ label, value }) => {
          const active = mediaType === value
          return (
            <Pressable
              key={label}
              style={[s.filterBtn, active && { backgroundColor: COLORS.pink, borderColor: COLORS.pink }]}
              onPress={() => setMediaType(value)}
            >
              <Text style={[s.filterText, active ? s.filterActive : { color: COLORS.muted }]}>{label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Count */}
      {data && (
        <Text style={s.count}>
          {data.pagination.total} {data.pagination.total === 1 ? 'título' : 'títulos'}
        </Text>
      )}

      {isLoading ? (
        <View style={s.loader}><ActivityIndicator color={COLORS.accent} /></View>
      ) : !data?.entries.length ? (
        <View style={s.empty}>
          <Text style={s.emptyEmoji}>見</Text>
          <Text style={s.emptyText}>Sua lista está vazia</Text>
          <Pressable style={s.emptyBtn} onPress={() => router.push('/(tabs)/search')}>
            <Text style={s.emptyBtnText}>Buscar títulos</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data.entries}
          keyExtractor={e => e.id}
          numColumns={3}
          contentContainerStyle={s.grid}
          columnWrapperStyle={s.row}
          renderItem={({ item }) => (
            <EntryCard
              entry={item}
              onPress={() => router.push(`/media/${item.mediaType.toLowerCase()}/${item.externalId}`)}
              onRemove={() => remove.mutate(item.id)}
            />
          )}
        />
      )}
    </View>
  )
}

function EntryCard({
  entry, onPress, onRemove,
}: {
  entry: Entry
  onPress: () => void
  onRemove: () => void
}) {
  const { data: media } = useQuery({
    queryKey: ['media', entry.mediaType.toLowerCase(), entry.externalId],
    queryFn: () => getMediaDetail(entry.mediaType.toLowerCase(), entry.externalId),
    staleTime: 1000 * 60 * 60,
  })

  return (
    <Pressable style={s.card} onPress={onPress} onLongPress={onRemove}>
      {media?.poster
        ? <Image source={{ uri: media.poster }} style={s.poster} />
        : <View style={[s.poster, s.posterPlaceholder]}><Text style={s.posterEmoji}>見</Text></View>}
      <Text style={s.cardTitle} numberOfLines={2}>{media?.title ?? '...'}</Text>
      <Text style={[s.cardStatus, { color: STATUS_COLOR[entry.status] }]}>
        {STATUS_LABEL[entry.status]}
      </Text>
      <Text style={s.cardType}>{MEDIA_LABEL[entry.mediaType]}</Text>
    </Pressable>
  )
}

const CARD_W = 110

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  filters: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterText: { fontSize: 12, fontWeight: '500' },
  filterActive: { color: '#fff' },
  count: { fontSize: 12, color: COLORS.muted, paddingHorizontal: 16, paddingBottom: 8 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 48, color: COLORS.muted },
  emptyText: { color: COLORS.muted, fontSize: 14 },
  emptyBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  grid: { padding: 12 },
  row: { gap: 10, marginBottom: 12 },
  card: { width: CARD_W },
  poster: { width: CARD_W, height: 165, borderRadius: 10, backgroundColor: COLORS.surface },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  posterEmoji: { fontSize: 24, color: COLORS.muted },
  cardTitle: { fontSize: 11, color: COLORS.text, fontWeight: '500', marginTop: 5, lineHeight: 14 },
  cardStatus: { fontSize: 10, fontWeight: '600', marginTop: 3 },
  cardType: { fontSize: 10, color: COLORS.muted },
})

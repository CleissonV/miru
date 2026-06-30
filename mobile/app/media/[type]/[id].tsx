import { useState } from 'react'
import {
  ScrollView, View, Text, Image, Pressable, Modal,
  ActivityIndicator, StyleSheet, Alert,
} from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMediaDetail } from '@/api/media'
import { listEntries, createEntry, updateEntry, deleteEntry } from '@/api/entries'
import { useAuthStore } from '@/stores/authStore'
import { type WatchStatus } from '@/types'
import { useT, useStatusLabel, useMediaLabel } from '@/i18n/translations'
import { COLORS } from '@/lib/constants'
import { useEffect } from 'react'

const STATUSES: WatchStatus[] = ['WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'ON_HOLD', 'DROPPED']

const STATUS_COLORS: Record<WatchStatus, string> = {
  WATCHING: COLORS.accent,
  COMPLETED: COLORS.green,
  PLAN_TO_WATCH: COLORS.blue,
  ON_HOLD: COLORS.yellow,
  DROPPED: COLORS.red,
}

export default function MediaDetailScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>()
  const navigation = useNavigation()
  const qc = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const language = useAuthStore(s => s.user?.language)
  const t = useT()
  const STATUS_LABEL = useStatusLabel()
  const MEDIA_LABEL = useMediaLabel()

  const { data: media, isLoading } = useQuery({
    queryKey: ['media', type, Number(id), language],
    queryFn: () => getMediaDetail(type!, Number(id)),
    enabled: !!type && !!id,
  })

  const { data: entriesData } = useQuery({
    queryKey: ['entries'],
    queryFn: () => listEntries({ limit: 500 }),
  })

  const existingEntry = entriesData?.entries.find(
    e => e.externalId === Number(id) && e.mediaType === type?.toUpperCase()
  )

  useEffect(() => {
    if (media?.title) navigation.setOptions({ title: media.title })
  }, [media?.title])

  const addOrUpdate = useMutation({
    mutationFn: async (status: WatchStatus) => {
      if (existingEntry) {
        return updateEntry(existingEntry.id, { status })
      }
      return createEntry({
        mediaType: type!.toUpperCase() as any,
        externalId: Number(id),
        status,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      setModalVisible(false)
    },
    onError: () => Alert.alert(t('detail_save_error_title'), t('detail_save_error_msg')),
  })

  const remove = useMutation({
    mutationFn: () => deleteEntry(existingEntry!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      setModalVisible(false)
    },
  })

  if (isLoading || !media) {
    return (
      <View style={s.loader}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    )
  }

  return (
    <>
      <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
        {/* Poster */}
        <View style={s.posterContainer}>
          {media.poster
            ? <Image source={{ uri: media.poster }} style={s.poster} resizeMode="cover" />
            : <View style={[s.poster, s.posterPlaceholder]}><Text style={s.posterEmoji}>見</Text></View>}
          <View style={s.posterOverlay} />
        </View>

        <View style={s.content}>
          {/* Type badge */}
          <View style={s.badge}>
            <Text style={s.badgeText}>{MEDIA_LABEL[media.type]}</Text>
          </View>

          {/* Title */}
          <Text style={s.title}>{media.title}</Text>

          {/* Meta row */}
          <View style={s.meta}>
            {media.score != null && (
              <View style={s.metaItem}>
                <Text style={s.metaStar}>★</Text>
                <Text style={s.metaText}>{media.score.toFixed(1)}</Text>
              </View>
            )}
            {media.year && (
              <View style={s.metaItem}>
                <Text style={s.metaText}>{media.year}</Text>
              </View>
            )}
            {media.episodes && (
              <View style={s.metaItem}>
                <Text style={s.metaText}>{media.episodes} {t('detail_episodes_suffix')}</Text>
              </View>
            )}
          </View>

          {/* Genres */}
          {media.genres.length > 0 && (
            <View style={s.genres}>
              {media.genres.slice(0, 4).map(g => (
                <View key={g} style={s.genreTag}>
                  <Text style={s.genreText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          {media.overview ? (
            <>
              {(media.type === 'ANIME' || media.type === 'MANGA') && (
                <Text style={s.langNote}>{t('detail_lang_note')}</Text>
              )}
              <Text style={s.overview}>{media.overview}</Text>
            </>
          ) : null}

          {/* Current status if in list */}
          {existingEntry && (
            <View style={[s.statusBanner, { borderColor: STATUS_COLORS[existingEntry.status] + '44' }]}>
              <Text style={s.statusBannerLabel}>{t('detail_in_list')}</Text>
              <Text style={[s.statusBannerStatus, { color: STATUS_COLORS[existingEntry.status] }]}>
                {STATUS_LABEL[existingEntry.status]}
              </Text>
            </View>
          )}

          {/* Add / Update button */}
          <Pressable style={s.actionBtn} onPress={() => setModalVisible(true)}>
            <Text style={s.actionBtnText}>
              {existingEntry ? t('detail_update_in_list') : t('detail_add_to_list')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Status picker modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={s.modalBg} onPress={() => setModalVisible(false)}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>{t('detail_choose_status')}</Text>

            {STATUSES.map(status => (
              <Pressable
                key={status}
                style={[
                  s.statusOption,
                  existingEntry?.status === status && s.statusOptionActive,
                ]}
                onPress={() => addOrUpdate.mutate(status)}
                disabled={addOrUpdate.isPending}
              >
                <View style={[s.statusDot, { backgroundColor: STATUS_COLORS[status] }]} />
                <Text style={s.statusOptionText}>{STATUS_LABEL[status]}</Text>
                {addOrUpdate.isPending && existingEntry?.status === status && (
                  <ActivityIndicator size="small" color={COLORS.accent} />
                )}
              </Pressable>
            ))}

            {existingEntry && (
              <>
                <View style={s.modalDivider} />
                <Pressable
                  style={s.removeBtn}
                  onPress={() => {
                    Alert.alert(t('detail_remove_confirm_title'), t('detail_remove_confirm_msg'), [
                      { text: t('cancel'), style: 'cancel' },
                      { text: t('detail_remove'), style: 'destructive', onPress: () => remove.mutate() },
                    ])
                  }}
                  disabled={remove.isPending}
                >
                  <Text style={s.removeBtnText}>{t('detail_remove_from_list')}</Text>
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  posterContainer: { height: 280, position: 'relative' },
  poster: { width: '100%', height: '100%', backgroundColor: COLORS.surface },
  posterPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  posterEmoji: { fontSize: 48, color: COLORS.muted },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  content: { padding: 20 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent + '22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: { color: COLORS.accent, fontSize: 12, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 12, lineHeight: 30 },
  meta: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaStar: { color: COLORS.yellow, fontSize: 13 },
  metaText: { color: COLORS.muted, fontSize: 13 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  genreTag: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genreText: { color: COLORS.text, fontSize: 12 },
  overview: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  langNote: { color: COLORS.subtle, fontSize: 11, marginBottom: 6 },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  statusBannerLabel: { color: COLORS.muted, fontSize: 13 },
  statusBannerStatus: { fontSize: 13, fontWeight: '700' },
  actionBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalBg: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusOptionActive: { backgroundColor: COLORS.surface2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusOptionText: { flex: 1, color: COLORS.text, fontSize: 15 },
  modalDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  removeBtn: { padding: 14, alignItems: 'center' },
  removeBtnText: { color: COLORS.red, fontWeight: '600', fontSize: 14 },
})

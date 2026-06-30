import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe } from 'lucide-react-native'
import { useAuthStore, type Language } from '@/stores/authStore'
import { logout } from '@/api/auth'
import { api } from '@/api/client'
import { useT } from '@/i18n/translations'
import { COLORS } from '@/lib/constants'

export default function ProfileScreen() {
  const { user, clearUser, setUser } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()
  const t = useT()

  const updateLanguage = useMutation({
    mutationFn: async (language: Language) => {
      const { data } = await api.patch('/users/me', { language })
      return data
    },
    onSuccess: (updated) => {
      setUser(updated)
      qc.invalidateQueries({ queryKey: ['trending'] })
      qc.invalidateQueries({ queryKey: ['media'] })
      qc.invalidateQueries({ queryKey: ['search'] })
    },
  })

  async function handleLogout() {
    Alert.alert(t('profile_logout_confirm_title'), t('profile_logout_confirm_msg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('profile_logout_confirm_title'),
        style: 'destructive',
        onPress: async () => {
          await logout()
          clearUser()
          qc.clear()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  if (!user) return null

  const initials = (user.displayName ?? user.username)
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <ScrollView style={s.root} contentContainerStyle={s.container}>
      {/* Avatar */}
      <View style={s.avatarCircle}>
        <Text style={s.avatarText}>{initials}</Text>
      </View>

      <Text style={s.displayName}>{user.displayName ?? user.username}</Text>
      <Text style={s.username}>@{user.username}</Text>
      <Text style={s.email}>{user.email}</Text>

      <View style={s.divider} />

      <View style={s.infoCard}>
        <InfoRow label={t('profile_username')} value={`@${user.username}`} />
        <InfoRow label={t('profile_email')} value={user.email} />
        {user.displayName && <InfoRow label={t('profile_name')} value={user.displayName} />}
      </View>

      <View style={s.langCard}>
        <View style={s.langHeader}>
          <Globe size={12} color={COLORS.muted} />
          <Text style={s.langHeaderText}>{t('profile_language_label')}</Text>
        </View>
        <View style={s.langButtons}>
          {([
            { value: 'pt-BR' as Language, label: 'Português' },
            { value: 'en' as Language, label: 'English' },
          ]).map(({ value, label }) => {
            const active = (user.language ?? 'pt-BR') === value
            return (
              <Pressable
                key={value}
                onPress={() => updateLanguage.mutate(value)}
                disabled={updateLanguage.isPending}
                style={[s.langBtn, active && s.langBtnActive]}
              >
                <Text style={[s.langBtnText, active && s.langBtnTextActive]}>{label}</Text>
              </Pressable>
            )
          })}
        </View>
        <Text style={s.langHint}>
          {t('profile_language_hint')}
        </Text>
      </View>

      <Pressable style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutText}>{t('profile_logout')}</Text>
      </Pressable>
    </ScrollView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 24, alignItems: 'center' },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  displayName: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  username: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  email: { fontSize: 13, color: COLORS.subtle, marginTop: 4 },
  divider: { width: '100%', height: 1, backgroundColor: COLORS.border, marginVertical: 24 },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: 13, color: COLORS.muted },
  infoValue: { fontSize: 13, color: COLORS.text, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  logoutBtn: {
    marginTop: 24,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.red + '44',
    padding: 14,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.red, fontWeight: '600', fontSize: 15 },
  langCard: {
    marginTop: 16,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  langHeaderText: { fontSize: 10, fontWeight: '700', color: COLORS.muted, letterSpacing: 1 },
  langButtons: { flexDirection: 'row', gap: 8 },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface2,
  },
  langBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  langBtnText: { fontSize: 13, fontWeight: '500', color: COLORS.muted },
  langBtnTextActive: { color: '#fff' },
  langHint: { fontSize: 11, color: COLORS.subtle, marginTop: 10, lineHeight: 15 },
})

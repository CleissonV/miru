import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Image, TextInput, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { Globe, Pencil, Check, X, Camera, KeyRound } from 'lucide-react-native'
import { useAuthStore, type Language } from '@/stores/authStore'
import { logout } from '@/api/auth'
import { changePassword, uploadAvatar } from '@/api/users'
import { api } from '@/api/client'
import { useT } from '@/i18n/translations'
import { FlagBR, FlagUS } from '@/components/Flag'
import { COLORS, MEDIA_BASE_URL } from '@/lib/constants'

export default function ProfileScreen() {
  const { user, clearUser, setUser } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()
  const t = useT()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const invalidateMediaQueries = () => {
    qc.invalidateQueries({ queryKey: ['trending'] })
    qc.invalidateQueries({ queryKey: ['media'] })
    qc.invalidateQueries({ queryKey: ['search'] })
  }

  const updateLanguage = useMutation({
    mutationFn: async (language: Language) => {
      const { data } = await api.patch('/users/me', { language })
      return data
    },
    onSuccess: (updated) => {
      setUser(updated)
      invalidateMediaQueries()
    },
  })

  const updateName = useMutation({
    mutationFn: async (displayName: string) => {
      const { data } = await api.patch('/users/me', { displayName })
      return data
    },
    onSuccess: (updated) => {
      setUser(updated)
      setEditingName(false)
    },
  })

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updated) => setUser(updated),
  })

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordMsg({ type: 'ok', text: t('profile_password_changed') })
      setCurrentPassword('')
      setNewPassword('')
    },
    onError: (e: any) => {
      setPasswordMsg({ type: 'err', text: e?.response?.data?.error ?? 'Erro' })
    },
  })

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      avatarMutation.mutate(result.assets[0])
    }
  }

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

  const avatarSrc = user.avatar
    ? user.avatar.startsWith('http') ? user.avatar : `${MEDIA_BASE_URL}${user.avatar}`
    : null

  return (
    <ScrollView style={s.root} contentContainerStyle={s.container}>
      {/* Avatar */}
      <Pressable style={s.avatarCircle} onPress={handlePickAvatar} disabled={avatarMutation.isPending}>
        {avatarSrc ? (
          <Image source={{ uri: avatarSrc }} style={s.avatarImage} />
        ) : (
          <Text style={s.avatarText}>{initials}</Text>
        )}
        <View style={s.avatarOverlay}>
          {avatarMutation.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Camera size={16} color="#fff" />}
        </View>
      </Pressable>

      {editingName ? (
        <View style={s.nameEditRow}>
          <TextInput
            autoFocus
            value={nameInput}
            onChangeText={setNameInput}
            maxLength={50}
            style={s.nameInput}
          />
          <Pressable
            onPress={() => nameInput.trim() && updateName.mutate(nameInput.trim())}
            style={s.nameBtnOk}
          >
            <Check size={15} color={COLORS.green} />
          </Pressable>
          <Pressable onPress={() => setEditingName(false)} style={s.nameBtnCancel}>
            <X size={15} color={COLORS.muted} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={s.nameRow}
          onPress={() => {
            setNameInput(user.displayName ?? user.username)
            setEditingName(true)
          }}
        >
          <Text style={s.displayName}>{user.displayName ?? user.username}</Text>
          <Pencil size={13} color={COLORS.subtle} />
        </Pressable>
      )}

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
            { value: 'pt-BR' as Language, Flag: FlagBR, label: 'Português' },
            { value: 'en' as Language, Flag: FlagUS, label: 'English' },
          ]).map(({ value, Flag, label }) => {
            const active = (user.language ?? 'pt-BR') === value
            return (
              <Pressable
                key={value}
                onPress={() => updateLanguage.mutate(value)}
                disabled={updateLanguage.isPending}
                accessibilityLabel={label}
                style={[s.langBtn, active && s.langBtnActive]}
              >
                <Flag size={26} />
              </Pressable>
            )
          })}
        </View>
        <Text style={s.langHint}>
          {t('profile_language_hint')}
        </Text>
      </View>

      <View style={s.passwordCard}>
        <Pressable style={s.passwordHeader} onPress={() => setShowPasswordForm(v => !v)}>
          <KeyRound size={12} color={COLORS.muted} />
          <Text style={s.langHeaderText}>{t('profile_change_password')}</Text>
        </Pressable>

        {showPasswordForm && (
          <View style={s.passwordForm}>
            <TextInput
              style={s.passwordInput}
              placeholder={t('profile_current_password')}
              placeholderTextColor={COLORS.muted}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={s.passwordInput}
              placeholder={t('profile_new_password')}
              placeholderTextColor={COLORS.muted}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {passwordMsg && (
              <Text style={passwordMsg.type === 'ok' ? s.passwordMsgOk : s.passwordMsgErr}>
                {passwordMsg.text}
              </Text>
            )}
            <Pressable
              style={s.passwordSaveBtn}
              onPress={() => {
                setPasswordMsg(null)
                passwordMutation.mutate({ currentPassword, newPassword })
              }}
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={s.passwordSaveText}>{t('profile_save')}</Text>}
            </Pressable>
          </View>
        )}
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
    marginBottom: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: COLORS.surface2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nameBtnOk: { backgroundColor: COLORS.green + '22', borderRadius: 8, padding: 7 },
  nameBtnCancel: { backgroundColor: COLORS.surface2, borderRadius: 8, padding: 7 },
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
  langHint: { fontSize: 11, color: COLORS.subtle, marginTop: 10, lineHeight: 15 },
  passwordCard: {
    marginTop: 12,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  passwordHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  passwordForm: { marginTop: 12, gap: 8 },
  passwordInput: {
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 11,
    color: COLORS.text,
    fontSize: 13,
  },
  passwordMsgOk: { color: COLORS.green, fontSize: 12 },
  passwordMsgErr: { color: COLORS.red, fontSize: 12 },
  passwordSaveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  passwordSaveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
})

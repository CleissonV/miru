import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { logout } from '@/api/auth'
import { COLORS } from '@/lib/constants'

export default function ProfileScreen() {
  const { user, clearUser } = useAuthStore()
  const router = useRouter()
  const qc = useQueryClient()

  async function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
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
        <InfoRow label="Nome de usuário" value={`@${user.username}`} />
        <InfoRow label="E-mail" value={user.email} />
        {user.displayName && <InfoRow label="Nome" value={user.displayName} />}
      </View>

      <Pressable style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutText}>Sair da conta</Text>
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
})

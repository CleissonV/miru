import { useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'
import { register } from '@/api/auth'
import { COLORS } from '@/lib/constants'

export default function RegisterScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()

  async function handleRegister() {
    if (!username || !email || !password) { setError('Preencha os campos obrigatórios'); return }
    setError('')
    setLoading(true)
    try {
      const data = await register({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        displayName: displayName.trim() || undefined,
      })
      setUser(data.user)
      router.replace('/(tabs)')
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>見</Text>
        <Text style={s.title}>Criar conta</Text>
        <Text style={s.subtitle}>Gratuito, sem anúncios</Text>

        <TextInput
          style={s.input}
          placeholder="Nome de usuário *"
          placeholderTextColor={COLORS.muted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={s.input}
          placeholder="Nome de exibição"
          placeholderTextColor={COLORS.muted}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={s.input}
          placeholder="E-mail *"
          placeholderTextColor={COLORS.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={s.input}
          placeholder="Senha *"
          placeholderTextColor={COLORS.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={s.error}>{error}</Text> : null}

        <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>Criar conta</Text>}
        </Pressable>

        <View style={s.footer}>
          <Text style={s.footerText}>Já tem conta? </Text>
          <Link href="/(auth)/login" style={s.link}>Entrar</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 28 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 12,
  },
  error: { color: COLORS.red, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: COLORS.muted, fontSize: 14 },
  link: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
})

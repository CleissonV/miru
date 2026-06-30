import { useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'
import { login, resendVerification } from '@/api/auth'
import { COLORS } from '@/lib/constants'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [unverified, setUnverified] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) { setError('Preencha todos os campos'); return }
    setError('')
    setUnverified(false)
    setResendSent(false)
    setLoading(true)
    try {
      const data = await login(email.trim().toLowerCase(), password)
      setUser(data.user)
      router.replace('/(tabs)')
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao entrar')
      setUnverified(e?.response?.data?.code === 'EMAIL_NOT_VERIFIED')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    await resendVerification(email.trim().toLowerCase())
    setResendSent(true)
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>見</Text>
        <Text style={s.title}>Entrar no Miru</Text>
        <Text style={s.subtitle}>Acompanhe tudo que você assiste</Text>

        <TextInput
          style={s.input}
          placeholder="E-mail"
          placeholderTextColor={COLORS.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={s.input}
          placeholder="Senha"
          placeholderTextColor={COLORS.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Link href="/(auth)/forgot-password" style={s.forgotLink}>Esqueceu a senha?</Link>

        {error ? (
          <View style={s.errorBox}>
            <Text style={s.error}>{error}</Text>
            {unverified && (
              resendSent ? (
                <Text style={s.resendSent}>E-mail reenviado! Verifique sua caixa de entrada.</Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={s.resendLink}>Reenviar e-mail de confirmação</Text>
                </Pressable>
              )
            )}
          </View>
        ) : null}

        <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>Entrar</Text>}
        </Pressable>

        <View style={s.footer}>
          <Text style={s.footerText}>Não tem conta? </Text>
          <Link href="/(auth)/register" style={s.link}>Cadastre-se</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginBottom: 32 },
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
  forgotLink: { color: COLORS.accent, fontSize: 13, fontWeight: '500', textAlign: 'right', marginBottom: 16 },
  errorBox: { marginBottom: 12, alignItems: 'center' },
  error: { color: COLORS.red, fontSize: 13, textAlign: 'center' },
  resendLink: { color: COLORS.red, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline', marginTop: 6 },
  resendSent: { color: COLORS.green, fontSize: 12, fontWeight: '600', marginTop: 6 },
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

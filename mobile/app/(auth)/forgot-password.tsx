import { useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { forgotPassword } from '@/api/auth'
import { useT } from '@/i18n/translations'
import { COLORS } from '@/lib/constants'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useT()

  async function handleSubmit() {
    if (!email) return
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email.trim().toLowerCase())
      setSent(true)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>見</Text>
        <Text style={s.title}>{t('forgot_password_title')}</Text>
        <Text style={s.subtitle}>{t('forgot_password_subtitle')}</Text>

        {sent ? (
          <View>
            <Text style={s.success}>{t('forgot_password_sent')}</Text>
            <Pressable
              style={s.btn}
              onPress={() => router.push(`/(auth)/reset-password?email=${encodeURIComponent(email)}`)}
            >
              <Text style={s.btnText}>{t('forgot_password_continue')}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <TextInput
              style={s.input}
              placeholder={t('email_placeholder')}
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {error ? <Text style={s.error}>{error}</Text> : null}
            <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{t('forgot_password_submit')}</Text>}
            </Pressable>
          </>
        )}

        <View style={s.footer}>
          <Link href="/(auth)/login" style={s.link}>{t('reset_password_back_to_login')}</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
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
  success: {
    color: COLORS.green,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 19,
  },
  error: { color: COLORS.red, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  btn: { backgroundColor: COLORS.accent, borderRadius: 12, padding: 15, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  link: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
})

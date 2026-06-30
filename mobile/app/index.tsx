import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/api/client'
import { COLORS } from '@/lib/constants'

export default function Index() {
  const { isAuthenticated, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const token = await SecureStore.getItemAsync('access_token')
      if (token) {
        try {
          const { data } = await api.get('/users/me')
          setUser(data)
        } catch {
          await SecureStore.deleteItemAsync('access_token')
          await SecureStore.deleteItemAsync('refresh_token')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (loading) return
    router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login')
  }, [loading, isAuthenticated])

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={COLORS.accent} size="large" />
    </View>
  )
}

import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { queryClient } from '@/lib/queryClient'
import { COLORS } from '@/lib/constants'

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="media/[type]/[id]"
          options={{ title: '', headerBackTitle: 'Voltar' }}
        />
      </Stack>
    </QueryClientProvider>
  )
}

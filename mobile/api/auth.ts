import { api } from './client'
import * as SecureStore from '@/lib/secureStorage'

interface AuthResponse {
  user: { id: string; username: string; email: string; displayName: string | null; avatar: string | null }
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password })
  await SecureStore.setItemAsync('access_token', res.data.accessToken)
  await SecureStore.setItemAsync('refresh_token', res.data.refreshToken)
  return res.data
}

export async function register(data: {
  email: string
  username: string
  password: string
  displayName?: string
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data)
  await SecureStore.setItemAsync('access_token', res.data.accessToken)
  await SecureStore.setItemAsync('refresh_token', res.data.refreshToken)
  return res.data
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('access_token')
  await SecureStore.deleteItemAsync('refresh_token')
}

import { api } from './client'
import * as SecureStore from '@/lib/secureStorage'

interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
    displayName: string | null
    avatar: string | null
    language: 'pt-BR' | 'en'
    emailVerified: boolean
  }
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password })
  await SecureStore.setItemAsync('access_token', res.data.accessToken)
  await SecureStore.setItemAsync('refresh_token', res.data.refreshToken)
  return res.data
}

interface RegisterResponse {
  user: { id: string; email: string; username: string }
}

export async function register(data: {
  email: string
  username: string
  password: string
  displayName?: string
}): Promise<RegisterResponse> {
  const res = await api.post<RegisterResponse>('/auth/register', data)
  return res.data
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('access_token')
  await SecureStore.deleteItemAsync('refresh_token')
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  const res = await api.post('/auth/resend-verification', { email })
  return res.data
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

export async function resetPassword(data: {
  email: string
  code: string
  newPassword: string
}): Promise<{ message: string }> {
  const res = await api.post('/auth/reset-password', data)
  return res.data
}

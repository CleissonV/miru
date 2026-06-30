import { api } from './client'
import type { User } from '../types'

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
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

export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data)
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me')
  return res.data
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const res = await api.get('/auth/verify-email', { params: { token } })
  return res.data
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

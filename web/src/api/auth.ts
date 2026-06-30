import { api } from './client'
import type { User } from '../types'

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function register(data: {
  email: string
  username: string
  password: string
  displayName?: string
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data)
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

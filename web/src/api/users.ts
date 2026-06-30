import { api } from './client'
import type { User } from '../types'

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ message: string }> {
  const res = await api.patch('/users/me/password', data)
  return res.data
}

export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData()
  form.append('avatar', file)
  const res = await api.post<User>('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

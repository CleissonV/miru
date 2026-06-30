import { api } from './client'

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ message: string }> {
  const res = await api.patch('/users/me/password', data)
  return res.data
}

export async function uploadAvatar(asset: { uri: string; fileName?: string | null; mimeType?: string | null }) {
  const form = new FormData()
  const filename = asset.fileName ?? asset.uri.split('/').pop() ?? 'avatar.jpg'
  const type = asset.mimeType ?? 'image/jpeg'

  form.append('avatar', { uri: asset.uri, name: filename, type } as unknown as Blob)

  const res = await api.post('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

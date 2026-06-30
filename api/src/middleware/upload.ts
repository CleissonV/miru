import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { ApiError } from '../utils/apiError'

const AVATAR_DIR = path.resolve(process.cwd(), 'uploads', 'avatars')
fs.mkdirSync(AVATAR_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${req.user!.sub}-${Date.now()}${ext}`)
  },
})

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      cb(new Error('Formato inválido. Use JPEG, PNG ou WebP.'))
      return
    }
    cb(null, true)
  },
}).single('avatar')

export function avatarUrl(filename: string) {
  return `/uploads/avatars/${filename}`
}

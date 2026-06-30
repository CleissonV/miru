import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './modules/auth/auth.routes'
import entryRoutes from './modules/entries/entry.routes'
import mediaRoutes from './modules/media/media.routes'
import searchRoutes from './modules/search/search.routes'
import userRoutes from './modules/users/user.routes'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10kb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
})

app.use('/api', limiter)

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

app.use('/api/auth', authRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

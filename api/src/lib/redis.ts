import Redis from 'ioredis'
import { env } from '../config/env'

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
})

redis.on('error', (err: Error) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Redis]', err.message)
  }
})

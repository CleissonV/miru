import './config/env'
import { app } from './app'
import { env } from './config/env'
import { redis } from './lib/redis'
import { db } from './db/prisma'

async function bootstrap() {
  try {
    await redis.connect()
    console.log('✓ Redis conectado')
  } catch (err) {
    console.warn('⚠ Redis indisponível — cache desativado')
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀  API em http://localhost:${env.PORT}  [${env.NODE_ENV}]`)
  })

  const shutdown = async () => {
    server.close()
    await db.$disconnect()
    await redis.quit()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar:', err)
  process.exit(1)
})

import 'dotenv/config'
import { logger } from './shared/logger'
import createServer from './app'

const port = process.env.PORT || 3008

const app = createServer()

try {
  app.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`)
  })
} catch (error) {
  logger.error(`Error occured: ${(error as any).message}`)
}

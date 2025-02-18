import dotenv from 'dotenv'
import { logger } from './shared/logger'
import createServer from './app'
import chalk from 'chalk';

export { chalk };
dotenv.config()
const port = process.env.PORT 



const app = createServer()

try {
  app.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`)
  })
} catch (error) {
  logger.error(`Error occured: ${(error as any).message}`)
}

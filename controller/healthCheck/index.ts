import { Response, Request } from 'express'
import { logger } from '../../shared/logger'

const controller = {
  healthStatus: async (req: Request, res: Response): Promise<void> => {
    logger.info('Health status requested', req)
    const message = 'Service is running'
    res.status(200).send(message)
  },

  healthCheck: async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(req)
      let responseText = ''
      responseText += `Server is UP\n`
      responseText += `TIME=${new Date().toISOString()}\n`
      responseText += `uptime:${process.uptime()}`
      res.status(200).send(responseText)
    } catch (error) {
      logger.error('Error in health check', error)
      res.status(299).send('Internal Server Error')
    }
  },
}

export default controller

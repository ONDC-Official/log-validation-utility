import { Response, Request } from 'express'
import { logger } from '../../shared/logger'
import { pingValidate } from '../../utils'

const controller = {
  healthCheck: async (req: Request, res: Response): Promise<void> => {
    logger.info('Health check endpoint called')
    logger.info(req)
    const response  = await pingValidate()
    const responseMessage = {
      success: response === "ok" ? true : false,
      message: 'The server is up and running. Keep up the great work, developers!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
    res.status(200).send(responseMessage)
  },
}

export default controller

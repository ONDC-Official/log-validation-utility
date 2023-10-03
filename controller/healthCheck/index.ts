import { Response, Request } from 'express'
import { logger } from '../../shared/logger'

const controller = {
  healthCheck: async (req: Request, res: Response): Promise<void> => {
    logger.info(req)
    const responseMessage = {
      success: true,
      message: 'The server is up and running. Keep up the great work, developers!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
    res.status(200).send(responseMessage)
  },
}

export default controller

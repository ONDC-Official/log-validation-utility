import { Response, Request } from 'express'
import _ from 'lodash'
import { validateLogs } from '../../shared/validateLogs'
import { logger } from '../../shared/logger'

const controller = {
  validate: async (req: Request, res: Response): Promise<void> => {
    try {
      const { domain, version, payload } = req.body
      let response

      switch (version) {
        case '1.2.0':
          response = validateLogs(payload, domain)
          break
        default:
          logger.warn('Invalid Version!! ')
          res.status(400).send({ status: false, response: 'Invalid Version!! Please Enter a valid Version' })
          return
      }

      if (!_.isEmpty(response)) res.status(400).send({ status: false, response: response })
      else res.status(200).send({ status: true, response: response })
    } catch (error) {
      logger.error(error)
      res.status(500).send({ status: false, error: error })
    }
  },
}

export default controller

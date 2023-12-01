import { Response, Request } from 'express'
import _ from 'lodash'
import { IGMvalidateLogs, validateActionSchema, validateLogs } from '../../shared/validateLogs'
import { logger } from '../../shared/logger'
import { actionsArray, fisFlows } from '../../constants'
import { validateLogsForFIS12 } from '../../shared/Actions/FIS12Actions'
import { validateLogsForMobility } from '../../shared/Actions/mobilityActions'

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
          res.status(400).send({ success: false, response: 'Invalid Version!! Please Enter a valid Version' })
          return
      }

      if (!_.isEmpty(response)) res.status(400).send({ success: false, response: response })
      else res.status(200).send({ success: true, response: response })
    } catch (error) {
      logger.error(error)
      res.status(500).send({ success: false, error: error })
    }
  },

  validateFIS: async (req: Request, res: Response): Promise<void> => {
    try {
      const { domain, version, payload, flow } = req.body
      let response

      if (!(flow in fisFlows)) {
        res.status(400).send({ success: false, response: 'Invalid Flow!!' })
      } else {
        switch (version) {
          case '1.2.0':
            response = validateLogsForFIS12(payload, domain, flow)
            break
          default:
            logger.warn('Invalid Version!! ')
            res.status(400).send({ success: false, response: 'Invalid Version!! Please Enter a valid Version' })
            return
        }

        if (!_.isEmpty(response)) res.status(400).send({ success: false, response: response })
        else res.status(200).send({ success: true, response: response })
      }
    } catch (error) {
      logger.error(error)
      res.status(500).send({ success: false, error: error })
    }
  },
  validateIGM: async (req: Request, res: Response): Promise<void> => {
    try {
      const { version, payload } = req.body
      let response

      switch (version) {
        case '1.2.0':
          response = IGMvalidateLogs(payload)
          break
        default:
          logger.warn('Invalid Version!! ')
          res.status(400).send({ success: false, response: 'Invalid Version!! Please Enter a valid Version' })
          return
      }

      if (!_.isEmpty(response)) res.status(400).send({ success: false, response: response })
      else res.status(200).send({ success: true, response: response })
    } catch (error) {
      logger.error(error)
      res.status(500).send({ success: false, error: error })
    }
  },

  validateAction: async (req: Request, res: Response): Promise<any> => {
    try {
      let error
      if (!req.body) return res.status(400).send({ success: false, error: 'provide transaction logs to verify' })
      const { context, message } = req.body

      if (!context || !message) return res.status(400).send({ success: false, error: 'context, message are required' })

      if (!context.domain || !context.core_version || !context.action) {
        return res
          .status(400)
          .send({ success: false, error: 'context.domain, context.core_version, context.action is required' })
      }

      const { domain, core_version, action } = req.body.context
      if (!actionsArray.includes(action)) {
        return res.status(400).send({ success: false, error: 'context.action should be valid' })
      }

      const payload = req.body
      switch (core_version) {
        case '1.2.0':
          error = validateActionSchema(payload, domain, action)
          break
        default:
          logger.warn('Invalid core_version !! ')
          res.status(400).send({ success: false, error: 'Invalid core_version, Please Enter a valid core_version' })
          return
      }

      if (!_.isEmpty(error)) res.status(400).send({ success: false, error })
      else return res.status(200).send({ success: true, error })
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, error: error })
    }
  },

  validateMobility: async (req: Request, res: Response): Promise<void> => {
    try {
      const { domain, version, payload } = req.body
      let response

      switch (version) {
        case '2.0.0':
          response = validateLogsForMobility(payload, domain)
          break
        default:
          logger.warn('Invalid Version!! ')
          res.status(400).send({ success: false, response: 'Invalid Version!! Please Enter a valid Version' })
          return
      }

      if (!_.isEmpty(response)) res.status(400).send({ success: false, response: response })
      else res.status(200).send({ success: true, response: response })
    } catch (error) {
      logger.error(error)
      res.status(500).send({ success: false, error: error })
    }
  },
}

export default controller

import { Response, Request } from 'express'
import _ from 'lodash'
import { logger } from '../../shared/logger'
import { DOMAIN, IHttpResponse } from '../../shared/types'
import helper from './helper'

import { verify, hash } from '../../shared/crypto'

import { dropDB } from '../../shared/dao'
// Retail 1.2.5
import { checkSearch as checkSearch125 } from '../../utils/Retail_.1.2.5/Search/search'
import { checkOnsearch as checkOnSearch125 } from '../../utils/Retail_.1.2.5/Search/on_search'
import { checkOnsearchFullCatalogRefresh as checkOnSearchRET11 } from '../../utils/Retail_.1.2.5/RET11_onSearch/onSearch'
import { checkSelect as checkSelect125 } from '../../utils/Retail_.1.2.5/Select/select'
import { checkOnSelect as checkOnSelect125 } from '../../utils/Retail_.1.2.5/Select/onSelect'
import { checkInit as checkInit125 } from '../../utils/Retail_.1.2.5/Init/init'
import { checkOnInit as checkOnInit125 } from '../../utils/Retail_.1.2.5/Init/onInit'
import { checkCancel as checkCancel125 } from '../../utils/Retail_.1.2.5/Cancel/cancel'
import { checkOnCancel as checkOnCancel125 } from '../../utils/Retail_.1.2.5/Cancel/onCancel'
import { checkConfirm as checkConfirm125 } from '../../utils/Retail_.1.2.5/Confirm/confirm'
import { checkOnConfirm as checkOnConfirm125 } from '../../utils/Retail_.1.2.5/Confirm/onConfirm'
import { checkOnStatusPending as checkOnStatusPending125 } from '../../utils/Retail_.1.2.5/Status/onStatusPending'
import { checkOnStatusPacked as checkOnStatusPacked125 } from '../../utils/Retail_.1.2.5/Status/onStatusPacked'
import { checkOnStatusPicked as checkOnStatusPicked125 } from '../../utils/Retail_.1.2.5/Status/onStatusPicked'
import { checkOnStatusOutForDelivery as checkOnStatusOutForDelivery125 } from '../../utils/Retail_.1.2.5/Status/onStatusOutForDelivery'
import { checkOnStatusDelivered as checkOnStatusDelivered125 } from '../../utils/Retail_.1.2.5/Status/onStatusDelivered'
import { checkOnStatusAgentAssigned as checkOnStatusAgentAssigned125 } from '../../utils/Retail_.1.2.5/Status/onStatusAgentAssigned'
import { checkOnStatusAtPickup as checkOnStatusAtPickup125 } from '../../utils/Retail_.1.2.5/Status/onStatusAtPickup'
import { checkOnStatusOutForPickup as checkOnStatusOutForPickup125 } from '../../utils/Retail_.1.2.5/Status/onStatusOutForPickup'
import { checkOnStatusPickupFailed as checkOnStatusPickupFailed125 } from '../../utils/Retail_.1.2.5/Status/onStatusPickupFailed'
import { checkOnStatusInTransit as checkOnStatusInTransit125 } from '../../utils/Retail_.1.2.5/Status/onStatusInTransit'
import { checkOnStatusAtDestinationHub as checkOnStatusAtDestinationHub125 } from '../../utils/Retail_.1.2.5/Status/onStatusAtDestinationHub'
import { checkOnStatusAtDelivery as checkOnStatusAtDelivery125 } from '../../utils/Retail_.1.2.5/Status/onStatusAtDelivery'
import { checkOnStatusDeliveryFailed as checkOnStatusDeliveryFailed125 } from '../../utils/Retail_.1.2.5/Status/onStatusDeliveryFailed'
import { checkOnStatusRTODelivered as checkOnStatusRTODelivered125 } from '../../utils/Retail_.1.2.5/Status/onStatusRTODelivered'
import { checkTrack as checkTrack125 } from '../../utils/Retail_.1.2.5/Track/track'
import { checkOnTrack as checkOnTrack125 } from '../../utils/Retail_.1.2.5/Track/onTrack'
import { checkUpdate as checkUpdate125 } from '../../utils/Retail_.1.2.5/Update/update'
import { checkOnUpdate as checkOnUpdate125 } from '../../utils/Retail_.1.2.5/Update/onUpdate'
import { checkSearchIncremental as checkSearchIncremental125 } from '../../utils/Retail_.1.2.5/SearchInc/searchIncremental'
import { checkOnsearchIncremental as checkOnSearchIncremental125 } from '../../utils/Retail_.1.2.5/SearchInc/onSearchIncremental'
import { ApiSequence } from '../../constants'
// Retail 1.2.0
import { checkSearch as checkSearch120 } from '../../utils/Retail/Search/search'
import { checkOnsearch as checkOnSearch120 } from '../../utils/Retail/Search/on_search'

const controller = {
  validate: async (req: Request, res: Response): Promise<Response | void> => {
    console.log("++++++++++++++++ Validate is called")
    try {
      const { domain, version, payload, flow, bap_id, bpp_id } = req.body

      let result: { response?: string; success?: boolean; message?: string } = {}
      const splitPath = req.originalUrl.split('/')
      const pathUrl = splitPath[splitPath.length - 1]
      const normalisedDomain = helper.getEnumForDomain(pathUrl)

      switch (normalisedDomain) {
        case DOMAIN.RETAIL:
          {
            const { response, success, message } = await helper.validateRetail(
              domain,
              payload,
              version,
              flow,
              bap_id,
              bpp_id,
            )
            result = { response, success, message }
          }

          break
        case DOMAIN.LOGISTICS:
          // to-do
          throw new Error('Domain not supported yet')
          break
        case DOMAIN.FINANCE:
          {
            const { response, success, message } = await helper.validateFinance(domain, payload, version, flow)
            result = { response, success, message }
          }

          break
        case DOMAIN.MOBILITY:
          {
            const { response, success, message } = await helper.validateMobility(domain, payload, version, flow)
            result = { response, success, message }
          }

          break
        case DOMAIN.IGM:
          // eslint-disable-next-line no-case-declarations
          const { response, success, message } = await helper.validateIGM(payload, version, flow)
          result = { response, success, message }
          break
        case DOMAIN.RSF:
          {
            const { response, success, message } = await helper.validateRSF(payload, version)
            result = { response, success, message }
          }

          break
        default:
          throw new Error('Internal server error')
      }

      const { response, success, message } = result

      const httpResponse: IHttpResponse = {
        message,
        report: response,
        bpp_id,
        bap_id,
        domain,
        payload,
        reportTimestamp: new Date().toISOString(),
      }

      const { signature, currentDate } = await helper.createSignature({ message: JSON.stringify(httpResponse) })

      if (!success && response) return res.status(200).send({ success, response: httpResponse, signature, signTimestamp: currentDate })
      if (!success)
        return res.status(400).send({ success, response: httpResponse, signature, signTimestamp: currentDate })

      return res.status(200).send({ success, response: httpResponse, signature, signTimestamp: currentDate })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).send({ success: false, response: { message: error?.message || error } })
    }
  },

  validateToken: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { success, response, signature, signTimestamp } = req.body

      // Validate required fields exist
      if (
        signature === undefined ||
        signTimestamp === undefined ||
        response === undefined ||
        success === undefined ||
        response.payload === undefined // Check payload inside response
      ) {
        throw new Error('Payload must contain: signature, signTimestamp, success, response (with payload)')
      }

      const publicKey = process.env.SIGN_PUBLIC_KEY as string
      if (!publicKey) {
        throw new Error('Server configuration error: SIGN_PUBLIC_KEY not set')
      }

      // Create httpResponse from the response object
      const httpResponse: IHttpResponse = {
        message: response.message,
        report: response.report,
        bpp_id: response.bpp_id,
        bap_id: response.bap_id,
        domain: response.domain,
        payload: response.payload, // Get payload from response
        reportTimestamp: response.reportTimestamp,
      }

      const hashString = await hash({ message: JSON.stringify(httpResponse) })
      const signingString = `${hashString}|${signTimestamp}`

      const isVerified = await verify({
        signedMessage: signature,
        message: signingString,
        publicKey,
      })

      return res.status(200).send({
        success: true,
        response: {
          message: isVerified ? 'Signature verification successful' : 'Invalid signature',
          verified: isVerified,
        },
      })
    } catch (error: any) {
      logger.error('Signature verification failed:', error)
      return res.status(400).send({
        success: false,
        response: {
          message: error?.message || 'Signature verification failed',
        },
      })
    }
  },

  validateSingleAction: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      if (!req.body) return res.status(400).send({ success: false, error: 'provide transaction logs to verify' })

      const { payload, flow, stateless: topLevelStateless, schemaValidation } = req.body

      const context = payload?.context
      const message = payload?.message

      if (!context || !message) return res.status(400).send({ success: false, error: 'context, message are required' })
      if (!context.domain || !context.core_version || !context.action) {
        return res
          .status(400)
          .send({ success: false, error: 'context.domain, context.core_version, context.action is required' })
      }

      const { domain, core_version, action } = context
      const domainShort = domain.split(':')[1]
      logger.info(`validateSingleAction: domain=${domain}, domainShort=${domainShort}, action=${action}, core_version=${core_version}`)

      await dropDB()
      const msgIdSet = new Set()
      let error: any = {}

      // Reconstruct the full data object like the regular validate endpoint expects
      const fullData = { context, message }

      // Helper: pick schema/business/combined errors from validator buckets
      const pickErrors = (result: any, flag: boolean | undefined) => {
        if (!result || typeof result !== 'object') return {}
        if (flag === true) return result.schemaErrors || {}
        if (flag === false) return result.businessErrors || {}
        if (!result.schemaErrors && !result.businessErrors) {
          return result // Return the flat error object directly
        }
        return { ...(result.schemaErrors || {}), ...(result.businessErrors || {}) }
      }

      switch (core_version) {
        case '1.2.5':
          switch (action) {
            case 'search':
              if (!context.city) {
                error = { fulfillments: 'context.city is required for search' }
                break
              }
              if (context.city != "*") {
                //search full catalog
                logger.info(`validateSingleAction: calling checkSearch125 for domain ${domainShort}`)
                error = checkSearch125(fullData, msgIdSet, flow, topLevelStateless ?? true, undefined)
                logger.info(`validateSingleAction: checkSearch125 result:`, error)
              } else {
                //incremental
                logger.info(`validateSingleAction: calling checkOnsearchIncremental125 for domain ${domainShort}`)
                error = checkSearchIncremental125(fullData, msgIdSet)
                logger.info(`validateSingleAction: checkOnsearchIncremental125 result:`, error)
              }

              break
            case 'on_search':
              if (domainShort === 'RET11') {
                logger.info(`validateSingleAction: calling checkOnSearchRET11 for domain ${domainShort}`)
                error = checkOnSearchRET11(fullData, flow, topLevelStateless ?? true, undefined)
              } else {
                if (context.city != "*") {
                  logger.info(`validateSingleAction: calling checkOnSearch125 for domain ${domainShort}`)
                  error = checkOnSearch125(fullData, flow, topLevelStateless ?? true, undefined)
                } else {
                  logger.info(`validateSingleAction: calling checkOnSearchIncremental125 for domain ${domainShort}`)
                  error = checkOnSearchIncremental125(fullData, msgIdSet)
                }
              }
              logger.info(`validateSingleAction: on_search result:`, error)
              break
            case 'select':
              logger.info(`validateSingleAction: calling checkSelect125 for domain ${domainShort}`)
              error = checkSelect125(fullData, msgIdSet, ApiSequence.SELECT, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkSelect125 result:`, error)
              break
            case 'on_select':
              logger.info(`validateSingleAction: calling checkOnSelect125 for domain ${domainShort}`)
              error = checkOnSelect125(fullData, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkOnSelect125 result:`, error)
              break
            case 'init':
              logger.info(`validateSingleAction: calling checkInit125 for init in domain ${domainShort}`)
              error = checkInit125(fullData, msgIdSet, ApiSequence.INIT, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkInit125 for init result:`, error)
              break
            case 'on_init':
              logger.info(`validateSingleAction: calling checkOnSelect125 for on_init in domain ${domainShort}`)
              error = checkOnInit125(fullData, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkOnSelect125 for on_init result:`, error)
              break
            case 'cancel':
              logger.info(`validateSingleAction: calling checkCancel125 for domain ${domainShort}`)
              error = checkCancel125(fullData, msgIdSet, ApiSequence.CANCEL, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkCancel125 result:`, error)
              break
            case 'on_cancel':
              logger.info(`validateSingleAction: on_cancel action is not implemented yet for domain ${domainShort}`)
              error = checkOnCancel125(fullData, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkOnCancel result:`, error)
              break
            case 'confirm':
              logger.info(`validateSingleAction: calling checkConfirm125 for domain ${domainShort}`)
              error = checkConfirm125(fullData, msgIdSet, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkConfirm result:`, error)
              break
            case 'on_confirm':
              logger.info(`validateSingleAction: calling checkOnConfirm for domain ${domainShort}`)
              error = checkOnConfirm125(fullData, flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkOnConfirm result:`, error)
              break
            case 'on_status':
              logger.info(`validateSingleAction: on_status call for domain ${domainShort}`)
              if (!message.order.fulfillments || !message.order.fulfillments.length) {
                error = { fulfillments: 'message.fulfillments is required for on_status' }
                break
              }
              const fulfillmentState = message.order.fulfillments[0]?.state?.descriptor?.code
              logger.info(`validateSingleAction: on_status with fulfillment state: ${fulfillmentState}`)

              switch (fulfillmentState) {
                case 'Pending':
                  error = checkOnStatusPending125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'Packed': //Check Errors
                  error = checkOnStatusPacked125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'Agent-assigned':
                  error = checkOnStatusAgentAssigned125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'At-pickup':
                  error = checkOnStatusAtPickup125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'Out-for-pickup': //Check Errors
                  error = checkOnStatusOutForPickup125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'Pickup-failed': //Check Errors
                  error = checkOnStatusPickupFailed125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'Order-picked-up': //Check Errors
                  error = checkOnStatusPicked125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'In-transit': //Check Errors
                  error = checkOnStatusInTransit125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'At-destination-hub': //Check Errors
                  error = checkOnStatusAtDestinationHub125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'At-delivery': //Check Errors
                  error = checkOnStatusAtDelivery125(fullData, fulfillmentState, msgIdSet, new Set(), flow, schemaValidation, topLevelStateless ?? true)
                  break
                case 'Out-for-delivery':
                  error = checkOnStatusOutForDelivery125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'Delivery-failed':  //Check Errors
                  error = checkOnStatusDeliveryFailed125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'Order-delivered':
                  error = checkOnStatusDelivered125(fullData, fulfillmentState, msgIdSet, new Set(), schemaValidation, topLevelStateless ?? true)
                  break
                case 'RTO-Delivered':  //Check Errors
                  error = checkOnStatusRTODelivered125(fullData, schemaValidation, topLevelStateless ?? true)
                  break
                default:
                  error = {
                    fulfillmentState: `Unsupported/unimplemented fulfillment state for on_status: ${fulfillmentState}`,
                  }
              }
              logger.info(`validateSingleAction: checkOnStatus result:`, error)
              break
            case 'track':
              logger.info(`validateSingleAction: calling checkTrack125 for domain ${domainShort}`)
              error = checkTrack125(fullData, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkTrack125 result:`, error)
              break
            case 'on_track':
              logger.info(`validateSingleAction: calling checkOnTrack125 for domain ${domainShort}`)
              error = checkOnTrack125(fullData, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkOnTrack125 result:`, error)
              break
            case 'update':
              logger.info(`validateSingleAction: calling checkUpdate125 for domain ${domainShort}`)
              error = checkUpdate125(fullData, msgIdSet, ApiSequence.UPDATE, new Set(), flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkUpdate125 result:`, error)
              break
            case 'on_update':
              logger.info(`validateSingleAction: calling checkUpdate125 for domain ${domainShort}`)
              error = checkOnUpdate125(fullData, msgIdSet, ApiSequence.ON_UPDATE, new Set(), new Set(), new Set(), flow, schemaValidation, topLevelStateless ?? true)
              logger.info(`validateSingleAction: checkUpdate125 result:`, error)
              break
            default:
              return res.status(400).send({ success: false, error: `Unsupported action for retail 1.2.5: ${action}` })
          }
          break
        case '1.2.0':
          switch (action) {
            case 'search':
              error = checkSearch120({ context, message }, msgIdSet)
              break
            case 'on_search':
              error = checkOnSearch120({ context, message })
              break
            default:
              return res.status(400).send({ success: false, error: `Unsupported action for retail 1.2.0: ${action}` })
          }
          break
        default:
          return res.status(400).send({ success: false, error: 'Invalid core_version' })
      }

      // Select errors via helper for clarity
      const chosenErrors = pickErrors(error, schemaValidation)

      if (chosenErrors && Object.keys(chosenErrors).length) return res.status(400).send({ success: false, error: chosenErrors })
      return res.status(200).send({ success: true, error: false })
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, error })
    }
  },
  getValidationFormat: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const upperDomain = req.params.dom
      const { domain, version } = req.query
      if (!domain || !version) return res.status(400).send({ success: false, error: 'domain, version are required' })

      const domainEnum = helper.getEnumForDomain(upperDomain)

      switch (domainEnum) {
        case DOMAIN.FINANCE:
          const format = helper.getFinanceValidationFormat(domain as string, version as string)
          return res.status(200).send({ success: true, response: format })
        default:
          return res.status(400).send({ success: false, error: 'Domain not supported yet' })
      }
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, error: error })
    }
  },
  healthCheck: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      logger.info(req)
      return res.status(200).send({ success: true, status: "OK" })
    }
    catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, status: "fail" })
    }
  }
}

export default controller

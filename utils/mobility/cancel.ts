import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence } from '../../constants'
import { validateSchema, isObjectEmpty, checkMobilityContext, checkBppIdOrBapId, timeDiff } from '../../utils'
import _ from 'lodash'

const CANCEL_CODES = ['CONFIRM_CANCEL']

export const checkCancel = (data: any, msgIdSet: any) => {
  try {
    if (!data || isObjectEmpty(data)) {
      return { [mobilitySequence.ON_CANCEL]: 'Json cannot be empty' }
    }

    const { message, context } = data
    if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
      return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
    }

    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.MOB_CANCEL, data)

    const contextRes: any = checkMobilityContext(context, constants.MOB_CANCEL)
    setValue(`${mobilitySequence.CANCEL}_context`, context)
    setValue(`${mobilitySequence.CANCEL}_message`, message)
    msgIdSet.add(context.message_id)

    const errorObj: any = {}

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!context.bap_id) {
      errorObj['bap_id'] = 'context/bap_id is required'
    } else {
      const checkBap = checkBppIdOrBapId(context.bap_id)
      if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
    }

    if (!context.bpp_id) {
      errorObj['bpp_id'] = 'context/bpp_id is required'
    } else {
      const checkBpp = checkBppIdOrBapId(context.bpp_id)
      if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const searchContext: any = getValue(`${mobilitySequence.SEARCH}_context`)

    try {
      logger.info(`Comparing city of /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        errorObj.city = `City code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing country in /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Storing BAP_ID and BPP_ID in /${constants.MOB_CANCEL}`)
      setValue('bapId', context.bap_id)
      setValue('bppId', context.bpp_id)
    } catch (error: any) {
      logger.error(`!!Error while storing BAP and BPP Ids in /${constants.MOB_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`)
      if (!_.isEqual(searchContext.transaction_id, context.transaction_id)) {
        errorObj.transaction_id = `Transaction Id for /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL} api should be same`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing transaction ids for /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`)
      if (!_.isEqual(searchContext.message_id, context.message_id)) {
        errorObj.message_id = `Message Id for /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL} api should be same`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing message ids for /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}`)
      const tmpstmp = searchContext.context.timestamp
      if (_.gte(tmpstmp, context.timestamp)) {
        errorObj.tmpstmp = `Timestamp for /${constants.MOB_SEARCH} api cannot be greater than or equal to /${constants.MOB_CANCEL} api`
      } else {
        const timeDifference = timeDiff(context.timestamp, tmpstmp)
        logger.info(timeDifference)
        if (timeDifference > 5000) {
          errorObj.tmpstmp = `context/timestamp difference between /${constants.MOB_CANCEL} and /${constants.MOB_SEARCH} should be smaller than 5 sec`
        }
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.MOB_SEARCH} and /${constants.MOB_CANCEL}, ${error.stack}`,
      )
    }

    if (!context.location || !context.location.city || !context.location.country) {
      errorObj['location'] = 'context/location/city and context/location/country are required'
    }

    const cancel: any = data?.message.order

    if (!('order_id' in cancel)) {
      errorObj['order'] = `order_id should be sent in /${constants.MOB_CANCEL}`
    }

    if (!CANCEL_CODES.includes(cancel.descriptor.code)) {
      errorObj[`descriptor.code`] = `Invalid cancel code in descriptor for /${constants.MOB_CANCEL}`
    }

    if (!cancel?.cancellation_reason_id) {
      errorObj[
        'cancellation_reason_id'
      ] = `cancellation_reason_id should be present and valid in /${constants.MOB_CANCEL}`
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

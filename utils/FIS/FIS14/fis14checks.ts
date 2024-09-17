import { getValue, setValue } from 'shared/dao'
import { logger } from 'shared/logger'
import { checkIdAndUri, checkFISContext } from '../../'
import _, { isEmpty } from 'lodash'

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkFISContext(context, curentCall)

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const prevContext: any = getValue(`${pastCall}_context`)
  setValue(`${curentCall}_context`, context)
  msgIdSet.add(context.message_id)

  if (!context.location || !context.location.city || !context.location.country) {
    errorObj['location'] = 'context/location/city and context/location/country are required'
  }

  try {
    logger.info(`Comparing BAP and BPP in /${curentCall}`)

    const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (pastCall !== 'search') {
        if (!_.isEqual(prevContext.bpp_id, context.bpp_id)) {
          errorObj.bppIdContextMismatch = `BPP Id mismatch in /${pastCall} and /${curentCall}`
        }

        if (!_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
          errorObj.bppUriContextMismatch = `BPP URL mismatch in /${pastCall} and /${curentCall}`
        }
      }

      if (!_.isEqual(prevContext.bap_id, context.bap_id)) {
        errorObj.bapIdContextMismatch = `BAP Id mismatch in /${pastCall} and /${curentCall}`
      }

      if (!_.isEqual(prevContext.bap_uri, context.bap_uri)) {
        errorObj.bapUriContextMismatch = `BAP URL mismatch in /${pastCall} and /${curentCall}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing BAP and BPP Ids in /${curentCall}, ${error.stack}`)
  }

  if (prevContext) {
    try {
      logger.info(`Comparing city of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.city, context.location.city)) {
        errorObj.city = `City code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing country in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.transaction_id, context.transaction_id)) {
        errorObj.transaction_id = `Transaction Id for /${pastCall} and /${curentCall} api should be same`
      }
    } catch (error: any) {
      logger.info(`Error while comparing transaction ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
      if (curentCall.startsWith('on_') && curentCall.includes(pastCall)) {
        logger.info(`Comparing Message Ids of /${pastCall} and /${curentCall}`)
        if (!_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be same`
        }
      } else {
        logger.info(`Checking if Message Ids are different for /${pastCall} and /${curentCall}`)
        if (_.isEqual(prevContext.message_id, context.message_id)) {
          errorObj.message_id = `message_id for /${pastCall} and /${curentCall} api should be different`
        }
      }
    } catch (error: any) {
      logger.info(`Error while comparing message ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${pastCall} and /${curentCall}`)
      const tmpstmp = prevContext.timestamp
      if (_.gte(tmpstmp, context.timestamp)) {
        errorObj.tmpstmp = `Timestamp for /${curentCall} api should be greater than timestamp of /${pastCall} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(`!!Error while comparing timestamp for /${pastCall} and /${curentCall}, ${error.stack}`)
    }
  }

  if (_.isEmpty(errorObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errorObj }
    return result
  }
}

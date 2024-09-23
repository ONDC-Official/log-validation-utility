import { logger } from '../../../shared/logger'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
// import { validateContext, validateXInputSubmission } from './fis14Checks'
import { validateContext } from './fis14checks'
import _ from 'lodash'
import {  setValue } from '../../../shared/dao'



export const checkSearch = (data: any, msgIdSet: any, flow: string, action: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [action]: 'JSON cannot be empty' }
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }
    console.log(flow);
    

    const { context, message } = data
    msgIdSet.add(context.message_id)

    // validate schema
    const schemaValidation = validateSchema('FIS', constants.SEARCH, data)
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // validate context
    let contextRes: any
    if (action?.includes('_offer')) {
      // if action is search_offer, validate context with bpp & bap details
      contextRes = validateContext(context, msgIdSet, action, constants.SEARCH)
    } else {
      // if action is search, validate context with only bap details
      contextRes = checkFISContext(data.context, action)
      setValue(`${action}_context`, data.context)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    const search = message.order

    // validate message
    try {
      // validate category
      logger.info(`Validating category in /${action}`)
      const code = message.intent?.category?.descriptor?.code
      if (code) {
        if (code != "MUTUAL_FUNDS") {
          errorObj['category'] = `code value should be MUTUAL FUNDS, in a standard enum format as at category.descriptor`
        }
      } else
        errorObj['category'] = `code: ${
          "code must be present at catagory"
        } must be present at category.descriptor`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${action},  ${error.message}`)
    }

    // validate payments
  

    // checking providers
  // check fullfillment
  try {
    logger.info(`Validating fulfillments array in /${constants.SEARCH}`)
    const fulfillments = search?.fulfillments
    if (!fulfillments) {
      errorObj.fulfillments = `fulfillments is missing at /${constants.SEARCH}`
    } else {
      fulfillments?.map((fulfillment: any, i: number) => {
        if (!fulfillment?.type) {
          errorObj[`fulfillments[${i}].type`] =
            `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_INIT}`
        }
      
        if (!fulfillment?.stops?.time?.schedule?.frequency) {
          errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
            `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.ON_INIT}`
        }
        if (!fulfillment?.customer?.person?.id) {
          errorObj[`fulfillments[${i}].customer.person.id`] =
            `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.ON_INIT}`
        }
        if (!fulfillment?.agent) {
          errorObj[`fulfillments[${i}].agent`] =
            `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.ON_INIT}`
        }
      })
    }
  } catch (error: any) {
    logger.error(`!!Error while checking fulfillments array in /${constants.ON_INIT}, ${error.stack}`)
  }

  }
  catch (error: any) {
    logger.error(`!!Error while checking confirm details in /${constants.ON_CONFIRM}`, error.stack)
    return { error: error.message }
  }
}

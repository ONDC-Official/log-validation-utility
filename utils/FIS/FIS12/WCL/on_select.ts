import { logger } from '../../../../shared/logger'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations'

export const checkon_selectWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_SELECT]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.order ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.order)
    ) {
      errorObj['missingFields'] = '/context, /message, /order or /message/order is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.ON_SELECT, data)
    const contextRes: any = checkFISContext(data.context, constants.ON_SELECT)
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation - this is an on_action call
    const messageIdPair = validateMessageIdPair(data.context, constants.ON_SELECT, true)
    Object.assign(errorObj, messageIdPair)
    
    // Save message ID to check for uniqueness
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Additional validation logic can be added here

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

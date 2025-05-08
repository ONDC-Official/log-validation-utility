import { logger } from '../../../../shared/logger'
import { setValue} from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations'

export const checkcancelWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.CANCEL]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.order_id ||
      !data.message.cancellation_reason_id
    ) {
      errorObj['missingFields'] = '/context, /message, /order_id or /cancellation_reason_id is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.CANCEL, data)
    const contextRes: any = checkFISContext(data.context, constants.CANCEL)
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context)
    Object.assign(errorObj, transactionIdConsistency)
    
    // Add message ID pair validation
    const messageIdPair = validateMessageIdPair(data.context, constants.CANCEL, false)
    Object.assign(errorObj, messageIdPair)
    
    // Save message ID to check for uniqueness
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Validate cancellation details
    if (!data.message.descriptor?.short_desc) {
      errorObj['message.descriptor.short_desc'] = 'Cancellation description is required'
    }
    
    // Store order ID for cross-validation with on_cancel
    setValue('cancelled_order_id', data.message.order_id)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

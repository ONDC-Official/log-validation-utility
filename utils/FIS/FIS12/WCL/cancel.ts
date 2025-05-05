import { logger } from '../../../../shared/logger'
import { setValue} from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils'
import { validateCancellationDetails, validateTransactionConsistency } from './commonValidations'

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
      isObjectEmpty(data.message)
    ) {
      errorObj['missingFields'] = '/context or /message is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.CANCEL, data)
    const contextRes: any = checkFISContext(data.context, constants.CANCEL)
    
    setValue(`${constants.CANCEL}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Validate cancellation details
    const cancellationErrors = validateCancellationDetails(data.message)
    Object.assign(errorObj, cancellationErrors)
    
    // Validate transaction consistency
    const transactionErrors = validateTransactionConsistency(data.context)
    Object.assign(errorObj, transactionErrors)
    
    // Store order ID for cross-validation
    setValue('cancelled_order_id', data.message.order_id)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

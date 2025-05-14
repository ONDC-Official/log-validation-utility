import { logger } from '../../../../shared/logger'
import { setValue} from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../..'
import { validateMessageId, validatePaymentTags } from './commonValidations'

export const on_initPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.ON_INIT]: 'JSON cannot be empty' }
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

    const schemaValidation = validateSchema('FIS12_PF', constants.ON_INIT, data)
    const contextRes: any = checkFISContext(data.context, constants.ON_INIT)
    
    setValue(`${constants.ON_INIT}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    // Message ID validation
    const messageIdErrors = validateMessageId(data.context, msgIdSet)
    if (Object.keys(messageIdErrors).length > 0) {
      Object.assign(errorObj, messageIdErrors)
    }

    // Context validation
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    // Schema validation
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Validate payment tags if payments exist
    const { order } = data.message
    if (order.payments && Array.isArray(order.payments)) {
      order.payments.forEach((payment: any) => {
        const paymentTagErrors = validatePaymentTags(payment)
        if (Object.keys(paymentTagErrors).length > 0) {
          Object.assign(errorObj, paymentTagErrors)
        }
      })
    }

    // Store order for future validations
    setValue(`${constants.ON_INIT}_order`, order)

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

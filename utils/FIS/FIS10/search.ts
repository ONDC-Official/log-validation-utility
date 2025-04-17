import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SEARCH]: 'JSON cannot be empty' }
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

    const { context, message } = data
    msgIdSet.add(context.message_id)

    // validate schema
    const schemaValidation = validateSchema('FIS10', constants.SEARCH, data)
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // validate context
    const contextRes: any = checkFISContext(data.context, constants.SEARCH)
    setValue(`${constants.SEARCH}_context`, data.context)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    // validate message
    // validate category & item
    try {
      logger.info(`Validating category & item in /${constants.SEARCH}`)
      const code = message.intent?.category?.descriptor?.code
      const name = message.intent?.item?.descriptor?.name
      if (!code && !name)
        errorObj['intent'] = `either of item or category should be present in /${constants.SEARCH} call`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category or item in /${constants.SEARCH},  ${error.message}`)
    }

    // validate payments
    try {
      logger.info(`Validating payments in /${constants.SEARCH}`)
      const payment = message.intent?.payment

      // Validate payment tags
      const validDescriptorCodes = ['BUYER_FINDER_FEES']
      const tagsValidation = validatePaymentTags(payment.tags, [], validDescriptorCodes)
      console.log('tagsValidation', tagsValidation)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      console.log('error', error)
      logger.error(`!!Error occcurred while validating payments in /${constants.SEARCH},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

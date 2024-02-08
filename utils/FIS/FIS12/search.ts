import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any, flow: string) => {
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

    const schemaValidation = validateSchema(data?.context?.domain.split(':')[1], constants.SEARCH, data)
    const contextRes: any = checkFISContext(data.context, constants.SEARCH)

    setValue(`${constants.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    try {
      logger.info(`Validating category in /${constants.SEARCH}`)
      const code = data.message.intent?.category?.descriptor?.code
      if (code) {
        if (code != fisFlows[flow as keyof typeof fisFlows]) {
          errorObj['category'] = `code must be in a standard enum format as ${
            fisFlows[flow as keyof typeof fisFlows]
          } at category.descriptor`
        }

        setValue(`LoanType`, code)
      } else
        errorObj['category'] = `code: ${fisFlows[flow as keyof typeof fisFlows]} must be present at category.descriptor`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${constants.SEARCH},  ${error.message}`)
    }

    try {
      logger.info(`Validating payments in /${constants.SEARCH}`)
      const payment = data.message.intent?.payment
      const collectedBy = payment?.collected_by

      if (!collectedBy) {
        errorObj[`collected_by`] = `payment.collected_by must be present in ${constants.SEARCH}`
      } else if (collectedBy !== 'BPP' && collectedBy !== 'BAP') {
        errorObj['collected_by'] = `payment.collected_by can only be either 'BPP' or 'BAP' in ${constants.SEARCH}`
      } else {
        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.SEARCH},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

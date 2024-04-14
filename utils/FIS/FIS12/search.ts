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

    const schemaValidation = validateSchema('FIS', constants.SEARCH, data)
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
          errorObj[
            'category'
          ] = `code must be in a standard enum format as PERSONAL_LOAN or INVOICE_BASED_LOAN at category.descriptor`
        }

        setValue(`LoanType`, code)
      } else
        errorObj['category'] = `code: ${fisFlows[flow as keyof typeof fisFlows]} must be present at category.descriptor`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${constants.SEARCH},  ${error.message}`)
    }

    // validate payments
    try {
      logger.info(`Validating payments in /${constants.SEARCH}`)
      const payment = data?.message.intent?.payment
      const collectedBy = payment?.collected_by
      const allowedCollectedByValues = ['BPP', 'BAP']
      const terms: any = [
        { code: 'STATIC_TERMS', type: 'url' },
        {
          code: 'OFFLINE_CONTRACT',
          type: 'boolean',
        },
      ]

      if (!collectedBy) {
        errorObj[`collected_by`] = `payment.collected_by must be present in ${constants.SEARCH}`
      } else if (!allowedCollectedByValues.includes(collectedBy)) {
        errorObj['collected_by'] = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
      } else {
        if (collectedBy == 'BPP') terms?.push({ code: 'DELAY_INTEREST', type: 'amount' })
        else {
          terms?.push({ code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' })
          terms?.push({
            code: 'SETTLEMENT_BASIS',
            type: 'enum',
            value: ['INVOICE_RECEIPT', 'Delivery'],
          })
        }

        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags, terms)
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

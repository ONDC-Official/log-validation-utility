import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
import { validatePaymentTags } from './tags'

export const search = (data: any, msgIdSet: any, flow: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[FisApiSequence.SEARCH] = 'Json cannot be empty'
      return
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

    const schemaValidation = validateSchema(data?.context?.domain.split(':')[1], constants.FIS_SEARCH, data)
    const contextRes: any = checkFISContext(data.context, constants.FIS_SEARCH)

    setValue(`${FisApiSequence.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    try {
      logger.info(`Validating category object for /${constants.FIS_SEARCH}`)
      const code = data.message.intent?.category?.descriptor?.code
      if (code) {
        console.log('fisFlows[flow as keyof typeof fisFlows]', fisFlows[flow as keyof typeof fisFlows], code)
        if (code != fisFlows[flow as keyof typeof fisFlows]) {
          errorObj['category'] = {
            category: {
              descriptor: {
                code: `Category descriptor code must be in a standard enum format as ${
                  fisFlows[flow as keyof typeof fisFlows]
                }`,
              },
            },
          }
        }

        setValue(`LoanType`, code)
      } else
        errorObj['category'] = {
          category: {
            descriptor: {
              code: `Category descriptor code ${fisFlows[flow as keyof typeof fisFlows]} must be present in ${
                FisApiSequence.SEARCH
              }`,
            },
          },
        }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${constants.FIS_SEARCH},  ${error.message}`)
    }

    try {
      logger.info(`Validating payments object for /${constants.FIS_SEARCH}`)
      const payment = data.message.intent?.payment
      const collectedBy = payment?.collected_by

      if (!collectedBy) {
        errorObj[`collected_by`] = `payment.collected_by must be present in ${FisApiSequence.SEARCH}`
      } else if (collectedBy !== 'BPP' && collectedBy !== 'BAP') {
        errorObj['collected_by'] = `payment.collected_by can only be either 'BPP' or 'BAP' in ${FisApiSequence.SEARCH}`
      } else {
        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags)
      console.log('tagsValidation', tagsValidation)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.FIS_SEARCH},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

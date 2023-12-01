import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'

export const search = (data: any, msgIdSet: any, flow: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      errorObj[FisApiSequence.SEARCH] = 'Json cannot be empty'
      return
    }

    console.log('flow', flow)
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

    msgIdSet.add(data.context.message_id)

    const schemaValidation = validateSchema(data?.context?.domain.split(':')[1], constants.FIS_SEARCH, data)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    const contextRes: any = checkFISContext(data.context, constants.FIS_SEARCH)
    setValue(`${FisApiSequence.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const code = data.message.intent?.category?.descriptor?.code

    if (code) {
      if (code !== fisFlows[flow as keyof typeof fisFlows]) {
        errorObj['intent'] = {
          category: {
            descriptor: {
              code: `Category descriptor code must be same as ${fisFlows[flow as keyof typeof fisFlows]} in ${
                FisApiSequence.SEARCH
              }`,
            },
          },
        }
      }

      setValue(`LoanType`, code)
    } else
      errorObj['intent'] = {
        category: {
          descriptor: {
            code: `Category descriptor code must be present in ${FisApiSequence.SEARCH}`,
          },
        },
      }

    if (!data.message.intent?.payment?.collected_by) {
      errorObj['collected_by'] = `payment.collected_by must be present in ${FisApiSequence.SEARCH}`
    } else {
      setValue(`collected_by`, data.message.intent?.payment?.collected_by)
    }

    if (!data.message.intent?.payment?.tags?.some((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')) {
      errorObj['intent'] = {
        tags: `BUYER_FINDER_FEES tag must be present in payment inside ${FisApiSequence.SEARCH}`,
      }
    }

    if (!data.message.intent?.payment?.tags?.some((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')) {
      errorObj['intent'] = {
        tags: `SETTLEMENT_TERMS tag must be present in payment inside ${FisApiSequence.SEARCH}`,
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

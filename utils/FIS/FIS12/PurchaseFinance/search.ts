import { logger } from '../../../../shared/logger'
import { setValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../..'
// import { validatePaymentTags } from '.././tags'
// import { isEmpty } from 'lodash'
// import { validateXInputSubmission } from '.././fisChecks'

export const searchPurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SEARCH]: 'JSON cannot be empty' }
    }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

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

    const schemaValidation = validateSchema('FIS_WCL', constants.SEARCH, data)
    const contextRes: any = checkFISContext(data.context, constants.SEARCH)
    // const code = data.message.intent?.category?.descriptor?.code
    // const LoanType = getValue(`LoanType`)
    setValue(`${constants.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // validate payments


    // checking providers

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

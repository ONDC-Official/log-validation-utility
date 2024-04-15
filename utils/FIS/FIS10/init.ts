import _ from 'lodash'
import constants from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty } from '../../'
import { getValue, setValue } from '../../../shared/dao'
import { validateBapFulfillments, validateBapItems, validateBillingObject, validateContext } from './fisChecks'

export const checkInit = (data: any, msgIdSet: any) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.INIT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SELECT, constants.INIT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    const init = message.order

    // check provider
    try {
      logger.info(`Validating provider object for /${constants.INIT}`)
      const selectedProviderId = getValue('selectedProviderId')
      const providerId = init?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.INIT}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.INIT} does'nt matches with the selected id ${selectedProviderId}`
        setValue('selectedProviderId', providerId)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.INIT}, ${error.stack}`)
    }

    //check fulfillments
    try {
      logger.info(`Checking fulfillments in /${constants.INIT}`)
      const fulfillmentErrors = validateBapFulfillments(init?.fulfillments, constants.INIT)
      Object.assign(errorObj, fulfillmentErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking fulfillments in /${constants.INIT}, ${error.stack}`)
    }

    //check items
    try {
      logger.info(`Checking items in /${constants.INIT}`)
      const itemsErrors = validateBapItems(init?.items, constants.INIT, false)
      Object.assign(errorObj, itemsErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking items in /${constants.INIT}, ${error.stack}`)
    }

    //check billing
    try {
      logger.info(`Checking billing in /${constants.INIT}`)
      const billingErrors = validateBillingObject(init?.billing, constants.INIT)
      Object.assign(errorObj, billingErrors)
    } catch (error: any) {
      logger.error(`!!Errors while checking billing in /${constants.INIT}, ${error.stack}`)
    }

    return errorObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
    return { error: err.message }
  }
}

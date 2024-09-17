import { logger } from 'shared/logger'
import _, { isEmpty } from 'lodash'
import constants from '../../../constants'
import { validateSchema } from 'utils'
import { validateContext, isValidPhoneNumber } from './fis14checks'
import { getValue, setValue } from 'shared/dao'

export const checkInit = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isEmpty(data)) {
      return { [constants.INIT]: 'JSON cannot be empty' }
    }
    const { message, context }: any = data
    if (!message || !context || !message.order || isEmpty(message) || isEmpty(message.order)) {
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
    // check items
    try {
      logger.info(`Validating items array in /${constants.INIT}`)
      const items = init?.items
      if (!items) {
        errorObj.items = `items is missing at /${constants.INIT}`
      } else {
        items?.map((item: any, i: number) => {
          if (!item?.id) {
            errorObj[`items[${i}].id`] = `items[${i}].id is missing in /${constants.INIT}`
          }
          if (!item?.quantity) {
            errorObj[`items[${i}].quantity`] = `items[${i}].quantity is missing in /${constants.INIT}`
          }
          if (!item?.price) {
            errorObj[`items[${i}].fulfillment_ids`] = `items[${i}].fulfillment_ids is missing in /${constants.INIT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.INIT}, ${error.stack}`)
    }

    // check fulfillments
    try {
      logger.info(`Validating fulfillments array in /${constants.INIT}`)
      const fulfillments = init?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.INIT}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone)) {
            errorObj[`fulfillments[${i}].contact.phone`] =
              `contact.phone should be present with valid value in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.stops?.time?.schedule?.frequency) {
            errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
              `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.customer?.person?.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] =
              `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.INIT}`
          }
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.INIT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.INIT}, ${error.stack}`)
    }

    // check payment
    try {
      logger.info(`Checking payments in /${constants.INIT}`)
      const payments = init?.payments
      if (isEmpty(payments)) {
        errorObj.payments = `payments array is missing or is empty`
      } else {
        payments?.map((payment: any, i: number) => {
          if (!payment?.type) {
            errorObj[`payments[${i}].type`] = `payments[${i}].type is missing in /${constants.INIT}`
          }
          if (!payment.collected_by) {
            errorObj[`payments[${i}].collected_by`] = `payments[${i}].collected_by is missing in /${constants.INIT}`
          }
          if (!payment.params.source_bank_code) {
            errorObj[`payments[${i}].params.source_bank_code`] =
              `payments[${i}].params.source_bank_code is missing in /${constants.INIT}`
          }
          if (!payment.params.source_bank_account_number) {
            errorObj[`payments[${i}].params.source_bank_account_number`] =
              `payments[${i}].params.source_bank_account_number is missing in /${constants.INIT}`
          }
          if (!!payment.params.source_bank_account_name) {
            errorObj[`payments[${i}].params.source_bank_account_name`] =
              `payments[${i}].params.source_bank_account_name is missing in /${constants.INIT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Errors while checking payments in /${constants.INIT}, ${error.stack}`)
    }

    // check tags
    try {
      logger.info(`Checking tags in /${constants.INIT}`)
      const tags = init?.tags
      if (isEmpty(tags)) {
        errorObj.tags = `tags array is missing or is empty`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking tags in /${constants.INIT}, ${error.stack}`)
    }
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking provider object for /${constants.INIT}, ${error.stack}`)
    return { error: error.message }
  }
}

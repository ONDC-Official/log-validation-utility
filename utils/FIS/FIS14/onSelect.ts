import { logger } from '../../../shared/logger'
import _, { isEmpty } from 'lodash'
import constants from '../../../constants'
import { validateSchema } from '../..'

import { validateContext } from './fis14checks'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnSelect = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  console.log('sequence', sequence)
  try {
    if (!data || isEmpty(data)) {
      return { [constants.ON_SELECT]: 'JSON cannot be empty' }
    }
    const { message, context }: any = data
    if (!message || !context || !message.order || isEmpty(message) || isEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_SELECT, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SELECT, constants.ON_SELECT)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    const on_select = message.order

    // check provider
    try {
      logger.info(`Validating provider object for /${constants.ON_SELECT}`)
      const selectedProviderId = getValue('selectedProviderId')
      const providerId = on_select?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.ON_SELECT}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.ON_SELECT} does'nt matches with the selected id ${selectedProviderId}`
        setValue('selectedProviderId', providerId)
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.ON_SELECT}, ${error.stack}`)
    }
    // check items
    try {
      logger.info(`Validating items array in /${constants.ON_SELECT}`)
      const items = on_select?.items
      if (!items) {
        errorObj.items = `items is missing at /${constants.ON_SELECT}`
      } else {
        items?.map((item: any, i: number) => {
          if (!item?.id) {
            errorObj[`items[${i}].id`] = `items[${i}].id is missing in /${constants.ON_SELECT}`
          }
          if (!item?.quantity) {
            errorObj[`items[${i}].quantity`] = `items[${i}].quantity is missing in /${constants.ON_SELECT}`
          }
          // if (!item?.price) {
          //   errorObj[`items[${i}].fulfillment_ids`] =
          //     `items[${i}].fulfillment_ids is missing in /${constants.ON_SELECT}`
          // }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.ON_SELECT}, ${error.stack}`)
    }

    // check fulfillments
    try {
      logger.info(`Validating fulfillments array in /${constants.ON_SELECT}`)
      const fulfillments = on_select?.fulfillments
      if (!fulfillments) {
        errorObj.fulfillments = `fulfillments is missing at /${constants.ON_SELECT}`
      } else {
        fulfillments?.map((fulfillment: any, i: number) => {
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_SELECT}`
          }
          // if (!fulfillment?.contact?.phone || !isValidPhoneNumber(fulfillment?.contact?.phone)) {
          //   errorObj[`fulfillments[${i}].contact.phone`] =
          //     `contact.phone should be present with valid value in fulfillment${i} at /${constants.ON_SELECT}`
          // }
          if (!fulfillment?.stops) {
            errorObj[`fulfillments[${i}].stops`] =
              `fulfillment[${i}].stops should be present in fulfillment${i} at /${constants.ON_SELECT}`
          }
          fulfillment?.stops.map((stop: any) => {
            if (!stop?.time?.schedule?.frequency) {
              errorObj[`fulfillments[${i}].stops.time.schedule.frequency`] =
                `fulfillment[${i}].stops.time.schedule.frequency should be present in fulfillment${i} at /${constants.SELECT}`
            }
          })
          if (!fulfillment?.customer?.person?.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] =
              `fulfillment[${i}].customer.person.id should be present in fulfillment${i} at /${constants.ON_SELECT}`
          }
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent should be present in fulfillment${i} at /${constants.ON_SELECT}`
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.ON_SELECT}, ${error.stack}`)
    }

    // check tags
    try {
      logger.info(`Checking tags in /${constants.ON_SELECT}`)
      const tags = on_select?.tags
      if (isEmpty(tags)) {
        errorObj.tags = `tags array is missing or is empty`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking tags in /${constants.ON_SELECT}, ${error.stack}`)
    }
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking provider object for /${constants.ON_SELECT}, ${error.stack}`)
    return { error: error.message }
  }
}

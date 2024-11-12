import { logger } from '../../../shared/logger'
import _, { isEmpty } from 'lodash'
import constants from '../../../constants'
import { validateSchema } from '../..'

import { checkFullfillementType, validateContext } from './fis14checks'
import { getValue, setValue } from '../../../shared/dao'

export const checkonSearch = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  console.log('sequence', sequence)
  try {
    if (!data || isEmpty(data)) {
      return { [constants.ON_SEARCH]: 'JSON cannot be empty' }
    }
    const { message, context }: any = data
    if (!message || !context || !message.catalog || isEmpty(message) || isEmpty(message.catalog)) {
      return { missingFields: '/context, /message, /catlog or /message/catlog is missing or empty' }
    }

    const schemaValidation = validateSchema('FIS', constants.ON_SEARCH, data)
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.ON_SEARCH)

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    let on_search = message.catalog

    on_search = on_search?.providers

    if (!on_search) {
      errorObj.providers = 'providers object is missing'
    }

    on_search.map((provider: any) => {
      try {
        logger.info(`Validating provider object for /${constants.ON_SEARCH}`)
        const selectedProviderId = getValue('selectedProviderId')
        const providerId = provider?.id

        if (!providerId) {
          errorObj.prvdrId = `provider.id is missing in /${constants.ON_SEARCH}`
        } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
          errorObj.prvdrId = `provider.id: ${providerId} in /${constants.ON_SEARCH} does'nt matches with the selected id ${selectedProviderId}`
          setValue('selectedProviderId', providerId)
        }
      } catch (error: any) {
        logger.error(`!!Error while checking provider object for /${constants.ON_SEARCH}, ${error.stack}`)
      }

      // check items
      try {
        logger.info(`Validating items array in /${constants.ON_SEARCH}`)
        const items = provider?.items
        if (!items) {
          errorObj.items = `items is missing at /${constants.ON_SEARCH}`
        } else {
          items?.map((item: any, i: number) => {
            if (!item?.id) {
              errorObj[`items[${i}].id`] = `items[${i}].id is missing in /${constants.ON_SEARCH}`
            }
            if (!item.descriptor) {
              errorObj[`items[${i}].descriptor`] = `items[${i}].descriptor is missing in /${constants.ON_SEARCH}`
            }
            if (!item.descriptor.name) {
              errorObj[`items[${i}].descriptor.name`] =
                `items[${i}].descriptor.name is missing in /${constants.ON_SEARCH}`
            }
            if (!item.descriptor.code) {
              errorObj[`items[${i}].descriptor.code`] =
                `items[${i}].descriptor.code is missing in /${constants.ON_SEARCH}`
            }
            if (!item?.category_ids) {
              errorObj[`items[${i}].category_ids`] = `items[${i}].category_ids is missing in /${constants.ON_SEARCH}`
            }
            if (!item.matched) {
              errorObj[`items[${i}].matched`] = `items[${i}].matched is missing in /${constants.ON_SEARCH}`
            }
            if (!item?.tags) {
              errorObj[`items[${i}].tags`] = `items[${i}].tags is missing in /${constants.ON_SEARCH}`
            }
          })
        }
      } catch (error: any) {
        logger.error(`!!Error while checking items array in /${constants.ON_SEARCH}, ${error.stack}`)
      }

      // check fulfillments
      try {
        logger.info(`Validating fulfillments array in /${constants.ON_SEARCH}`)
        const fulfillments = provider?.fulfillments
        if (!fulfillments) {
          errorObj.fulfillments = `fulfillments is missing at /${constants.ON_SEARCH}`
        } else {
          fulfillments?.map((fulfillment: any, i: number) => {
            if (!fulfillment?.type) {
              errorObj[`fulfillments[${i}].type`] =
                `fulfillment[${i}].type should be present in fulfillment${i} at /${constants.ON_SEARCH}`
            } else {
              const obj = checkFullfillementType(fulfillment?.type, sequence as any)
              if (Object.keys(obj).length > 0) {
                errorObj.typeError = obj
              }
            }
            if (!fulfillment?.id) {
              errorObj[`fulfillments[${i}].id`] =
                `fulfillment[${i}].id should be present in fulfillment${i} at /${constants.ON_SEARCH}`
            }
          })
        }
      } catch (error: any) {
        logger.error(`!!Error while checking fulfillments array in /${constants.ON_SEARCH}, ${error.stack}`)
      }
    })

    on_search = message.catalog
    // check tags
    try {
      logger.info(`Checking tags in /${constants.ON_SEARCH}`)
      const tags = on_search?.tags
      if (isEmpty(tags)) {
        errorObj.tags = `tags array is missing or is empty`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking tags in /${constants.ON_SEARCH}, ${error.stack}`)
    }
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking provider object for /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }
}

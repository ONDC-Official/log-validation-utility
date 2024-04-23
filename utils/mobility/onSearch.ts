import { logger } from '../../shared/logger'
import { getValue, setValue } from '../../shared/dao'
import constants, { mobilitySequence, ON_DEMAND_VEHICLE } from '../../constants'
import { validateSchema, isObjectEmpty, checkSixDigitGpsPrecision } from '../../utils'
import { validateContext, validateItemRefIds, validateStops, validatePayloadAgainstSchema } from './mobilityChecks'
import attributeConfig from './config/config2.0.1.json'
import { validatePaymentTags } from './tags'
import { isEmpty } from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any, version: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [mobilitySequence.ON_SEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)
  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SEARCH, data)
  setValue(`${mobilitySequence.ON_SEARCH}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const storedLocations = new Set()
  const storedFulfillments = new Set()

  // descriptor.name
  if (!onSearchCatalog?.descriptor || !onSearchCatalog?.descriptor?.name) {
    errorObj['descriptor_name'] = 'message/catalog/descriptor/name is missing'
  }

  //provider
  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog?.providers
    const len = bppPrvdrs.length
    while (i < len) {
      //provider id checks
      const key = `provider[${i}]`
      if (!bppPrvdrs[i]?.id) errorObj[key] = `provider.id is missing for index: ${i}`
      else if (prvdrsId.has(bppPrvdrs[i].id)) {
        errorObj[key] = `duplicate provider id: ${bppPrvdrs[i].id} in providers[${i}]`
      } else {
        prvdrsId.add(bppPrvdrs[i].id)
      }

      //provider fulfillments checks
      const fulfillments = bppPrvdrs[i]['fulfillments']
      if (!fulfillments || fulfillments.length === 0) {
        errorObj[`provider_${i}_fulfillments`] = `Fulfillments is missing or empty for provider ${i}`
      } else {
        fulfillments.forEach((fulfillment: any, k: number) => {
          const key = `prvdr${i}fulfillment${k}`
          if (!fulfillment?.id) {
            errorObj[key] = `id is missing in fulfillments[${k}]`
          } else if (storedFulfillments.has(fulfillment.id)) {
            errorObj[key] = `duplicate fulfillment id: ${fulfillment.id} in providers[${i}]`
          } else {
            storedFulfillments.add(fulfillment.id)
          }

          if (!ON_DEMAND_VEHICLE.includes(fulfillment.vehicle.category)) {
            errorObj[`${key}.vehicleCategory`] = `Vehicle category should be one of ${ON_DEMAND_VEHICLE}`
          }

          if (fulfillment.type !== 'DELIVERY') {
            errorObj[`${key}.type`] = `Fulfillment type must be DELIVERY at index ${i} in /${constants.ON_SEARCH}`
          }

          // Check stops for START and END, or time range with valid timestamp and GPS
          const otp = false
          const cancel = false
          const stopsError = validateStops(fulfillment?.stops, i, otp, cancel)
          if (!stopsError?.valid) Object.assign(errorObj, stopsError?.errors)
        })
      }

      //location checks
      const locations = bppPrvdrs[i]['locations']
      if (locations && locations.length > 0) {
        locations.forEach((location: any, j: number) => {
          storedLocations.add(location.id)

          if (!checkSixDigitGpsPrecision(location.gps)) {
            errorObj[`provider_${i}_location_${j}_gpsPrecision`] =
              'GPS coordinates must be specified with at least six decimal places of precision'
          }
        })
      }

      //items checks
      try {
        logger.info(`Validating items object for /${constants.ON_SEARCH}`)
        const items = bppPrvdrs[i]['items']
        if (!items) errorObj.items = `items is missing in /${constants.ON_SEARCH}`
        else {
          items.forEach((item: any, index: number) => {
            const itemKey = `items[${index}]`
            //id checks
            if (!item?.id) {
              errorObj[itemKey] = `id is missing in [${itemKey}]`
            } else if (itemsId.has(item.id)) {
              errorObj[itemKey] = `duplicate item id: ${item.id} in item[${index}]`
            } else {
              itemsId.add(item.id)
            }

            //price check
            if (!item?.price?.value) errorObj[`${itemKey}.price`] = `value is missing at item.index ${index} `

            //fulfillment_ids, location_ids & payment_ids checks
            const refIdsErrors = validateItemRefIds(
              item,
              constants.ON_SEARCH,
              index,
              storedFulfillments,
              storedLocations,
              new Set(),
            )
            Object.assign(errorObj, refIdsErrors)

            //descriptor.code
            if (!item?.descriptor?.code)
              errorObj[`${itemKey}.code`] = `descriptor.code is missing at index: ${index} in /${constants.ON_SEARCH}`
            else if (item?.descriptor?.code !== 'RIDE') {
              errorObj[
                `${itemKey}.code`
              ] = `descriptor.code must be RIDE at item.index ${index} in /${constants.ON_SEARCH}`
            }
          })
        }
      } catch (error: any) {
        logger.error(`!!Error occcurred while checking items info in /${constants.ON_SEARCH},  ${error.message}`)
        return { error: error.message }
      }

      // check provider payments
      try {
        logger.info(`Checking payments in providers[${i}]`)
        const payments = bppPrvdrs[i]['payments']
        if (isEmpty(payments)) {
          errorObj.payments = `payments array is missing or empty`
        } else {
          payments?.forEach((arr: any, i: number) => {
            const terms = [
              { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
              {
                code: 'SETTLEMENT_BASIS',
                type: 'enum',
                value: ['INVOICE_RECEIPT', 'Delivery'],
              },
              { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
              { code: 'STATIC_TERMS', type: 'url' },
              { code: 'COURT_JURISDICTION', type: 'string' },
              { code: 'DELAY_INTEREST', type: 'amount' },
              {
                code: 'SETTLEMENT_TYPE',
                type: 'enum',
                value: ['upi', 'neft', 'rtgs'],
              },
            ]

            if (!arr?.collected_by) {
              errorObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by must be present in ${constants.ON_SEARCH}`
            } else {
              const srchCollectBy = getValue(`collected_by`)
              if (srchCollectBy != arr?.collected_by)
                errorObj[
                  `payemnts[${i}]_collected_by`
                ] = `payments.collected_by value sent in ${constants.ON_SEARCH} should be same as sent in ${constants.SEARCH}: ${srchCollectBy}`
            }

            // Validate payment tags
            const tagsValidation = validatePaymentTags(arr.tags, terms)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { tags: tagsValidation.errors })
            }
          })
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking payments in providers[${i}], ${error.stack}`)
      }

      i++
    }

    if (version === '2.0.1') {
      const additionalAttributes: any = attributeConfig.on_search
      validatePayloadAgainstSchema(additionalAttributes, data, errorObj, '', '')
    }

    setValue(`providerIds`, prvdrsId)
    setValue(`${mobilitySequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${mobilitySequence.ON_SEARCH}_itemsId`, itemsId)
    setValue(`locationIds`, storedLocations)
    setValue(`${mobilitySequence.ON_SEARCH}_storedFulfillments`, Array.from(storedFulfillments))
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

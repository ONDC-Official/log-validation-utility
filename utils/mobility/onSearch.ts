import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import constants, {
  mobilitySequence,
  MOB_VEHICLE_CATEGORIES as VALID_VEHICLE_CATEGORIES,
  MOB__DESCRIPTOR_CODES as VALID_DESCRIPTOR_CODES,
} from '../../constants'
import { validateSchema, isObjectEmpty, checkGpsPrecision, timestampCheck } from '../../utils'
import { validateContext } from './mobilityChecks'
import { validatePaymentTags } from './tags'

export const checkOnSearch = (data: any, msgIdSet: any) => {
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

  if (!onSearchCatalog.descriptor || !onSearchCatalog.descriptor.name) {
    errorObj['descriptor_name'] = 'message/catalog/descriptor/name is missing'
  }

  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    while (i < len) {
      const fulfillments = onSearchCatalog['providers'][i]['fulfillments']

      if (!fulfillments || fulfillments.length === 0) {
        errorObj[`provider_${i}_fulfillments`] = `Fulfillments are missing for provider ${i}`
      } else {
        fulfillments.forEach((fulfillment: any, k: number) => {
          if (storedFulfillments.has(fulfillment.id)) {
            const key = `prvdr${i}fulfillment${k}`
            errorObj[key] = `duplicate fulfillment id: ${fulfillment.id} in providers[${i}]`
          } else {
            storedFulfillments.add(fulfillment.id)
          }

          if (fulfillment.type == undefined) {
            errorObj[
              `provider_${i}_fulfillment_${k}type`
            ] = `Fulfillment type 'DELIVERY' should be present in provoider`
          } else {
            if (fulfillment.type !== 'DELIVERY') {
              errorObj[`provider_${i}_fulfillment_${k}type`] = `Fulfillment type should be 'DELIVERY' in provoider}`
            }
          }

          // Check if the vehicle category is valid
          if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
            errorObj[
              `provider_${i}_fulfillment_${k}_vehicleCategory`
            ] = `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
          }

          // Check stops for START and END, or time range with valid timestamp and GPS
          const stops = fulfillment.stops
          const hasStartStop = stops.some((stop: any) => stop.type === 'START')
          const hasEndStop = stops.some((stop: any) => stop.type === 'END')

          if (!(hasStartStop && hasEndStop)) {
            errorObj[
              `provider_${i}_fulfillment_${k}_stops`
            ] = `Fulfillment ${k} in provider ${i} must contain both START and END stops or a valid time range start`
          }

          stops.forEach((stop: any, l: number) => {
            // Check if timestamp in the time range is valid only if time.range.start is present
            const hasTimeRangeStart = stop.time?.range?.start
            if (hasTimeRangeStart) {
              const timestampCheckResult = timestampCheck(stop.time?.range?.start || '')
              if (timestampCheckResult && timestampCheckResult.err) {
                errorObj[
                  `provider_${i}_fulfillment_${k}_stop_${l}_timestamp`
                ] = `Invalid timestamp for stop ${l} in fulfillment ${k} in provider ${i}: ${timestampCheckResult.err}`
              }
            }

            // Check if GPS coordinates are valid
            if (stop.location?.gps && !checkGpsPrecision(stop.location.gps)) {
              errorObj[`provider_${i}_fulfillment_${k}_stop_${l}_gpsPrecision`] =
                'GPS coordinates must be specified with at least six decimal places of precision'
            }
          })
        })
      }

      const locations = onSearchCatalog['providers'][i]['locations']

      if (locations && locations.length > 0) {
        locations.forEach((location: any, j: number) => {
          storedLocations.add(location.id)

          if (checkGpsPrecision(location.gps)) {
            errorObj[`provider_${i}_location_${j}_gpsPrecision`] =
              'GPS coordinates must be specified with at least six decimal places of precision'
          }
        })
      }

      try {
        let j = 0
        const items = onSearchCatalog['providers'][i]['items']
        const iLen = items.length
        if (iLen === 0) {
          errorObj[`provider_${i}_items`] = `Items are missing for provider ${i}`
        } else {
          while (j < iLen) {
            const item = items[j]
            if (!item.id) {
              const key = `prvdr${i}item${j}_id`
              errorObj[key] = `Item ID is missing in /providers[${i}]/items[${j}]`
            } else if (itemsId.has(item.id)) {
              const key = `prvdr${i}item${j}_id`
              errorObj[key] = `Duplicate item ID: ${item.id} in providers[${i}]`
            } else {
              itemsId.add(item.id)
            }

            if (!item.descriptor || !item.descriptor.code) {
              const key = `prvdr${i}item${j}_descriptor`
              errorObj[key] = `Descriptor is missing in /providers[${i}]/items[${j}]`
            } else {
              if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
                const key = `prvdr${i}item${j}_descriptor`
                errorObj[
                  key
                ] = `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
              }
            }

            const price = item.price
            if (!price || !price.currency || !price.value) {
              const key = `prvdr${i}item${j}_price`
              errorObj[key] = `Price is incomplete in /providers[${i}]/items[${j}]`
            }

            if (storedLocations && storedLocations.size > 0) {
              const locationIds = item.location_ids
              if (!locationIds || locationIds.length === 0) {
                const key = `prvdr${i}item${j}_location_ids`
                errorObj[key] = `Location IDs are missing or empty in /providers[${i}]/items[${j}]`
              } else {
                locationIds.forEach((locationId: string) => {
                  if (!storedLocations.has(locationId)) {
                    const key = `prvdr${i}item${j}_location_ids_not_found`
                    errorObj[
                      key
                    ] = `Location ID ${locationId} in /providers[${i}]/items[${j}] not found in stored locations`
                  }
                })
              }
            }

            const fulfillmentIds = item.fulfillment_ids
            if (!fulfillmentIds || fulfillmentIds.length === 0) {
              const key = `prvdr${i}item${j}_fulfillment_ids`
              errorObj[key] = `Fulfillment IDs are missing or empty in /providers[${i}]/items[${j}]`
            } else {
              fulfillmentIds.forEach((fulfillmentId: string) => {
                if (!storedFulfillments.has(fulfillmentId)) {
                  const key = `prvdr${i}item${j}_fulfillment_ids_not_found`
                  errorObj[
                    key
                  ] = `Fulfillment ID ${fulfillmentId} in /providers[${i}]/items[${j}] not found in stored fulfillments`
                }
              })
            }

            j++
          }
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      const payments = onSearchCatalog['providers'][i]['payments']

      if (!payments || payments.length === 0) {
        errorObj[`provider_${i}_payments`] = `Payments are missing for provider ${i}`
      } else {
        try {
          logger.info(`Validating payments object for /${constants.ON_SEARCH}`)
          payments?.map((payment: any, i: number) => {
            const collectedBy = payment?.collected_by

            if (!collectedBy) {
              errorObj[`collected_by`] = `payment.collected_by must be present in ${mobilitySequence.ON_SEARCH}`
            } else {
              setValue(`collected_by`, collectedBy)
              if (collectedBy !== 'BPP' && collectedBy !== 'BAP') {
                errorObj[
                  'collected_by'
                ] = `payment.collected_by can only be either 'BPP' or 'BAP' in ${mobilitySequence.ON_SEARCH}`
              }
            }

            // Validate payment tags
            const tagsValidation = validatePaymentTags(payment.tags)
            if (!tagsValidation.isValid) {
              const dynamicKey = `${i}_tags`
              Object.assign(errorObj, { [dynamicKey]: tagsValidation.errors })
            }
          })
        } catch (error: any) {
          logger.error(`!!Error occcurred while validating payments in /${constants.ON_SEARCH},  ${error.message}`)
        }
      }

      i++
    }

    setValue(`${mobilitySequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${mobilitySequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${mobilitySequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
    setValue(`${mobilitySequence.ON_SEARCH}_storedLocations`, Array.from(storedLocations))
    setValue(`${mobilitySequence.ON_SEARCH}_storedFulfillments`, Array.from(storedFulfillments))
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

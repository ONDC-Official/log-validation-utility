import { logger } from '../../shared/logger'
import { setValue } from '../../shared/dao'
import { validateTags } from './tags'
import constants, { metroSequence } from '../../constants'
import { validateDescriptor, validateStops } from './metroChecks'
import {
  validateSchema,
  isObjectEmpty,
  // checkMetroContext,
  // checkBppIdOrBapId,
  // timeDiff,
} from '..'
import { validateContext } from './metroChecks'
import { isNil } from 'lodash'
import { checkItemQuantity, checkItemTime, checkPayment } from './validate/helper'

const VALID_VEHICLE_CATEGORIES = ['AUTO_RICKSHAW', 'CAB', 'METRO', 'BUS', 'AIRLINE']
const VALID_DESCRIPTOR_CODES = ['SJT', 'RJT', 'PASS', 'SFSJT']
export const checkOnSearch = (data: any, msgIdSet: any, secondOnSearch: boolean) => {
  if (!data || isObjectEmpty(data)) {
    return secondOnSearch
      ? { [metroSequence.ON_SEARCH2]: 'Json cannot be empty' }
      : { [metroSequence.ON_SEARCH1]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)
  const schemaValidation = validateSchema('TRV', constants.ON_SEARCH, data)
  setValue(`${metroSequence.ON_SEARCH1}_message`, message)
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
      if (onSearchCatalog['providers'][i]?.categories) {
        const categoriesIds: string[] = []
        let descriptorError
        onSearchCatalog['providers'][i]?.categories?.map(
          (item: { id: string; descriptor: { code: string } }, index: number) => {
            if (item?.id) {
              if (categoriesIds?.includes(item?.id)) {
                errorObj[`provider_${i}_categoriesId`] =
                  `ID should be unique, it shouldn't match with other categories ID.`
              } else categoriesIds.push(item?.id)
            } else {
              errorObj[`provider_${i}_categoriesId`] = `Category id should be present in categories of ${index} index.`
            }

            descriptorError = validateDescriptor(
              onSearchCatalog['providers'][i]?.categories[index]?.descriptor,
              constants.ON_SEARCH,
              `providers${[i]}.categories${[i]}.desscriptor`,
              true,
              ['TICKET', 'PASS'],
            )
          },
        )

        if (descriptorError) Object.assign(errorObj, descriptorError)
      } else {
        errorObj[`provider_${i}_categories`] = `Categories are missing for provider ${i}`
      }

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
            errorObj[`provider_${i}_fulfillment_${k}type`] = `Fulfillment type should be present in provider.`
          } else {
            if (secondOnSearch) {
              if (fulfillment.type !== 'TRIP') {
                errorObj[`provider_${i}_fulfillment_${k}type`] = `Fulfillment type should be 'TRIP' in provider.`
              }
            } else {
              if (fulfillment.type !== 'ROUTE') {
                errorObj[`provider_${i}_fulfillment_${k}type`] = `Fulfillment type should be 'ROUTE' in provider.`
              }
            }
          }

          // Check if the vehicle category is valid
          if (!fulfillment?.vehicle?.category) {
            errorObj[`provider_${i}_fulfillment_${k}_vehicleCategory`] = `Vehicle category object is missing.`
          } else {
            if (!VALID_VEHICLE_CATEGORIES.includes(fulfillment.vehicle.category)) {
              errorObj[`provider_${i}_fulfillment_${k}_vehicleCategory`] =
                `Vehicle category should be one of ${VALID_VEHICLE_CATEGORIES}`
            }
          }

          const otp = false
          const cancel = false
          const getStopsError = validateStops(fulfillment?.stops, k, otp, cancel)
          if (getStopsError) Object.assign(errorObj, getStopsError)
          // Check stops for START and END, or time range with valid timestamp and GPS
          // const stops = fulfillment.stops
          // if (!stops) errorObj['Stops'] = 'Stops are missing in fulfillment'
          // else {
          //   const hasStartStop = stops.some((stop: any) => stop.type === 'START')
          //   const hasEndStop = stops.some((stop: any) => stop.type === 'END')

          //   if (!(hasStartStop && hasEndStop)) {
          //     errorObj[`provider_${i}_fulfillment_${k}_stops`] =
          //       `Fulfillment ${k} in provider ${i} must contain both START and END stops or a valid time range start`
          //   }
          //   stops.forEach((stop: { [key: string]: any }, l: number) => {
          //     // Check if GPS coordinates are valid
          //     if (stop.location?.gps && !checkGpsPrecision(stop.location.gps)) {
          //       errorObj[`provider_${i}_fulfillment_${k}_stop_${l}_gpsPrecision`] =
          //         'GPS coordinates must be specified with at least six decimal places of precision'
          //     }
          //   })
          // }
        })
      }

      try {
        if (secondOnSearch) {
          if (onSearchCatalog['providers'][i]['items'] && onSearchCatalog['providers'][i]['items']?.length) {
            let j = 0
            const items = onSearchCatalog['providers'][i]['items']
            const iLen = items.length
            if (iLen === 0) {
              errorObj[`provider_${i}_items`] = `Items are missing for provider ${i}`
            } else {
              while (j < iLen) {
                const item = items[j]
                if (!item?.id) {
                  const key = `prvdr${i}item${j}_id`
                  errorObj[key] = `Item ID is missing in /providers[${i}]/items[${j}]`
                } else if (itemsId.has(item.id)) {
                  const key = `prvdr${i}item${j}_id`
                  errorObj[key] = `Duplicate item ID: ${item.id} in providers[${i}]`
                } else {
                  itemsId.add(item.id)
                }

                const itemQuantityError = checkItemQuantity(item, i, j)
                if (!isNil(itemQuantityError)) Object.assign(errorObj, itemQuantityError)

                if (!item.descriptor || !item.descriptor.code) {
                  const key = `prvdr${i}item${j}_descriptor`
                  errorObj[key] = `Descriptor is missing in /providers[${i}]/items[${j}]`
                } else {
                  if (!VALID_DESCRIPTOR_CODES.includes(item.descriptor.code)) {
                    const key = `prvdr${i}item${j}_descriptor`
                    errorObj[key] =
                      `descriptor.code should be one of ${VALID_DESCRIPTOR_CODES} instead of ${item.descriptor.code}`
                  }
                }

                const itemTimeError = checkItemTime(item, i, j)
                if (!isNil(itemTimeError)) Object.assign(errorObj, itemTimeError)

                const price = item?.price
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
                        errorObj[key] =
                          `Location ID ${locationId} in /providers[${i}]/items[${j}] not found in stored locations`
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
                      errorObj[key] =
                        `Fulfillment ID ${fulfillmentId} in /providers[${i}]/items[${j}] not found in stored fulfillments`
                    }
                  })
                }

                j++
              }
            }
          } else {
            errorObj[`items`] = `Items array is missing or not have the required key inside items.`
          }
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      const paymentError = checkPayment(onSearchCatalog['providers'][i]['payments'], i)
      if (!isNil(paymentError)) Object.assign(errorObj, paymentError)

      i++
    }

    const tagsValidation: { [key: string]: any } | null = validateTags(onSearchCatalog?.providers)
    if (!isNil(tagsValidation)) Object.assign(errorObj, tagsValidation)

    setValue(`${metroSequence.ON_SEARCH1}prvdrsId`, prvdrsId)
    setValue(`${metroSequence.ON_SEARCH1}prvdrLocId`, prvdrLocId)
    setValue(`${metroSequence.ON_SEARCH1}_itemsId`, Array.from(itemsId))
    setValue(`${metroSequence.ON_SEARCH1}_storedLocations`, Array.from(storedLocations))
    setValue(`${metroSequence.ON_SEARCH1}_storedFulfillments`, Array.from(storedFulfillments))

    if (secondOnSearch) {
      setValue('providerId', message?.catalog?.providers[0]?.id ?? null)
      setValue(`${metroSequence.ON_SEARCH1}_message`, message)
      setValue(`itemIds`, Array.from(itemsId))
      setValue(`${metroSequence.ON_SEARCH1}_storedFulfillments`, Array.from(storedFulfillments))
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

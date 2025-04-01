import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { validateRouteInfoTags, validateTags } from '../../metro/tags'
import constants, { airlinesSequence } from '../../../constants'
import { validateDescriptor, validateStops } from '../../metro/metroChecks'
import { validateSchema, isObjectEmpty } from '../../'
import { validateContext } from '../../metro/metroChecks'
import { isNil } from 'lodash'
import {
  checkItemPrice,
  checkItemQuantity,
  checkItemTime,
  checkPayment,
  checkRefIds,
  validateFarePolicyTags,
} from '../../metro/validate/helper'
import { VALID_DESCRIPTOR_CODES } from '../../metro/enum'

export const checkOnSearch = (
  data: any,
  msgIdSet: any,
  secondOnSearch: boolean,
  flow: { flow: string; flowSet: string },
) => {
  if (!data || isObjectEmpty(data)) {
    return secondOnSearch
      ? { [airlinesSequence.ON_SEARCH]: 'Json cannot be empty' }
      : { [airlinesSequence.ON_SEARCH]: 'Json cannot be empty' }
  }
  const errorObj: any = {}

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)
  const schemaValidation = validateSchema('TRV12', constants.ON_SEARCH, data)
  setValue(`${airlinesSequence.ON_SEARCH}_message`, message)

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

  // check descriptor
  try {
    logger.info(`Validating Descriptor for catalog`)
    const descriptor = onSearchCatalog?.descriptor
    // send true as last argument in case if descriptor?.code validation is needed
    const descriptorError = validateDescriptor(descriptor, constants.ON_SEARCH, `catalog.descriptor`, false, [])
    if (descriptorError) Object.assign(errorObj, descriptorError)
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  try {
    let i = 0
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    while (i < len) {
      //validate categories
      const categories = onSearchCatalog['providers'][i]?.categories
      if (String(flow?.flow)?.toUpperCase() === 'METRO' && onSearchCatalog['providers'][i]?.tags) {
        const tagsValidation: { [key: string]: any } | null = validateTags(
          onSearchCatalog['providers'][i]?.tags ?? [],
          i,
        )
        if (!isNil(tagsValidation)) Object.assign(errorObj, tagsValidation)
      }
      // }

      if (String(flow.flow)?.toUpperCase() === 'METRO') {
        const providerTime = onSearchCatalog['providers'][i]?.time

        if (providerTime) {
          const timeRange = providerTime?.range

          if (!timeRange) errorObj[`provider_${i}_time_range`] = `time range is missing for provider ${i}`
          else {
            if (!timeRange?.start)
              errorObj[`provider_${i}_time_range_start`] = `time range start is missing for provider ${i}`

            if (!timeRange?.end)
              errorObj[`provider_${i}_time_range_end`] = `time range end is missing for provider ${i}`
          }
        } else errorObj[`provider_${i}_time`] = `time Object is missing for provider ${i}`
      }

      const categoriesIds: string[] = []
      if (String(flow?.flow)?.toUpperCase() === 'METRO') {
        if (categories) {
          onSearchCatalog['providers'][i]?.categories?.map(
            (item: { id: string; descriptor: { code: string } }, index: number) => {
              if (item?.id) {
                if (categoriesIds?.includes(item?.id)) {
                  errorObj[`provider_${i}_categoriesId`] =
                    `ID should be unique, it shouldn't match with other categories ID.`
                } else categoriesIds.push(item?.id)
              } else {
                errorObj[`provider_${i}_categoriesId`] =
                  `Category id should be present in categories of ${index} index.`
              }

              const descriptorError = validateDescriptor(
                item?.descriptor,
                constants.ON_SEARCH,
                `providers${[i]}.categories${[i]}.desscriptor`,
                true,
                ['TICKET', 'PASS'],
              )
              if (descriptorError) Object.assign(errorObj, descriptorError)
            },
          )
        } else {
          errorObj[`provider_${i}_categories`] = `Categories are missing for provider ${i}`
        }
      }

      //validate fulfillments
      const fulfillments = onSearchCatalog['providers'][i]['fulfillments']
      if (!fulfillments || fulfillments.length === 0) {
        errorObj[`provider_${i}_fulfillments`] = `Fulfillments are missing for provider ${i}`
      } else {
        fulfillments.forEach((fulfillment: any, k: number) => {
          //fulfillments id
          if (!fulfillment?.id) {
            errorObj[`provider_${i}_fulfillment_${k}id`] = `id is missing at fulfillments.`
          } else if (storedFulfillments.has(fulfillment?.id)) {
            const key = `prvdr${i}fulfillment${k}`
            errorObj[key] = `duplicate fulfillment id: ${fulfillment.id} in providers[${i}]`
          } else {
            storedFulfillments.add(fulfillment.id)
          }

          if (String(flow?.flow).toUpperCase() !== 'METRO') {
            if (!fulfillment?.tags)
              errorObj[`provider_${i}_fulfillment_${k}tags`] =
                `Tags should be present in Fulfillment in case of Intracity.`
            else {
              // Validate route info tags
              const tagsValidation = validateRouteInfoTags(fulfillment?.tags)
              if (!tagsValidation.isValid) {
                Object.assign(errorObj, { tags: tagsValidation.errors })
              }
            }
          }

          //fulfillments type
          if (!fulfillment?.type) {
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

          //fulfillments vehicle
          if (!fulfillment?.vehicle?.category) {
            errorObj[`provider_${i}_fulfillment_${k}_vehicleCategory`] = `Vehicle category object is missing.`
          } else {
            if (fulfillment.vehicle.category !== (String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO')) {
              errorObj[`provider_${i}_fulfillment_${k}_vehicleCategory`] =
                `Vehicle category should be ${String(flow?.flow).toUpperCase() !== 'METRO' ? 'BUS' : 'METRO'}`
            }
          }

          const otp = false
          const cancel = false

          //validating stops
          const getStopsError = validateStops(fulfillment?.stops, k, otp, cancel, constants.ON_SEARCH)
          if (Object.keys(getStopsError).length > 0) {
            for (let key in getStopsError) {
              if (Object.keys(getStopsError[key]).length > 0) Object.assign(errorObj, getStopsError)
            }
          }
        })
      }

      //validate items
      try {
        if (secondOnSearch) {
          const items = onSearchCatalog['providers'][i]['items']
          if (items && items?.length) {
            items?.map((item: any, j: number) => {
              //check id
              const key = `prvdr${i}item${j}_id`
              if (!item?.id) {
                errorObj[key] = `Item ID is missing in /providers[${i}]/items[${j}]`
              } else if (itemsId.has(item.id)) {
                errorObj[key] = `Duplicate item ID: ${item.id} in providers[${i}]`
              } else {
                itemsId.add(item.id)
              }

              //check quantity
              if (item?.quantity) {
                const itemQuantityError = checkItemQuantity(item?.quantity, i, j)
                if (!isNil(itemQuantityError)) Object.assign(errorObj, itemQuantityError)
              }

              //check descriptor
              const descriptorError = validateDescriptor(
                item?.descriptor,
                constants.ON_SEARCH,
                `items${j}.descriptor`,
                true,
                VALID_DESCRIPTOR_CODES,
              )
              if (descriptorError) Object.assign(errorObj, descriptorError)

              //check time
              if (item?.time) {
                const itemTimeError = checkItemTime(item?.time, i, j)
                if (!isNil(itemTimeError)) Object.assign(errorObj, itemTimeError)
              }

              //check price
              if (item?.price) {
                const priceError = checkItemPrice(item?.price, i, j)
                if (!isNil(priceError)) Object.assign(errorObj, priceError)
              }

              if (String(flow?.flow).toUpperCase() !== 'METRO' && item?.descriptor?.code === 'SFSJT') {
                if (!item?.tags)
                  errorObj[`items${j}.tags`] =
                    `tags is missing in /providers[${i}]/items[${j}]. It should be present when descriptor code is SFSJT.`
                else {
                  const polictTagsError = validateFarePolicyTags(item?.tags, i, j, context?.action || '')
                  if (!isNil(polictTagsError)) Object.assign(errorObj, polictTagsError)
                }
              }

              //check category_ids
              if (String(flow?.flow).toUpperCase() === 'METRO') {
                const categoryIdsError = checkRefIds(item?.category_ids, i, j, categoriesIds, 'category')
                if (!isNil(categoryIdsError)) Object.assign(errorObj, categoryIdsError)
              }

              //check fulfillment_ids
              const fulfillmentIdsError = checkRefIds(
                item?.fulfillment_ids,
                i,
                j,
                Array.from(storedFulfillments),
                'fulfillment',
              )
              if (!isNil(fulfillmentIdsError)) Object.assign(errorObj, fulfillmentIdsError)
            })
          } else {
            errorObj[`items`] = `items array is missing or is empty at providers${i}.`
          }
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      const paymentError = checkPayment(onSearchCatalog['providers'][i]['payments'], i, constants.ON_SEARCH)
      if (!isNil(paymentError)) Object.assign(errorObj, paymentError)

      i++
    }

    setValue(`${airlinesSequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${airlinesSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${airlinesSequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
    setValue(`${airlinesSequence.ON_SEARCH}_storedLocations`, Array.from(storedLocations))
    setValue(`${airlinesSequence.ON_SEARCH}_storedFulfillments`, Array.from(storedFulfillments))

    if (secondOnSearch) {
      // const providersId = message?.catalog?.providers?.map((provider: any) => provider?.id)
      // setValue('providerId', providersId || [])
      setValue(`${airlinesSequence.ON_SEARCH}_message`, message)
      setValue(`itemIds`, Array.from(itemsId))
      // setValue(`${airlinesSequence.ON_SEARCH2}_storedFulfillments`, Array.from(storedFulfillments))
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

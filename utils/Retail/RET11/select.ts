import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  checkBppIdOrBapId,
  findItemByItemType,
  isoDurToSec,
} from '../../../utils'
import _ from 'lodash'
import { logger } from '../../../shared/logger'

const tagFinder = (item: { tags: any[] }, value: string): any => {
  const res = item?.tags?.find((tag: any) => {
    return (
      tag.code === 'type' &&
      tag.list &&
      tag.list.find((listItem: any) => {
        return listItem.code === 'type' && listItem.value == value
      })
    )
  })
  return res
}

export const checkSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.SELECT, data)

  const contextRes: any = checkContext(context, constants.SELECT)
  const onSearch: any = getValue(`${ApiSequence.ON_SEARCH}`)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}
  let selectedPrice = 0
  const itemsIdList: any = {}
  const itemsCtgrs: any = {}
  const itemsTat: any[] = []

  if (!msgIdSet.add(context.message_id)) {
    errorObj['messageId'] = 'message_id should be unique'
  }
  if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
    errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
  }

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const select = message.order

  setValue(`${ApiSequence.SELECT}`, data)
  setValue('providerId', select.provider.id)
  setValue('providerLoc', select.provider.locations[0].id)
  setValue('items', select.items)

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
  const onSearchContext: any = getValue(`${ApiSequence.ON_SEARCH}_context`)
  let providerOnSelect = null
  const itemIdArray: any[] = []
  const customIdArray: any[] = []
  const itemsOnSelect: any = []
  const itemMapper: any = {}
  const parentItemIdSet = new Set()

  try {
    logger.info(`Comparing city of /${constants.ON_SEARCH} and /${constants.SELECT}`)
    if (!_.isEqual(onSearchContext.city, context.city)) {
      const key = `${ApiSequence.ON_SEARCH}_city`
      errorObj[key] = `City code mismatch in /${ApiSequence.ON_SEARCH} and /${ApiSequence.SELECT}`
    }
  } catch (error: any) {
    logger.info(`Error while comparing city in /${ApiSequence.SEARCH} and /${ApiSequence.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing timestamp of /${constants.ON_SEARCH} and /${constants.SELECT}`)
    if (_.gte(onSearchContext.timestamp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.ON_SEARCH} api cannot be greater than or equal to /${constants.SELECT} api`
    }

    setValue('tmpstmp', context.timestamp)
    setValue('msgId', context.message_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing timestamp for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.ON_SEARCH} and /${constants.SELECT}`)
    if (_.isEqual(onSearchContext.message_id, context.message_id)) {
      const key = `${ApiSequence.ON_SEARCH}_msgId`
      errorObj[key] = `Message Id for /${ApiSequence.ON_SEARCH} and /${ApiSequence.SELECT} api cannot be same`
    }

    if (_.isEqual(searchContext.message_id, context.message_id)) {
      const key = `${ApiSequence.SEARCH}_msgId`
      errorObj[key] = `Message Id for /${ApiSequence.SEARCH} and /${ApiSequence.SELECT} api cannot be same`
    }

    setValue('msgId', context.message_id)
    setValue('txnId', context.transaction_id)
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.ON_SEARCH} and /${constants.SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Storing item IDs and thier count in /${constants.SELECT}`)
    const itemsOnSearch: any = getValue(`${ApiSequence.ON_SEARCH}itemsId`)

    if (!itemsOnSearch?.length) {
      errorObj.invalidItems = `No Items found on ${constants.ON_SEARCH} API`
    }

    select.items.forEach((item: { id: string | number; quantity: { count: number } }) => {
      if (!itemsOnSearch?.includes(item.id)) {
        errorObj[`invalidItemId[${item.id}]`] = `Invalid item found in /${constants.SELECT} id: ${item.id}`
      }
      itemIdArray.push(item.id)
      itemsOnSelect.push(item.id)
      itemsIdList[item.id] = item.quantity.count
    })
    setValue('itemsIdList', itemsIdList)
    setValue('SelectItemList', itemsOnSelect)
  } catch (error: any) {
    logger.error(`Error while storing item IDs in /${constants.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking for GPS precision in /${constants.SELECT}`)
    select.fulfillments?.forEach((ff: any) => {
      if (ff.hasOwnProperty('end')) {
        setValue('buyerGps', ff.end?.location?.gps)
        setValue('buyerAddr', ff.end?.location?.address?.area_code)

        const gps = ff.end?.location?.gps?.split(',')
        const gpsLat: string = gps[0]
        Array.from(gpsLat).forEach((char: any) => {
          if (char !== '.' && isNaN(parseInt(char))) {
            errorObj.LatgpsErr = `fulfillments location.gps is not as per the API contract`
          }
        })
        const gpsLong = gps[1]
        Array.from(gpsLong).forEach((char: any) => {
          if (char !== '.' && isNaN(parseInt(char))) {
            errorObj.LongGpsErr = `fulfillments location.gps is not as per the API contract`
          }
        })
        if (!gpsLat || !gpsLong) {
          errorObj.gpsErr = `fulfillments location.gps is not as per the API contract`
        }
        if (!ff.end.location.address.hasOwnProperty('area_code')) {
          errorObj.areaCode = `address.area_code is required property in /${constants.SELECT}`
        }
      }
    })
  } catch (error: any) {
    logger.error(`!!Error while checking GPS Precision in /${constants.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking for valid provider in /${constants.ON_SEARCH} and /${constants.SELECT}`)
    let provider = onSearch?.message?.catalog['bpp/providers'].filter(
      (provider: { id: any }) => provider.id === select.provider.id,
    )

    if (provider?.length === 0) {
      errorObj.providerId = `provider with provider.id: ${select.provider.id} does not exist in on_search`
    } else {
      providerOnSelect = provider[0]

      setValue('providerGps', providerOnSelect?.locations[0]?.gps)
      setValue('providerName', providerOnSelect?.descriptor?.name)
    }
  } catch (error: any) {
    logger.error(
      `Error while checking for valid provider in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Checking for valid location ID inside item list for /${constants.SELECT}`)
    const allOnSearchItems: any = getValue('onSearchItems')
    let onSearchItems = allOnSearchItems.flat()
    select.items.forEach((item: any, index: number) => {
      onSearchItems.forEach((it: any) => {
        if (it.id === item.id && it.location_id !== item.location_id) {
          errorObj[`location_id[${index}]`] = `location_id should be same for the item ${item.id} as in on_search`
        }
      })
    })
  } catch (error: any) {
    logger.error(`Error while checking for valid location ID inside item list for /${constants.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking for duplicate parent_item_id in /${constants.SELECT}`)
    select.items.forEach((item: any, index: number) => {
      if (!itemMapper[item.id]) {
        // If the item is not in the map, add it
        itemMapper[item.id] = item.parent_item_id
      } else {
        if (itemMapper[item.id] === item.parent_item_id) {
          const key = `item${index}id_parent_item_id`
          errorObj[key] = `/message/order/items/parent_item_id cannot be duplicate if item/id is same`
        }
      }
    })
  } catch (error: any) {
    logger.error(`Error while checking for duplicate parent_item_id in /${constants.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Adding parent_item_id in a set on /${constants.SELECT}`)
    select.items.forEach((item: any) => {
      if (!parentItemIdSet.has(item.parent_item_id)) {
        parentItemIdSet.add(item.parent_item_id)
      }
    })
    setValue('parentItemIdSet', parentItemIdSet)
  } catch (error: any) {
    logger.error(`Error while adding parent_item_id in a set on /${constants.SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Mapping the items with thier prices on /${constants.ON_SEARCH} and /${constants.SELECT}`)
    const allOnSearchItems: any = getValue('onSearchItems')
    let onSearchItems = allOnSearchItems.flat()
    select.items.forEach((item: any) => {
      const itemOnSearch = onSearchItems.find((it: any) => {
        return it.id === item.id
      })

      if (itemOnSearch) {
        logger.info(`ITEM ID: ${item.id}, Price: ${itemOnSearch.price.value}, Count: ${item.quantity.count}`)
        itemsCtgrs[item.id] = itemOnSearch.category_id
        itemsTat.push(itemOnSearch['@ondc/org/time_to_ship'])
        selectedPrice += itemOnSearch.price.value * item.quantity?.count
      }
    })
    setValue('selectedPrice', selectedPrice)
    setValue('itemsCtgrs', itemsCtgrs)
  } catch (error: any) {
    logger.error(
      `Error while mapping the items with thier prices on /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Saving time_to_ship in /${constants.SELECT}`)
    let timeToShip = 0
    itemsTat?.forEach((tts: any) => {
      const ttship = isoDurToSec(tts)
      logger.info(ttship)
      timeToShip = Math.max(timeToShip, ttship)
    })
    setValue('timeToShip', timeToShip)
  } catch (error: any) {
    logger.error(`!!Error while saving time_to_ship in ${constants.SELECT}`, error)
  }

  const checksOnValidProvider = (provider: any) => {
    try {
      logger.info(`Comparing provider location in /${constants.ON_SEARCH} and /${constants.SELECT}`)
      if (provider?.locations[0]?.id != select.provider?.locations[0]?.id) {
        errorObj.prvdLoc = `provider.locations[0].id ${provider.locations[0].id} mismatches in /${constants.ON_SEARCH} and /${constants.SELECT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing provider's location id in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking for valid items for provider in /${constants.SELECT}`)
      const itemProviderMap: any = getValue(`itemProviderMap`)
      const items = select.items
      items.forEach((item: any, index: number) => {
        if (!itemProviderMap[item.id].includes(provider.id)) {
          errorObj[`itemProvider[${index}]`] =
            `Item with id ${item.id} is not available for provider with id ${provider.id}`
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for valid items for provider in /${constants.SELECT}, ${error.stack}`)
    }

    try {
      logger.info(`Storing item IDs on custom ID array`)
      provider?.categories?.map((item: { id: string }) => {
        customIdArray.push(item.id)
      })
      setValue('select_customIdArray', customIdArray)
    } catch (error: any) {
      logger.error(`Error while storing item IDs on custom ID array, ${error.stack}`)
    }

    try {
      logger.info(`Checking for valid time object in /${constants.SELECT}`)
      if (provider?.time && provider?.time?.label === 'disable') {
        errorObj.disbledProvider = `provider with provider.id: ${provider.id} was disabled in on_search `
      }
    } catch (error: any) {
      logger.error(`Error while checking for valid time object in /${constants.SELECT}, ${error.stack}`)
    }

    try {
      logger.info(`Checking for valid base Item in /${constants.SELECT}`)
      select.items.forEach((item: any) => {
        const baseItem = findItemByItemType(item)
        if (baseItem) {
          const searchBaseItem = provider.items.find((it: { id: any }) => it.id === baseItem.id)
          if (searchBaseItem && searchBaseItem.time.label === 'disable') {
            errorObj.itemDisabled = `disabled item with id ${baseItem.id} cannot be selected`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for valid base Item in /${constants.SELECT}, ${error.stack}`)
    }

    try {
      logger.info(`Checkinf or customization Items in /${constants.SELECT}`)
      select.items.forEach((item: any, index: number) => {
        const customizationTag = tagFinder(item, 'customization')
        if (customizationTag) {
          const parentTag = item.tags.find((tag: any) => {
            return (
              tag.code === 'parent' &&
              tag.list &&
              tag.list.find((listItem: { code: string; value: any }) => {
                return listItem.code === 'id' && customIdArray.includes(listItem.value)
              })
            )
          })

          if (!parentTag) {
            const key = `item${index}customization_id`
            errorObj[key] =
              `/message/order/items/tags/customization/value in item: ${item.id} should be one of the customizations id mapped in on_search`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while checking for customization Items in /${constants.SELECT}, ${error.stack}`)
    }
  }

  // Call the provider check Function only when valid provider is present
  if (providerOnSelect) {
    checksOnValidProvider(providerOnSelect)
  } else {
    errorObj.providerChecks = `Warning: Missed checks for provider as provider with  ID: ${select.provider.id} does not exist on ${constants.ON_SEARCH} API`
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

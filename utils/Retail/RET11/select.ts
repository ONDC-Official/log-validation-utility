import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchema,
  isObjectEmpty,
  checkContext,
  isoDurToSec,
  checkBppIdOrBapId,
  findItemByItemType,
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
  msgIdSet.add(context.message_id)
  
  const errorObj: any = {}
  let selectedPrice = 0
  const itemsIdList: any = {}
  const itemsCtgrs: any = {}
  const itemsTat: any[] = []

  if (!msgIdSet.add(context.message_id)) {
    errorObj['messageId'] = 'message_id should be unique'
  }
  console.log("msgid select==>", msgIdSet);
  

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

  setValue(`${ApiSequence.SELECT}`, data)

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
  const onSearchContext: any = getValue(`${ApiSequence.ON_SEARCH}_context`)

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
    const customIdArray: any[] = []
    const itemIdArray: any[] = []
    const select = message.order
    const onSearch: any = getValue(`${ApiSequence.ON_SEARCH}`)

    let provider = onSearch?.message?.catalog['bpp/providers'].filter(
      (provider: { id: any }) => provider.id === select.provider.id,
    )
    if (provider[0].time.label === 'disable') {
      errorObj.disbledProvider = `provider with provider.id: ${provider[0].id} was disabled in on_search `
    }

    provider[0].items.map((item: { id: string }) => {
      itemIdArray.push(item.id)
    })

    provider[0]?.categories?.map((item: { id: string }) => {
      customIdArray.push(item.id)
    })

    if (provider[0]) {
      provider = provider[0]

      setValue('providerId', provider.id)
      setValue('providerLoc', provider.locations[0].id)
      setValue('providerGps', provider.locations[0].gps)
      setValue('providerName', provider.descriptor.name)

      try {
        logger.info(`Comparing provider location in /${constants.ON_SEARCH} and /${constants.SELECT}`)
        if (provider.locations[0].id != select.provider.locations[0].id) {
          errorObj.prvdLoc = `provider.locations[0].id ${provider.locations[0].id} mismatches in /${constants.ON_SEARCH} and /${constants.SELECT}`
        }
      } catch (error: any) {
        logger.error(
          `!!Error while comparing provider's location id in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
        )
      }

      logger.info(
        `Mapping Item Ids with their counts, categories and prices /${constants.ON_SEARCH} and /${constants.SELECT}`,
      )

      try {
        const itemMap: any = {}
        const itemMapper: any = {}
        const parentItemIdSet = new Set()
        const itemIdSet = new Set()
        select.items.forEach(
          (
            item: {
              id: string | number
              tags: any[]
              parent_item_id: string | number
              location_id: any
              quantity: { count: number }
            },
            index: number,
          ) => {
            const itemOnSearch = provider.items.find((it: { id: any }) => it.id === item.id)

            const baseItem = findItemByItemType(item)
            if (baseItem) {
              const searchBaseItem = provider.items.find((it: { id: any }) => it.id === baseItem.id)
              if (searchBaseItem && searchBaseItem.time.label === 'disable') {
                errorObj.itemDisabled = `disabled item with id ${baseItem.id} cannot be selected`
              }
            }
            const itemTag = tagFinder(item, 'item')
            if (itemTag) {
              if (!itemMap[item.parent_item_id]) {
                itemMap[item.parent_item_id] = {
                  location_id: item.location_id,
                }
              }

              if (!itemIdArray.includes(item.id)) {
                const key = `item${index}item_id`
                errorObj[key] =
                  `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in on_search`
              }
            }

            const customizationTag = tagFinder(item, 'customization')

            if (customizationTag) {
              const parentTag = item.tags.find((tag) => {
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

            if (!parentItemIdSet.has(item.parent_item_id)) parentItemIdSet.add(item.parent_item_id)

            if (!itemIdSet.has(item.id)) itemIdSet.add(item.id)
            if (
              itemTag &&
              itemMap[item.parent_item_id] &&
              itemMap[item.parent_item_id].location_id !== item.location_id
            ) {
              const key = `item${index}location_id`
              errorObj[key] = `Inconsistent location_id for parent_item_id ${item.parent_item_id}`
            }

            if (itemOnSearch) {
              logger.info(`ITEM ID: ${item.id}, Price: ${itemOnSearch.price.value}, Count: ${item.quantity.count}`)

              itemsIdList[item.id] = item.quantity.count
              itemsCtgrs[item.id] = itemOnSearch.category_id
              itemsTat.push(itemOnSearch['@ondc/org/time_to_ship'])
              selectedPrice += itemOnSearch.price.value * item.quantity.count
            }

            if (!itemMapper[item.id]) {
              // If the item is not in the map, add it
              itemMapper[item.id] = item.parent_item_id
            } else {
              if (itemMapper[item.id] === item.parent_item_id) {
                const key = `item${index}id_parent_item_id`
                errorObj[key] = `/message/order/items/parent_item_id cannot be duplicate if item/id is same`
              }
            }
          },
        )

        try {
          logger.info(`Saving time_to_ship in /${constants.ON_SEARCH}`)
          let timeToShip = 0
          itemsTat.forEach((tts: any) => {
            const ttship = isoDurToSec(tts)
            logger.info(ttship)
            timeToShip = Math.max(timeToShip, ttship)
          })
          logger.info('timeTOSHIP', timeToShip)
          setValue('timeToShip', timeToShip)
        } catch (error: any) {
          logger.error(`!!Error while saving time_to_ship in ${constants.ON_SEARCH}`, error)
        }

        setValue('itemsIdList', itemsIdList)
        setValue('itemsCtgrs', itemsCtgrs)
        setValue('selectedPrice', selectedPrice)
        setValue('parentItemIdSet', parentItemIdSet)

        logger.info(`Provider Id in /${constants.ON_SEARCH} and /${constants.SELECT} matched`)
      } catch (error: any) {
        logger.error(
          `!!Error while Comparing and Mapping Items in /${constants.ON_SEARCH} and /${constants.SELECT}, ${error.stack}`,
        )
      }
    } else {
      logger.info(`Provider Ids in /${constants.ON_SEARCH} and /${constants.SELECT} mismatch`)
      errorObj.prvdrIdMatch = `Provider Id ${select.provider.id} in /${constants.SELECT} does not exist in /${constants.ON_SEARCH}`
    }

    setValue('select_customIdArray', customIdArray)
    try {
      select.fulfillments.forEach((ff: any) => {
        logger.info(`Checking GPS Precision in /${constants.SELECT}`)

        // eslint-disable-next-line no-prototype-builtins
        if (ff.hasOwnProperty('end')) {
          setValue('buyerGps', ff.end.location.gps)
          setValue('buyerAddr', ff.end.location.address.area_code)
          const gps = ff.end.location.gps.split(',')
          const gpsLat = gps[0]
          const gpsLong = gps[1]

          if (!gpsLat || !gpsLong) {
            errorObj.gpsErr = `fulfillments location.gps is not as per the API contract`
          }

          // eslint-disable-next-line no-prototype-builtins
          if (!ff.end.location.address.hasOwnProperty('area_code')) {
            errorObj.areaCode = `address.area_code is required property in /${constants.SELECT}`
          }
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while checking GPS Precision in /${constants.SELECT}, ${error.stack}`)
    }

    setValue('items', select.items)
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking providers info in /${constants.SELECT},  ${error.message}`)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

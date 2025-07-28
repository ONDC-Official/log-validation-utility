import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchemaRetailV2,
  isObjectEmpty,
  checkContext,
  checkBppIdOrBapId,
  findItemByItemType,
  isoDurToSec,
} from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { FLOW } from '../../enum'

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

export const checkSelect = (data: any, msgIdSet: any, apiSeq: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.SELECT, data)

  const contextRes: any = checkContext(context, constants.SELECT)
  const onSearch: any = getValue(`${ApiSequence.ON_SEARCH}`)
  const flow = getValue('flow')

  const errorObj: any = {}

  try {
    if (flow === '3' && apiSeq == ApiSequence.SELECT_OUT_OF_STOCK) {
      logger.info(`Adding Message Id /${constants.SELECT_OUT_OF_STOCK}`)
      if (msgIdSet.has(context.message_id)) {
        errorObj[`${ApiSequence.SELECT_OUT_OF_STOCK}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      setValue(`${ApiSequence.SELECT_OUT_OF_STOCK}_msgId`, data.context.message_id)
    } else {
      logger.info(`Adding Message Id /${constants.SELECT}`)
      if (msgIdSet.has(context.message_id)) {
        errorObj[`${ApiSequence.SELECT}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      setValue(`${ApiSequence.SELECT}_msgId`, data.context.message_id)
    }
  } catch (error: any) {
    if (flow === '3' && apiSeq == ApiSequence.SELECT_OUT_OF_STOCK) {
      logger.error(`!!Error while checking message id for /${constants.SELECT_OUT_OF_STOCK}, ${error.stack}`)
    } else {
      logger.error(`!!Error while checking message id for /${constants.SELECT}, ${error.stack}`)
    }
  }

  let selectedPrice = 0
  const itemsIdList: any = {}
  const itemsCtgrs: any = {}
  const itemsTat: any[] = []

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
  const itemMap: any = {}
  const itemMapper: any = {}

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
        const tagsTypeArr = _.filter(it?.tags, { code: 'type' })
        let isNotCustomization = true
        if (tagsTypeArr.length > 0) {
          const tagsType = _.filter(tagsTypeArr[0]?.list, { code: 'type' })
          if (tagsType.length > 0) {
            if (tagsType[0]?.value == 'customization') {
              isNotCustomization = false
            }
          }
        }
        if (it.id === item.id && it.location_id !== item.location_id && isNotCustomization) {
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

  try {
    logger.info(`Checking for Consistent location IDs for parent_item_id in /${constants.SELECT}`)
    select.items.forEach((item: any, index: number) => {
      const itemTag = tagFinder(item, 'item')
      if (itemTag) {
        if (!itemMap[item.parent_item_id]) {
          itemMap[item.parent_item_id] = {
            location_id: item.location_id,
          }
        }
      }

      if (itemTag && itemMap[item.parent_item_id].location_id !== item.location_id) {
        const key = `item${index}location_id`
        errorObj[key] = `Inconsistent location_id for parent_item_id ${item.parent_item_id}`
      }
    })
  } catch (error: any) {
    logger.error(
      `Error while checking for Consistent location IDs for parent_item_id in /${constants.SELECT}, ${error.stack}`,
    )
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
      const providerID = select.provider.id
      const items = select.items
      items.forEach((item: any, index: number) => {
        if (!itemProviderMap[providerID].includes(item.id)) {
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
    try {
      logger.info(`Checking or offers in /${constants.SELECT}`)
      console.log('offers in select call', JSON.stringify(select.offers))

      if (select?.offers && select?.offers.length > 0) {
        const providerOffers: any = getValue(`${ApiSequence.ON_SEARCH}_offers`)
        const applicableOffers: any[] = []
        const orderItemIds = select?.items?.map((item: any) => item.id) || []
        const orderLocationIds = select?.provider?.locations?.map((item: any) => item.id) || []

        select.offers.forEach((offer: any, index: number) => {
          const providerOffer = providerOffers?.find((providedOffer: any) => providedOffer?.id === offer?.id)
          console.log('providerOffer in select call', JSON.stringify(providerOffer))

          if (!providerOffer) {
            errorObj[`offer[${index}]`] = `Offer with id ${offer.id} is not available for the provider.`
            return
          }

          const offerLocationIds = providerOffer?.location_ids || []
          const locationMatch = offerLocationIds.some((id: string) => orderLocationIds.includes(id))
          if (!locationMatch) {
            errorObj[`offer[${index}]`] =
              `Offer with id '${offer.id}' is not applicable for any of the order's locations [${orderLocationIds.join(', ')}].`
            return
          }

          const offerItemIds = providerOffer?.item_ids || []
          const itemMatch = offerItemIds.some((id: string) => orderItemIds.includes(id))
          if (!itemMatch) {
            errorObj[`offer[${index}]`] =
              `Offer with id '${offer.id}' is not applicable for any of the ordered item(s) [${orderItemIds.join(', ')}].`
            return
          }

          const { label, range } = providerOffer?.time || {}
          const start = range?.start
          const end = range?.end
          if (label !== 'valid' || !start || !end) {
            errorObj[`offer[${index}]`] = `Offer with id ${offer.id} has an invalid or missing time configuration.`
            return
          }

          const currentTimeStamp = new Date(context?.timestamp)
          const startTime = new Date(start)
          const endTime = new Date(end)
          if (!(currentTimeStamp >= startTime && currentTimeStamp <= endTime)) {
            errorObj[`offer[${index}]`] = `Offer with id ${offer.id} is not currently valid based on time range.`
            return
          }

          const isSelected = offer?.tags?.some(
            (tag: any) =>
              tag.code === 'selection' &&
              tag.list?.some((entry: any) => entry.code === 'apply' && entry.value === 'yes'),
          )
          if (!isSelected) {
            errorObj[`offer[${index}]`] = `Offer with id ${offer.id} is not selected (apply: "yes" missing).`
            return
          }

          applicableOffers.push({ ...providerOffer, index })
          console.log('applicableOffers', JSON.stringify(applicableOffers))
        })

        // Additive validation
        const additiveOffers = applicableOffers.filter((offer) => {
          const metaTag = offer.tags?.find((tag: any) => tag.code === 'meta')
          return metaTag?.list?.some((entry: any) => entry.code === 'additive' && entry.value.toLowerCase() === 'yes')
        })

        const nonAdditiveOffers = applicableOffers.filter((offer) => {
          const metaTag = offer.tags?.find((tag: any) => tag.code === 'meta')
          return metaTag?.list?.some((entry: any) => entry.code === 'additive' && entry.value.toLowerCase() === 'no')
        })

        if (additiveOffers.length > 0) {
          // Apply all additive offers
          applicableOffers.length = 0
          additiveOffers.forEach((offer) => {
            const providerOffer = providerOffers.find((o: any) => o.id === offer.id)
            if (providerOffer) {
              applicableOffers.push(providerOffer)
            }
          })
        } else if (nonAdditiveOffers.length === 1) {
          // Apply the single non-additive offer
          applicableOffers.length = 0
          const offer = nonAdditiveOffers[0]
          const providerOffer = providerOffers.find((o: any) => o.id === offer.id)
          if (providerOffer) {
            applicableOffers.push(providerOffer)
          }
        } else if (nonAdditiveOffers.length > 1) {
          // Multiple non-additive offers selected; add errors
          applicableOffers.length = 0
          nonAdditiveOffers.forEach((offer) => {
            errorObj[`offer[${offer.index}]`] =
              `Offer ${offer.id} is non-additive and cannot be combined with other non-additive offers.`
          })
          // setValue('Addtive-Offers',false)
          return
        }
        console.log('Applicable Offers in select:', applicableOffers)
        setValue('selected_offer', applicableOffers)
      }
    } catch (error: any) {
      logger.error(`Error while checking for offers in /${constants.SELECT}, ${error.stack}`)
    }
  }

  if (providerOnSelect) {
    checksOnValidProvider(providerOnSelect)
  } else {
    errorObj.providerChecks = `Warning: Missed checks for provider as provider with  ID: ${select.provider.id} does not exist on ${constants.ON_SEARCH} API`
  }

  let minVal: any = null

  try {
    const providers = onSearch?.message?.catalog['bpp/providers']
    const getAllTags = (providers: any[]) => {
      return providers.flatMap((provider) => {
        return provider.tags
      })
    }

    const tagList = getAllTags(providers)
    const tag = tagList.find((ele): any => ele.code === 'order_value')
    minVal = tag.list.find((ele: { code: string }) => ele.code === 'min_value')
    if (minVal.value) setValue('MinOrderValue', minVal.value)
  } catch (error: any) {
    logger.error(`!!Error while extracting MinOrderValue in ${constants.SELECT}`, error)
  }

  const validDomains = ['ONDC:RET10', 'ONDC:RET13', 'ONDC:RET18']
  if (flow === FLOW.FLOW008 && validDomains.includes(context.domain)) {
    if (!minVal) {
      const key = `order_value`
      errorObj[key] = `Tags must contain "order_value" with Minimum Order Value`
    }
    if (minVal) {
      const price = getValue('selectedPrice')
      if (_.lt(price, minVal.value)) {
        const key = `minimum_order_value`
        errorObj[key] = `Order value must be greater or equal to Minimum Order Value`
      }
    }
  }

  try {
    const domains = ['ONDC:RET14', 'ONDC:RET15']
    if (flow === FLOW.FLOW016 && domains.includes(context.domain)) {
      const provider = onSearch?.message?.catalog['bpp/providers'].find(
        (provider: { id: any }) => provider.id === select.provider.id,
      )

      const getCategories = provider.categories.find((ele: any) => ele.id === 'CG1')
      const inputType = getCategories.tags
        .find((ele: any) => ele.code === 'config')
        .list?.find((ele: { code: string }): any => ele.code === 'input')
      if (inputType.value !== 'text') {
        const key = `customization`
        errorObj[key] = `customization input type must be text for Free text customizations flow`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking customization ${constants.SELECT}`, error)
  }
 if (flow === FLOW.FLOW016) {
      // Flow 016 specific validation - check for customization items and their relationships
      try {
        logger.info(`Checking for customization items in /${constants.SELECT} for flow 016`)
        
        const items = select.items
        if (!items || !Array.isArray(items) || items.length === 0) {
          errorObj.missingItems = `No items found in /${constants.SELECT} for flow 016`
          return isObjectEmpty(errorObj) ? {} : errorObj
        }
        
        // Get the custom groups saved from ON_SEARCH
        const customGroups = getValue('flow016_custom_groups')
        if (!customGroups || !Array.isArray(customGroups) || customGroups.length === 0) {
          errorObj.missingCustomGroups = `No custom groups were found in previous /${constants.ON_SEARCH} for flow 016`
          return isObjectEmpty(errorObj) ? {} : errorObj
        }
        
        // Find the regular item (type: item)
        const regularItem = items.find((item: any) => {
          return item.tags?.some((tag: any) => 
            tag.code === 'type' && 
            tag.list?.some((listItem: any) => listItem.code === 'type' && listItem.value === 'item')
          )
        })
        
        if (!regularItem) {
          errorObj.missingRegularItem = `No item with type 'item' found in /${constants.SELECT} for flow 016`
          return isObjectEmpty(errorObj) ? {} : errorObj
        }
        
        // Find the customization item (type: customization)
        const customizationItem = items.find((item: any) => {
          return item.tags?.some((tag: any) => 
            tag.code === 'type' && 
            tag.list?.some((listItem: any) => listItem.code === 'type' && listItem.value === 'customization')
          )
        })
        
        if (!customizationItem) {
          errorObj.missingCustomizationItem = `No item with type 'customization' found in /${constants.SELECT} for flow 016`
          return isObjectEmpty(errorObj) ? {} : errorObj
        }
        
        // Check if the customization item has the parent_item_id linked to the regular item
        if (customizationItem.parent_item_id !== regularItem.id) {
          errorObj.incorrectParentLink = `Customization item's parent_item_id '${customizationItem.parent_item_id}' doesn't match the regular item id '${regularItem.id}'`
        }
        
        // Check if the customization item has the descriptor with input_text
        const hasInputText = customizationItem.descriptor?.tags?.some((tag: any) => 
          tag.code === 'customization' && 
          tag.list?.some((listItem: any) => listItem.code === 'input_text' && listItem.value)
        )
        
        if (!hasInputText) {
          errorObj.missingInputText = `Customization item is missing descriptor.tags with code 'customization' and list with code 'input_text'`
        }
        
        // Check if the customization item parent matches a custom_group from ON_SEARCH
        let parentMatch = false
        const parentId = customizationItem.tags?.find((tag: any) => 
          tag.code === 'parent' && 
          tag.list?.some((listItem: any) => listItem.code === 'id')
        )?.list?.find((listItem: any) => listItem.code === 'id')?.value
        
        if (!parentId) {
          errorObj.missingParentId = `Customization item is missing parent.id tag reference in tags`
        } else {
          // Check if this parent id matches any custom group id from ON_SEARCH
          parentMatch = customGroups.some((group: any) => group.id === parentId)
          
          if (!parentMatch) {
            errorObj.invalidParentId = `Customization item parent id '${parentId}' doesn't match any custom_group id from ON_SEARCH`
          } else {
            logger.info(`Found valid customization item with parent id: ${parentId} matching a custom_group from ON_SEARCH`)
          }
        }
        
        // Save the validation result for reference in subsequent API calls
        setValue('flow016_customization_valid', !isObjectEmpty(errorObj))
        
      } catch (error: any) {
        logger.error(`Error while checking customization items in /${constants.SELECT} for flow 016, ${error.stack}`)
        errorObj.customizationCheckError = `Error validating customization items: ${error.message}`
      }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

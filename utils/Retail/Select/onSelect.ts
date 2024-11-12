/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence, ffCategory } from '../../../constants'
import { validateSchema, isObjectEmpty, checkContext, timeDiff, isoDurToSec, checkBppIdOrBapId } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { taxNotInlcusive } from '../../enum'

interface BreakupElement {
  '@ondc/org/title_type': string
  item?: {
    quantity: any
  }
}

const retailPymntTtl: { [key: string]: string } = {
  'delivery charges': 'delivery',
  'packing charges': 'packing',
  tax: 'tax',
  discount: 'discount',
  'convenience fee': 'misc',
}
export const checkOnSelect = (data: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }
  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.ON_SELECT, data)
  const domain = getValue(`domain`)
  const contextRes: any = checkContext(context, constants.ON_SELECT)

  const errorObj: any = {}
  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] = `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] = `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
  }

  if (!_.isEqual(data.context.domain.split(':')[1], domain)) {
    errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
  }

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
  const searchMessage: any = getValue(`${ApiSequence.ON_SEARCH}_message`)

  try {
    logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_SELECT}`)
    if (!_.isEqual(searchContext.city, context.city)) {
      errorObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_SELECT}`
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing timestamp of /${constants.SELECT} and /${constants.ON_SELECT}`)
    const tmpstmp = getValue('tmpstmp')
    if (_.gte(tmpstmp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.SELECT} api cannot be greater than or equal to /${constants.ON_SELECT} api`
    } else {
      const timeDifference = timeDiff(context.timestamp, tmpstmp)
      logger.info(timeDifference)
      if (timeDifference > 5000) {
        errorObj.tmpstmp = `context/timestamp difference between /${constants.ON_SELECT} and /${constants.SELECT} should be less than 5 sec`
      }
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.error(
      `!!Error while comparing timestamp for /${constants.SELECT} and /${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    // Checking for valid item ids in /on_select
    const itemsOnSelect = getValue('SelectItemList')
    const itemsList = message.order.items
    const selectItems: any = []
    itemsList.forEach((item: any, index: number) => {
      if (!itemsOnSelect?.includes(item.id)) {
        const key = `inVldItemId[${index}]`
        errorObj[key] = `Invalid Item Id provided in /${constants.ON_SELECT}: ${item.id}`
      } else {
        selectItems.push(item.id)
      }
    })
    setValue('SelectItemList', selectItems)
  } catch (error: any) {
    logger.error(`Error while checking for item IDs for /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    const fulfillments = message.order.fulfillments
    const selectFlflmntSet: any = []
    const fulfillment_tat_obj:any={}
    fulfillments.forEach((flflmnt: any) => {
      fulfillment_tat_obj[flflmnt.id] = isoDurToSec(flflmnt["@ondc/org/TAT"])
      selectFlflmntSet.push(flflmnt.id)
    })        
    setValue('selectFlflmntSet', selectFlflmntSet)
    setValue('fulfillment_tat_obj', fulfillment_tat_obj)
  } catch (error: any) {
    logger.error(`Error while checking for fulfillment IDs for /${constants.ON_SELECT}`, error.stack)
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    const txnId = getValue('txnId')
    if (!_.isEqual(txnId, context.transaction_id)) {
      errorObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] = `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
      if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
        errorObj[`${ApiSequence.ON_SELECT}_msgId`] = `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
  }

  let on_select_error: any = {}
  try {
    logger.info(`Checking domain-error in /${constants.ON_SELECT}`)
    if (data.hasOwnProperty('error')) {
      on_select_error = data.error
    }
  } catch (error: any) {
    logger.info(`Error while checking domain-error in /${constants.ON_SELECT}, ${error.stack}`)
  }

  const on_select: any = message.order

  const itemFlfllmnts: any = {}

  try {
    logger.info(`Checking provider id in /${constants.ON_SEARCH} and /${constants.ON_SELECT}`)
    if (getValue('providerId') != on_select.provider.id) {
      errorObj.prvdrId = `provider.id mismatches in /${constants.SELECT} and /${constants.ON_SELECT}`
    }
    if (!on_select.provider.locations) {
      errorObj.prvdrLoc = `provider.locations[0].id is missing in /${constants.ON_SELECT}`
    } else if (on_select.provider.locations[0].id != getValue('providerLoc')) {
      errorObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.SELECT} and /${constants.ON_SELECT}`
    }
  } catch (error: any) {
    logger.error(
      `Error while comparing provider ids in /${constants.ON_SEARCH} and /${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Item Id and Fulfillment Id Mapping in /on_select`)
    let i = 0
    const len = on_select.items.length
    while (i < len) {
      const found = on_select.fulfillments.some((fId: { id: any }) => fId.id === on_select.items[i].fulfillment_id)
      if (!found) {
        const key = `fId${i}`
        errorObj[key] = `fulfillment_id for item ${on_select.items[i].id} does not exist in order.fulfillments[]`
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Item Id and Fulfillment Id Mapping in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info('Mapping and storing item Id and fulfillment Id')
    let i = 0
    const len = on_select.items.length
    while (i < len) {
      const id = on_select.items[i].id
      itemFlfllmnts[id] = on_select.items[i].fulfillment_id
      i++
    }
    setValue('itemFlfllmnts', itemFlfllmnts)
  } catch (error: any) {
    logger.error(`!!Error occurred while mapping and storing item Id and fulfillment Id, ${error.stack}`)
  }

  try {
    logger.info(`Checking TAT and TTS in /${constants.ON_SELECT}`)
    const tts: any = getValue('timeToShip')
    on_select.fulfillments.forEach((ff: { [x: string]: any }, indx: any) => {
      const tat = isoDurToSec(ff['@ondc/org/TAT'])
      console.log("🚀 ~ on_select.fulfillments.forEach ~ tat:", tat)

      if (tat < tts) {
        errorObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be less than @ondc/org/time_to_ship (O2S) in /${constants.ON_SEARCH}`
      }

      if (tat === tts) {
        errorObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be equal to @ondc/org/time_to_ship (O2S) in /${constants.ON_SEARCH}`
      }

      logger.info(tat, 'asdfasdf', tts)
    })
  } catch (error: any) {
    logger.error(`!!Error while checking TAT and TTS in /${constants.ON_SELECT}`)
  }

  try {
    logger.info(`Checking TAT and TTS in /${constants.ON_SELECT} and /${constants.ON_SEARCH}`)
    const catalog = searchMessage.catalog
    const providers = catalog['bpp/providers']
    let max_time_to_ships = []
    for (let providerIndex = 0; providerIndex < providers.length; providerIndex++) {
      const providerItems = providers[providerIndex].items
      for (let itemIndex = 0; itemIndex < providerItems.length; itemIndex++) {
        const timeToShip = isoDurToSec(providerItems[itemIndex]['@ondc/org/time_to_ship'])
        if (timeToShip) {
          max_time_to_ships.push(timeToShip)
        }
      }
    }
    const max_tts = max_time_to_ships.sort((a, b) => a - b)[0]
    const on_select_tat = on_select.fulfillments.map((e: any) => isoDurToSec(e['@ondc/org/TAT']))

    if (on_select_tat < max_tts) {
      errorObj.ttstat = `/fulfillments/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be less than @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
    }

    if (on_select_tat === max_tts) {
      errorObj.ttstat = `/fulfillments/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be equal to @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
    }
  } catch (error: any) {
    logger.error(`!!Error while Checking TAT and TTS in /${constants.ON_SELECT} and /${constants.ON_SEARCH}`)
  }

  let nonServiceableFlag = 0
  try {
    logger.info(`Checking fulfillments' state in ${constants.ON_SELECT}`)
    const ffState = on_select.fulfillments.every((ff: { state: { descriptor: any } }) => {
      if (ff.state) {
        const ffDesc = ff.state.descriptor

        if (ffDesc.code === 'Non-serviceable') {
          nonServiceableFlag = 1
        }

        return ffDesc.hasOwnProperty('code')
          ? ffDesc.code === 'Serviceable' || ffDesc.code === 'Non-serviceable'
          : false
      }
      return
    })

    if (!ffState)
      errorObj.ffStateCode = `Pre-order fulfillment state codes should be used in fulfillments[].state.descriptor.code`
    else if (
      nonServiceableFlag &&
      (!on_select_error || !(on_select_error.type === 'DOMAIN-ERROR' && on_select_error.code === '30009'))
    ) {
      errorObj.notServiceable = `Non Serviceable Domain error should be provided when fulfillment is not serviceable`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking fulfillments' state in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking fulfillments' state in ${constants.ON_SELECT}`)
    on_select.fulfillments.forEach((ff: any, idx: number) => {
      if (ff.state) {
        const ffDesc = ff.state.descriptor

        function checkFFOrgCategory(selfPickupOrDelivery: number) {
          if (!ff["@ondc/org/category"] || !ffCategory[selfPickupOrDelivery].includes(ff["@ondc/org/category"])) {
            const key = `fulfillment${idx}/@ondc/org/category`
            errorObj[key] =
            `In Fulfillment${idx}, @ondc/org/category is not a valid value in ${constants.ON_SELECT} and should have one of these values ${[ffCategory[selfPickupOrDelivery]]}`
          }
          if(ff["type"] = "Delivery" && domain == "RET11" && ff["@ondc/org/category"] != "Immediate Delivery")
          {
            const key = `fulfillment${idx}/@ondc/org/category`
            errorObj[key] =
            `In Fulfillment${idx}, @ondc/org/category is not a valid value in ${constants.ON_SELECT} and should be "Immediate Delivery" in case of "F&B"}`
          }
        }
        if (ffDesc.code === 'Serviceable' && ff.type == "Delivery") {
          checkFFOrgCategory(0)
        }
        else if (ff.type == "Self-Pickup") {
          checkFFOrgCategory(1)
        }
      }
      else {
        const key = `fulfillment${idx}/descCode`
        errorObj[key] =
          `In Fulfillment${idx}, descriptor code is mandatory in ${constants.ON_SELECT}`
      }
    });
  } catch (error: any) {
    logger.error(`!!Error while checking fulfillments @ondc/org/category in /${constants.ON_SELECT}, ${error.stack}`)
  }


  let onSelectPrice: any = 0 //Net price after discounts and tax in /on_select
  let onSelectItemsPrice = 0 //Price of only items in /on_select

  try {
    logger.info(`Comparing count of items in ${constants.SELECT} and ${constants.ON_SELECT}`)
    const itemsIdList: any = getValue('itemsIdList')
    if (on_select.quote) {
      on_select.quote.breakup.forEach((item: { [x: string]: any }) => {
        if (item['@ondc/org/item_id'] in itemsIdList) {
          if (
            item['@ondc/org/title_type'] === 'item' &&
            itemsIdList[item['@ondc/org/item_id']] != item['@ondc/org/item_quantity'].count
          ) {
            const countkey = `invldCount[${item['@ondc/org/item_id']}]`
            errorObj[countkey] =
              `Count of item with id: ${item['@ondc/org/item_id']} does not match in ${constants.SELECT} & ${constants.ON_SELECT}`
          }
        }
      })
    } else {
      logger.error(`Missing quote object in ${constants.ON_SELECT}`)
      errorObj.missingQuote = `Missing quote object in ${constants.ON_SELECT}`
    }
  } catch (error: any) {
    // errorObj.countErr = `Count of item does not match with the count in /select`;
    logger.error(
      `!!Error while comparing count items in ${constants.SELECT} and ${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    const itemPrices = new Map()

    on_select.quote.breakup.forEach((item: { [x: string]: any; price: { value: any } }) => {
      if (item['@ondc/org/item_id'] && item.price && item.price.value && item['@ondc/org/title_type'] === 'item') {
        itemPrices.set(item['@ondc/org/item_id'], Math.abs(item.price.value))
      }
    })

    setValue('selectPriceMap', itemPrices)
  } catch (error: any) {
    logger.error(`!!Error while checking and comparing the quoted price in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking available and maximum count in ${constants.ON_SELECT}`)
    on_select.quote.breakup.forEach((element: any, i: any) => {
      const itemId = element['@ondc/org/item_id']
      if (
        element.item?.quantity &&
        element.item.quantity?.available &&
        element.item.quantity?.maximum &&
        typeof element.item.quantity.available.count === 'string' &&
        typeof element.item.quantity.maximum.count === 'string'
      ) {
        const availCount = parseInt(element.item.quantity.available.count, 10)
        const maxCount = parseInt(element.item.quantity.maximum.count, 10)
        if (isNaN(availCount) || isNaN(maxCount) || availCount <= 0) {
          errorObj[`qntcnt${i}`] =
            `Available and Maximum count should be greater than 0 for item id: ${itemId} in quote.breakup[${i}]`
        } else if (
          element.item.quantity.available.count.trim() === '' ||
          element.item.quantity.maximum.count.trim() === ''
        ) {
          errorObj[`qntcnt${i}`] =
            `Available or Maximum count should not be empty string for item id: ${itemId} in quote.breakup[${i}]`
        }
      }
    })
  } catch (error: any) {
    logger.error(`Error while checking available and maximum count in ${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`-x-x-x-x-Quote Breakup ${constants.ON_SELECT} all checks-x-x-x-x`)
    const itemsIdList: any = getValue('itemsIdList')
    const itemsCtgrs: any = getValue('itemsCtgrs')
    if (on_select.quote) {
      on_select.quote.breakup.forEach((element: any, i: any) => {
        const titleType = element['@ondc/org/title_type']

        logger.info(`Calculating quoted Price Breakup for element ${element.title}`)
        onSelectPrice += parseFloat(element.price.value)

        if (titleType === 'item') {
          if (!(element['@ondc/org/item_id'] in itemFlfllmnts)) {
            const brkupitemid = `brkupitemid${i}`
            errorObj[brkupitemid] =
              `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in items[]`
          }

          logger.info(`Comparing individual item's total price and unit price `)
          if (!element.hasOwnProperty('item')) {
            errorObj.priceBreakup = `Item's unit price missing in quote.breakup for item id ${element['@ondc/org/item_id']}`
          } else if (
            parseFloat(element.item.price.value) * element['@ondc/org/item_quantity'].count !=
            element.price.value
          ) {
            errorObj.priceBreakup = `Item's unit and total price mismatch for id: ${element['@ondc/org/item_id']}`
          }
        }

        logger.info(`Calculating Items' prices in /${constants.ON_SELECT}`)
        if (typeof itemsIdList === 'object' && itemsIdList && element['@ondc/org/item_id'] in itemsIdList) {
          if (
            titleType === 'item' ||
            (titleType === 'tax' && !taxNotInlcusive.includes(itemsCtgrs[element['@ondc/org/item_id']]))
          ) {
            onSelectItemsPrice += parseFloat(element.price.value)
          }
        }

        if (titleType === 'tax' || titleType === 'discount') {
          if (!(element['@ondc/org/item_id'] in itemFlfllmnts)) {
            const brkupitemsid = `brkupitemstitles${i}`
            errorObj[brkupitemsid] =
              `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in items[] (should be a valid item id)`
          }
        }

        // TODO:
        // if (['tax', 'discount', 'packing', 'misc'].includes(titleType)) {
        //   if (parseFloat(element.price.value) == 0) {
        //     const key = `breakupItem${titleType}`
        //     errorObj[key] = `${titleType} line item should not be present if price=0`
        //   }
        // }

        if (titleType === 'packing' || titleType === 'delivery' || titleType === 'misc') {
          if (!Object.values(itemFlfllmnts).includes(element['@ondc/org/item_id'])) {
            const brkupffid = `brkupfftitles${i}`
            errorObj[brkupffid] =
              `invalid  id: ${element['@ondc/org/item_id']} in ${titleType} line item (should be a valid fulfillment_id as provided in message.items for the items)`
          }
        }
      })

      setValue('onSelectPrice', on_select.quote.price.value)
      onSelectPrice = onSelectPrice.toFixed(2)

      logger.info(
        `Matching quoted Price ${parseFloat(on_select.quote.price.value)} with Breakup Price ${onSelectPrice}`,
      )
      if (Math.round(onSelectPrice) != Math.round(parseFloat(on_select.quote.price.value))) {
        errorObj.quoteBrkup = `quote.price.value ${on_select.quote.price.value} does not match with the price breakup ${onSelectPrice}`
      }

      const selectedPrice = getValue('selectedPrice')
      logger.info(
        `Matching price breakup of items ${onSelectItemsPrice} (/${constants.ON_SELECT}) with selected items price ${selectedPrice} (${constants.SELECT})`,
      )

      if (typeof selectedPrice === 'number' && onSelectItemsPrice !== selectedPrice) {
        errorObj.priceErr = `Warning: Quoted Price in /${constants.ON_SELECT} INR ${onSelectItemsPrice} does not match with the total price of items in /${constants.SELECT} INR ${selectedPrice} i.e price for the item mismatch in on_search and on_select`
        logger.info('Quoted Price and Selected Items price mismatch')
      }
    } else {
      logger.error(`Missing quote object in ${constants.ON_SELECT}`)
    }
  } catch (error: any) {
    logger.error(`!!Error while checking and comparing the quoted price in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    // checking if delivery line item present in case of Serviceable
    logger.info(`Checking if delivery line item present in case of Serviceable for ${constants.ON_SELECT}`)
    if (on_select.quote) {
      const quoteBreakup = on_select.quote.breakup
      const deliveryItems = quoteBreakup.filter(
        (item: { [x: string]: string }) => item['@ondc/org/title_type'] === 'delivery',
      )
      const noOfDeliveries = deliveryItems.length
      if (!noOfDeliveries && !nonServiceableFlag) {
        errorObj.deliveryLineItem = `delivery line item must be present in quote/breakup (if location is serviceable)`
      }

      // Checking for delivery charges in non servicable locations
      if (noOfDeliveries && nonServiceableFlag) {
        deliveryItems.map((e: any) => {
          if (e.price.value > 0) {
            logger.error('Delivery charges not applicable for non-servicable locations')
          }
        })
      }
    } else {
      logger.error(`Missing quote object in ${constants.ON_SELECT}`)
    }
  } catch (error: any) {
    logger.info(`!!Error occurred while checking delivery line item in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Checking payment breakup title & type in /${constants.ON_SELECT}`)
    if (on_select.quote) {
      on_select.quote.breakup.forEach((item: { [x: string]: any; title: string }) => {
        if (
          item['@ondc/org/title_type'] != 'item' &&
          !Object.values(retailPymntTtl).includes(item['@ondc/org/title_type'])
        ) {
          errorObj.pymntttltyp = `Quote breakup Payment title type "${item['@ondc/org/title_type']}" is not as per the API contract`
        }

        if (item['@ondc/org/title_type'] !== 'item' && !(item.title.toLowerCase().trim() in retailPymntTtl)) {
          errorObj.pymntttl = `Quote breakup Payment title "${item.title}" is not as per the API Contract`
        } else if (
          item['@ondc/org/title_type'] !== 'item' &&
          retailPymntTtl[item.title.toLowerCase().trim()] !== item['@ondc/org/title_type']
        ) {
          errorObj.pymntttlmap = `Quote breakup Payment title "${item.title}" comes under the title type "${retailPymntTtl[item.title.toLowerCase().trim()]
            }"`
        }
      })
    } else {
      logger.error(`Missing quote object in ${constants.ON_SELECT}`)
    }
  } catch (error: any) {
    logger.error(`!!Error while checking payment breakup title & type in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    //matching fulfillments TAT
    logger.info('Checking Fulfillment TAT...')
    on_select.fulfillments.forEach((ff: { [x: string]: any; id: any }) => {
      if (!ff['@ondc/org/TAT']) {
        logger.info(`Fulfillment TAT must be present for Fulfillment ID: ${ff.id}`)
        errorObj.ffTAT = `Fulfillment TAT must be present for fulfillment ID: ${ff.id}`
      }
    })
  } catch (error: any) {
    logger.info(`Error while checking fulfillments TAT in /${constants.ON_SELECT}`)
  }


  try {
    // Checking fulfillment.id, fulfillment.type and tracking
    logger.info('Checking fulfillment.id, fulfillment.type and tracking')
    on_select.fulfillments.forEach((ff: any) => {
      let ffId = ""
      if (!ff.id) {
        logger.info(`Fulfillment Id must be present `)
        errorObj["ffId"] = `Fulfillment Id must be present`
      }

      ffId = ff.id

      if (ffId) {
        if (ff.tracking === false || ff.tracking === true) {
          setValue(`${ffId}_tracking`, ff.tracking)
        }
        else {
          logger.info(`Tracking must be present for fulfillment ID: ${ff.id} in boolean form`)
          errorObj["ffTracking"] = `Tracking must be present for fulfillment ID: ${ff.id} in boolean form`
        }
      }
    })
  } catch (error: any) {
    logger.info(`Error while checking fulfillments id, type and tracking in /${constants.ON_SELECT}`)
  }

  try {
    logger.info('Checking quote validity quote.ttl')
    if (!on_select.quote.hasOwnProperty('ttl')) {
      errorObj.qtTtl = 'quote.ttl: Validity of the quote is missing'
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote.ttl in /${constants.ON_SELECT}`)
  }

  try {
    if (on_select.quote) {
      logger.info(`Storing Quote object in /${constants.ON_SELECT}`)
      on_select.quote.breakup.forEach((element: BreakupElement) => {
        if (element['@ondc/org/title_type'] === 'item') {
          if (element.item && element.item.hasOwnProperty('quantity')) {
            delete element.item.quantity
          }
        }
      })
      //saving on select quote
      setValue('quoteObj', on_select.quote)
    }
  } catch (error: any) {
    logger.error(`!!Error while storing quote object in /${constants.ON_SELECT}, ${error.stack}`)
  }

  // Checking fulfillmentID with providerID for ON_SELECT
  try {
    logger.info(`Comparing fulfillmentID with providerID for /${constants.ON_SELECT} `)
    const len: number = on_select.fulfillments.length
    let i = 0
    while (i < len) {
      const fulfillment_id = on_select.fulfillments[i].id
      const provider_id = on_select.provider.id
      if (fulfillment_id === provider_id) {
        logger.error(`FullfillmentID can't be equal to ProviderID on ${constants.ON_SELECT}`)
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!Error while comparing fulfillmentID with providerID in /${constants.ON_SELECT}, ${error.stack}`)
  }

  setValue('quote_price', on_select.quote.price.value)

  return Object.keys(errorObj).length > 0 && errorObj
}

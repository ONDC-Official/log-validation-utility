/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkContext, timeDiff, isoDurToSec, checkBppIdOrBapId } from '../../../utils'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { taxNotInlcusive } from '../../../utils/enum'

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

  const contextRes: any = checkContext(context, constants.ON_SELECT)

  const errorObj: any = {}

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

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
  const select: any = getValue(`${ApiSequence.SELECT}`)

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
    const tmpstmp = select.context.timestamp
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
    logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
      errorObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(select.context.message_id, context.message_id)) {
      errorObj.msgId = `Message Id for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
    )
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
      errorObj.prvdrId = `provider.id mismatches in /${constants.ON_SEARCH} and /${constants.ON_SELECT}`
    }
  } catch (error: any) {
    logger.info(
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

      if (tat < tts) {
        errorObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be less than @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
      }

      if (tat === tts) {
        errorObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be equal to @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
      }

      logger.info(tat, 'asdfasdf', tts)
    })
  } catch (error: any) {
    logger.error(`!!Error while checking TAT and TTS in /${constants.ON_SELECT}`)
  }

  let nonServiceableFlag = 0
  try {
    logger.info(`Checking fulfillments' state in ${constants.ON_SELECT}`)
    const ffState = on_select.fulfillments.every((ff: { state: { descriptor: any } }) => {
      const ffDesc = ff.state.descriptor
      if (ffDesc.code === 'Non-serviceable') {
        nonServiceableFlag = 1
      }

      return ffDesc.hasOwnProperty('code') ? ffDesc.code === 'Serviceable' || ffDesc.code === 'Non-serviceable' : false
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

  let onSelectPrice: any = 0 //Net price after discounts and tax in /on_select
  let onSelectItemsPrice = 0 //Price of only items in /on_select

  try {
    logger.info(`Comparing count of items in ${constants.SELECT} and ${constants.ON_SELECT}`)
    const itemsIdList: any = getValue('itemsIdList') || {}
    logger.info('itemsIdList', itemsIdList)
    on_select.quote.breakup.forEach((item: { [x: string]: any }) => {
      if (item['@ondc/org/item_id'] in itemsIdList && item['@ondc/org/title_type'] === 'item') {
        if (
          itemsIdList[item['@ondc/org/item_id']] != item['@ondc/org/item_quantity'].count &&
          (!on_select_error || on_select_error.type != 'DOMAIN-ERROR' || on_select_error.code != '40002')
        ) {
          const cntkey = `cnt${item['@ondc/org/item_id']}`
          errorObj[
            cntkey
          ] = `Count of item with id: ${item['@ondc/org/item_id']} does not match in ${constants.SELECT} & ${constants.ON_SELECT} (suitable domain error should be provided)`
        }
      }
    })
  } catch (error: any) {
    // errorObj.countErr = `Count of item does not match with the count in /select`;
    logger.error(
      `!!Error while comparing count items in ${constants.SELECT} and ${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`-x-x-x-x-Quote Breakup ${constants.ON_SELECT} all checks-x-x-x-x`)
    const itemsIdList: any = getValue('itemsIdList')
    const itemsCtgrs: any = getValue('itemsCtgrs')
    on_select.quote.breakup.forEach((element: any, i: any) => {
      const titleType = element['@ondc/org/title_type']
      // logger.info(element.price.value);

      logger.info(`Calculating quoted Price Breakup for element ${element.title}`)
      onSelectPrice += parseFloat(element.price.value)

      if (titleType === 'item') {
        if (!(element['@ondc/org/item_id'] in itemFlfllmnts)) {
          const brkupitemid = `brkupitemid${i}`
          errorObj[
            brkupitemid
          ] = `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in items[]`
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

        logger.info(`checking available and maximum count in ${constants.ON_SELECT}`)

        if (element.item.hasOwnProperty('quantity')) {
          if (
            _.gt(parseFloat(element.item.quantity.available.count), parseFloat(element.item.quantity.maximum.count))
          ) {
            const key = `qntcnt${i}`
            errorObj[
              key
            ] = `available count can't be greater than maximum count for item id: ${element['@ondc/org/item_id']}`
          }
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
          errorObj[
            brkupitemsid
          ] = `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in items[] (should be a valid item id)`
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
          errorObj[
            brkupffid
          ] = `invalid  id: ${element['@ondc/org/item_id']} in ${titleType} line item (should be a valid fulfillment_id)`
        }
      }
    })

    setValue('onSelectPrice', on_select.quote.price.value)
    onSelectPrice = onSelectPrice.toFixed(2)

    logger.info(`Matching quoted Price ${parseFloat(on_select.quote.price.value)} with Breakup Price ${onSelectPrice}`)
    if (onSelectPrice != parseFloat(on_select.quote.price.value)) {
      errorObj.quoteBrkup = `quote.price.value ${on_select.quote.price.value} does not match with the price breakup ${onSelectPrice}`
    }

    const selectedPrice = getValue('selectedPrice')
    logger.info(
      `Matching price breakup of items ${onSelectItemsPrice} (/${constants.ON_SELECT}) with selected items price ${selectedPrice} (${constants.SELECT})`,
    )

    if (typeof selectedPrice === 'number' && onSelectItemsPrice !== selectedPrice) {
      errorObj.priceErr = `Warning: Quoted Price in /${constants.ON_SELECT} INR ${onSelectItemsPrice} does not match with the total price of items in /${constants.SELECT} INR ${selectedPrice}`
      logger.info('Quoted Price and Selected Items price mismatch')
    }
  } catch (error: any) {
    logger.error(`!!Error while checking and comparing the quoted price in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    // checking if delivery line item present in case of Serviceable
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
  } catch (error: any) {
    logger.info(`!!Error occurred while checking delivery line item in /${constants.ON_SELECT}`)
  }

  try {
    logger.info(`Checking payment breakup title & type in /${constants.ON_SELECT}`)
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
        errorObj.pymntttlmap = `Quote breakup Payment title "${item.title}" comes under the title type "${
          retailPymntTtl[item.title.toLowerCase().trim()]
        }"`
      }
    })
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
    logger.info('Checking quote validity quote.ttl')
    if (!on_select.quote.hasOwnProperty('ttl')) {
      errorObj.qtTtl = 'quote.ttl: Validity of the quote is missing'
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote.ttl in /${constants.ON_SELECT}`)
  }

  try {
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

  return Object.keys(errorObj).length > 0 && errorObj
}

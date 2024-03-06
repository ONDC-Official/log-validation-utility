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
export const checkOnSelect_OOS = (data: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SELECT_OUT_OF_STOCK]: 'JSON cannot be empty' }
  }

  const { message, context, error } = data
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

  if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
    errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
  }

  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
  const select: any = getValue(`${ApiSequence.SELECT}`)
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
    if (!_.isEqual(select.context.message_id, context.message_id)) {
      errorObj.msgId = `Message Id for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.SELECT} and /${constants.ON_SELECT} api, ${error.stack}`,
    )
  }

  let ON_SELECT_OUT_OF_STOCK_error: any = {}
  try {
    logger.info(`Checking domain-error in /${constants.ON_SELECT}`)
    if (data.hasOwnProperty('error')) {
      ON_SELECT_OUT_OF_STOCK_error = data.error
    }
  } catch (error: any) {
    logger.info(`Error while checking domain-error in /${constants.ON_SELECT}, ${error.stack}`)
  }

  const ON_SELECT_OUT_OF_STOCK: any = message.order
  const itemFlfllmnts: any = {}

  try {
    logger.info(`Checking provider id in /${constants.ON_SEARCH} and /${constants.ON_SELECT}`)
    if (getValue('providerId') != ON_SELECT_OUT_OF_STOCK.provider.id) {
      errorObj.prvdrId = `provider.id mismatches in /${constants.ON_SEARCH} and /${constants.ON_SELECT}`
    }
    if (ON_SELECT_OUT_OF_STOCK.provider.locations[0].id != getValue('providerLoc')) {
      errorObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SELECT} and /${constants.SELECT}`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing provider ids in /${constants.ON_SEARCH} and /${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Item Id and Fulfillment Id Mapping in /ON_SELECT_OUT_OF_STOCK`)
    let i = 0
    const len = ON_SELECT_OUT_OF_STOCK.items.length
    while (i < len) {
      const found = ON_SELECT_OUT_OF_STOCK.fulfillments.some(
        (fId: { id: any }) => fId.id === ON_SELECT_OUT_OF_STOCK.items[i].fulfillment_id,
      )
      if (!found) {
        const key = `fId${i}`
        errorObj[key] =
          `fulfillment_id for item ${ON_SELECT_OUT_OF_STOCK.items[i].id} does not exist in order.fulfillments[]`
      }

      i++
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Item Id and Fulfillment Id Mapping in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info('Mapping and storing item Id and fulfillment Id')
    let i = 0
    const len = ON_SELECT_OUT_OF_STOCK.items.length
    while (i < len) {
      const id = ON_SELECT_OUT_OF_STOCK.items[i].id
      itemFlfllmnts[id] = ON_SELECT_OUT_OF_STOCK.items[i].fulfillment_id
      i++
    }

    setValue('itemFlfllmnts', itemFlfllmnts)
  } catch (error: any) {
    logger.error(`!!Error occurred while mapping and storing item Id and fulfillment Id, ${error.stack}`)
  }

  try {
    logger.info(`Checking TAT and TTS in /${constants.ON_SELECT}`)
    const tts: any = getValue('timeToShip')
    ON_SELECT_OUT_OF_STOCK.fulfillments.forEach((ff: { [x: string]: any }, indx: any) => {
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
    const ON_SELECT_OUT_OF_STOCK_tat = ON_SELECT_OUT_OF_STOCK.fulfillments.map((e: any) =>
      isoDurToSec(e['@ondc/org/TAT']),
    )

    if (ON_SELECT_OUT_OF_STOCK_tat < max_tts) {
      errorObj.ttstat = `/fulfillments/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be less than @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
    }

    if (ON_SELECT_OUT_OF_STOCK_tat === max_tts) {
      errorObj.ttstat = `/fulfillments/@ondc/org/TAT (O2D) in /${constants.ON_SELECT} can't be equal to @ondc/org/time_ship (O2S) in /${constants.ON_SEARCH}`
    }
  } catch (error: any) {
    logger.error(`!!Error while Checking TAT and TTS in /${constants.ON_SELECT} and /${constants.ON_SEARCH}`)
  }

  let nonServiceableFlag = 0
  try {
    logger.info(`Checking fulfillments' state in ${constants.ON_SELECT}`)
    const ffState = ON_SELECT_OUT_OF_STOCK.fulfillments.every((ff: { state: { descriptor: any } }) => {
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
      !ON_SELECT_OUT_OF_STOCK_error &&
      !(ON_SELECT_OUT_OF_STOCK_error.type === 'DOMAIN-ERROR' && ON_SELECT_OUT_OF_STOCK_error.code === '30009')
    ) {
      errorObj.notServiceable = `Non Serviceable Domain error should be provided when fulfillment is not serviceable`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking fulfillments' state in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    // Checking for valid item ids in /on_select
    const itemsOnSearch = getValue('SelectItemList')
    const itemsList = message.order.items
    const itemsOnSelect: any = []
    itemsList.forEach((item: any, index: number) => {
      if (!itemsOnSearch?.includes(item.id)) {
        const key = `inVldItemId[${index}]`
        errorObj[key] = `Invalid Item Id provided in /${constants.ON_SELECT}: ${item.id}`
      } else {
        itemsOnSelect.push(item.id)
      }
      setValue('SelectItemList', itemsOnSelect)
    })
  } catch (error: any) {
    logger.error(`Error while checking for item IDs for /${constants.ON_SELECT}`, error.stack)
  }

  let onSelectPrice: any = 0 //Net price after discounts and tax in /ON_SELECT_OUT_OF_STOCK
  let onSelectItemsPrice = 0 //Price of only items in /ON_SELECT_OUT_OF_STOCK

  try {
    logger.info(`Comparing count of items in ${constants.SELECT} and ${constants.ON_SELECT}`)
    const itemsIdList: any = getValue('itemsIdList')
    ON_SELECT_OUT_OF_STOCK.quote.breakup.forEach((item: { [x: string]: any }) => {
      if (item['@ondc/org/item_id'] in itemsIdList) {
        if (
          item['@ondc/org/title_type'] === 'item' &&
          itemsIdList[item['@ondc/org/item_id']] < item['@ondc/org/item_quantity'].count
        ) {
          errorObj[`InvldQuoteId[${item['@ondc/org/item_id']}]`] = [
            `Item with id: ${item['@ondc/org/item_id']} count is greater than or equal to  ${constants.SELECT}`,
          ]
        }
      } else if (item['@ondc/org/title_type'] === 'item') {
        errorObj[`InvldQuoteId[${item['@ondc/org/item_id']}]`] = [
          `Item with id: ${item['@ondc/org/item_id']} does not exist in items list of ${constants.SELECT}`,
        ]
      }
    })
  } catch (error: any) {
    logger.error(
      `!!Error while comparing count items in ${constants.SELECT} and ${constants.ON_SELECT}, ${error.stack}`,
    )
  }

  try {
    const breakup_msg = message.order.quote.breakup;
    const msg_err = error.message;
    const itemsIdList: any = getValue('itemsIdList') 
   
    logger.info(`Item Id and error.message.item_id Mapping in /ON_SELECT_OUT_OF_STOCK`);
   
    const errorArray = JSON.parse(msg_err);    
    let i = 0;

    const itemsReduced = breakup_msg.filter(
       (item: any) => item['@ondc/org/item_quantity'] && item['@ondc/org/item_quantity'].count < itemsIdList[item['@ondc/org/item_id']],
    );

    errorArray.forEach((errorItem: any) => {
      const isPresent = itemsReduced.some((item: any) => item['@ondc/org/item_id'] === errorItem.item_id);
      if (!isPresent) {
         const key = `msg/err/items_id${i}`;
         errorObj[key] = `Item isn't reduced ${errorItem.item_id} in ${msg_err} is not present in fullfillments/items `;
         i++;
      }
     });
    
    itemsReduced.forEach((item: any) => {
       const isPresentForward = errorArray.some((errorItem: any) => errorItem.item_id === item['@ondc/org/item_id']); 
       if (!isPresentForward ) {
         const key = `msg/err/items_id${i}`;
         errorObj[key] = `message/order/items for item ${item['@ondc/org/item_id']} does not match in ${msg_err} `;
         i++;
       }
    });
   } catch (error: any) {
    logger.error(`!!Error while checking Item Id and Mapping in ${error.message}`);
   }
   
  try {
    logger.info(`-x-x-x-x-Quote Breakup ${constants.ON_SELECT} all checks-x-x-x-x`)
    const itemsIdList: any = getValue('itemsIdList')
    const itemsCtgrs: any = getValue('itemsCtgrs')
    ON_SELECT_OUT_OF_STOCK.quote.breakup.forEach((element: any, i: any) => {
      const titleType = element['@ondc/org/title_type']
      // logger.info(element.price.value);

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

        logger.info(`checking available and maximum count in ${constants.ON_SELECT}`)
        if (
          element.item.quantity &&
          element.item.quantity.available &&
          typeof element.item.quantity.available.count === 'string'
        ) {
          const availCount = parseInt(element.item.quantity.available.count, 10)
          const maxCount = parseInt(element.item.quantity.maximum.count, 10)
          if (availCount < 0 || maxCount < 0) {
            const key = `qntcnt${i}`
            errorObj[key] =
              `Available and Maximum count should be greater than 0 for item id: ${element['@ondc/org/item_id']} in quote.breakup[${i}]`
          }
          if (availCount > maxCount) {
            const key = `qntcnt${i}`
            errorObj[key] =
              `Available count should not be greater than maximum count for item id: ${element['@ondc/org/item_id']} in quote.breakup[${i}]`
          }
        }

        if (
          element.item.quantity &&
          element.item.quantity.maximum &&
          typeof element.item.quantity.maximum.count === 'string' &&
          element.item.quantity.available &&
          typeof element.item.quantity.available.count === 'string'
        ) {
          const maxCount = parseInt(element.item.quantity.maximum.count, 10)
          const availCount = parseInt(element.item.quantity.available.count, 10)
          if (availCount == 99 && maxCount == 0) {
            const key = `qntcnt${i}`
            errorObj[key] = `item.quantity.maximum.count cant be 0 if item is in stock `
          }
        }
        if (element.item.quantity && element.item.quantity.maximum && element.item.quantity.available) {
          const maxCount = parseInt(element.item.quantity.maximum.count, 10)
          const availCount = parseInt(element.item.quantity.available.count, 10)

          if (availCount == 0 && maxCount > 0) {
            const key = `qntcnt${i}`
            errorObj[key] =
              `item.quantity.maximum.count cannont be greater than 0 if item.quantity.available.count is 0 `
          }
          if (availCount < element['@ondc/org/item_quantity'].count) {
            const key = `brkcnt${i}`
            errorObj[key] = `Available count can't be less than @ondc/org/item_quantity.count `
          }

          if (element['@ondc/org/item_quantity'].count == 0 && maxCount > 0 && availCount > 0) {
            const key = `qntcnt${i}`
            errorObj[key] =
              `item.quantity.maximum.count and item.quantity.available.count is cannot be greater than zero if "@ondc/org/item_quantity" is 0 `
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
          errorObj[brkupitemsid] =
            `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in items[] (should be a valid item id)`
        }
      }

      if (titleType === 'packing' || titleType === 'delivery' || titleType === 'misc') {
        if (!Object.values(itemFlfllmnts).includes(element['@ondc/org/item_id'])) {
          const brkupffid = `brkupfftitles${i}`
          errorObj[brkupffid] =
            `invalid  id: ${element['@ondc/org/item_id']} in ${titleType} line item (should be a valid fulfillment_id)`
        }
      }
    })

    setValue('onSelectPrice', ON_SELECT_OUT_OF_STOCK.quote.price.value)
    onSelectPrice = onSelectPrice.toFixed(2)

    logger.info(
      `Matching quoted Price ${parseFloat(ON_SELECT_OUT_OF_STOCK.quote.price.value)} with Breakup Price ${onSelectPrice}`,
    )
    if (onSelectPrice != parseFloat(ON_SELECT_OUT_OF_STOCK.quote.price.value)) {
      errorObj.quoteBrkup = `quote.price.value ${ON_SELECT_OUT_OF_STOCK.quote.price.value} does not match with the price breakup ${onSelectPrice}`
    }
    console.log(onSelectItemsPrice)
  } catch (error: any) {
    logger.error(`!!Error while checking and comparing the quoted price in /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    // checking if delivery line item present in case of Serviceable
    const quoteBreakup = ON_SELECT_OUT_OF_STOCK.quote.breakup
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
    ON_SELECT_OUT_OF_STOCK.quote.breakup.forEach((item: { [x: string]: any; title: string }) => {
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
    ON_SELECT_OUT_OF_STOCK.fulfillments.forEach((ff: { [x: string]: any; id: any }) => {
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
    if (!ON_SELECT_OUT_OF_STOCK.quote.hasOwnProperty('ttl')) {
      errorObj.qtTtl = 'quote.ttl: Validity of the quote is missing'
    }
  } catch (error: any) {
    logger.error(`!!Error while checking quote.ttl in /${constants.ON_SELECT}`)
  }

  try {
    logger.info(`Storing Quote object in /${constants.ON_SELECT}`)
    ON_SELECT_OUT_OF_STOCK.quote.breakup.forEach((element: BreakupElement) => {
      if (element['@ondc/org/title_type'] === 'item') {
        if (element.item && element.item.hasOwnProperty('quantity')) {
          delete element.item.quantity
        }
      }
    })
    //saving on select quote
    setValue('quoteObj', ON_SELECT_OUT_OF_STOCK.quote)
  } catch (error: any) {
    logger.error(`!!Error while storing quote object in /${constants.ON_SELECT}, ${error.stack}`)
  }

  // Checking fulfillmentID with providerID for ON_SELECT_OUT_OF_STOCK
  try {
    logger.info(`Comparing fulfillmentID with providerID for /${constants.ON_SELECT} `)
    const len: number = ON_SELECT_OUT_OF_STOCK.fulfillments.length
    let i = 0
    while (i < len) {
      const fulfillment_id = ON_SELECT_OUT_OF_STOCK.fulfillments[i].id
      const provider_id = ON_SELECT_OUT_OF_STOCK.provider.id
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

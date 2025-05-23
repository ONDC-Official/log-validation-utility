/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants, { ApiSequence, ffCategory } from '../../../constants'
import { validateSchemaRetailV2, isObjectEmpty, checkContext, timeDiff, isoDurToSec, checkBppIdOrBapId } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'
import { FLOW, taxNotInlcusive } from '../../enum'

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
  offer: 'offer',
}
export const checkOnSelect = (data: any,flow?:string) => {
  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SELECT]: 'JSON cannot be empty' }
  }
  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }
  const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_SELECT, data)
  const contextRes: any = checkContext(context, constants.ON_SELECT)

  const errorObj: any = {}
  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] =
        `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.SELECT} and /${constants.ON_SELECT}`)
    if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] =
        `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SELECT}, ${error.stack}`)
  }

  if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
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
    const fulfillment_tat_obj: any = {}
    fulfillments.forEach((flflmnt: any) => {
      fulfillment_tat_obj[flflmnt.id] = isoDurToSec(flflmnt['@ondc/org/TAT'])
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
      errorObj[`${ApiSequence.ON_SELECT}_msgId`] =
        `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
      if (!_.isEqual(getValue(`${ApiSequence.SELECT}_msgId`), context.message_id)) {
        errorObj[`${ApiSequence.ON_SELECT}_msgId`] =
          `Message Ids for /${constants.SELECT} and /${constants.ON_SELECT} api should be same`
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
          if (!ff['@ondc/org/category'] || !ffCategory[selfPickupOrDelivery].includes(ff['@ondc/org/category'])) {
            const key = `fulfillment${idx}/@ondc/org/category`
            errorObj[key] =
              `In Fulfillment${idx}, @ondc/org/category is not a valid value in ${constants.ON_SELECT} and should have one of these values ${[ffCategory[selfPickupOrDelivery]]}`
          }
          const domain = data.context.domain.split(':')[1]
          if (ff.type === 'Delivery' && domain === 'RET11' && ff['@ondc/org/category'] !== 'Immediate Delivery') {
            const key = `fulfillment${idx}/@ondc/org/category`
            errorObj[key] =
              `In Fulfillment${idx}, @ondc/org/category should be "Immediate Delivery" for F&B in ${constants.ON_SELECT}`
          }
        }
        if (ffDesc.code === 'Serviceable' && ff.type == 'Delivery') {
          checkFFOrgCategory(0)
        } else if (ff.type == 'Self-Pickup') {
          checkFFOrgCategory(1)
        }
      } else {
        const key = `fulfillment${idx}/descCode`
        errorObj[key] = `In Fulfillment${idx}, descriptor code is mandatory in ${constants.ON_SELECT}`
      }
    })
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
    const providerOffers: any = getValue(`${ApiSequence.ON_SEARCH}_offers`)
    const applicableOffers: any[] = []
    const orderItemIds = on_select?.items?.map((item: any) => item.id) || []
    const items: any = orderItemIds
      .map((id: any) => {
        const item = on_select?.quote?.breakup.find((entry: any) => entry['@ondc/org/item_id'] === id)
        return item ? { id, price: item.price.value } : null
      })
      .filter((item: any) => item !== null)
    console.log('itemPrices of found items in breakup', JSON.stringify(items))

    const priceSums = items.reduce((acc: Record<string, number>, item: { id: string; price: string }) => {
      const { id, price } = item
      acc[id] = (acc[id] || 0) + parseFloat(price)
      return acc
    }, {})

    console.log('providerOffers', JSON.stringify(providerOffers))
    if (on_select.quote) {
      const totalWithoutOffers = on_select?.quote?.breakup.reduce((sum: any, item: any) => {
        if (item['@ondc/org/title_type'] !== 'offer') {
          const value = parseFloat(item.price?.value || '0')
          return sum + value
        }
        return sum
      }, 0)

      console.log('Total without offers:', totalWithoutOffers.toFixed(2))
      const offers: any = on_select.quote.breakup.filter((offer: any) => offer['@ondc/org/title_type'] === 'offer')
      const applicableOffer = getValue('selected_offer')
      console.log('applicableOffer', applicableOffer)
      const deliveryCharges =
        Math.abs(
          parseFloat(
            on_select.quote.breakup.find((item: any) => item['@ondc/org/title_type'] === 'delivery')?.price?.value,
          ),
        ) || 0

      if (offers.length > 0) {
        setValue('on_select_offers', offers)
        const additiveOffers = offers.filter((offer: any) => {
          const metaTag = offer?.item.tags?.find((tag: any) => tag.code === 'offer')
          return metaTag?.list?.some((entry: any) => entry.code === 'additive' && entry.value.toLowerCase() === 'yes')
        })

        const nonAdditiveOffers = offers.filter((offer: any) => {
          const metaTag = offer?.item.tags?.find((tag: any) => tag.code === 'offer')
          return metaTag?.list?.some((entry: any) => entry.code === 'additive' && entry.value.toLowerCase() === 'no')
        })

        if (additiveOffers.length > 0) {
          offers.length = 0
          additiveOffers.forEach((offer: any) => {
            const providerOffer = providerOffers.find((o: any) => o.id === offer.id)
            if (providerOffer) {
              applicableOffers.push(providerOffer)
            }
          })
        } else if (nonAdditiveOffers.length === 1) {
          // Apply the single non-additive offer
          applicableOffers.length = 0
          const offer = nonAdditiveOffers[0]
          const offerId = offer?.item?.tags
            ?.find((tag: any) => tag.code === 'offer')
            ?.list?.find((entry: any) => entry.code === 'id')?.value
          const providerOffer = providerOffers.find((o: any) => o.id === offerId)
          if (providerOffer) {
            applicableOffers.push(providerOffer)
          }
        } else if (nonAdditiveOffers.length > 1) {
          console.log('nonAdditiveOffers', nonAdditiveOffers)

          applicableOffers.length = 0
          nonAdditiveOffers.forEach((offer: any) => {
            errorObj[`offer[${offer.index}]`] =
              `Offer ${offer.id} is non-additive and cannot be combined with other non-additive offers.`
          })
          // setValue('Addtive-Offers',false)
          return
        }
        console.log('Applicable Offers:', applicableOffers)
      }
      on_select.quote.breakup.forEach((element: any, i: any) => {
        const titleType = element['@ondc/org/title_type']

        console.log(`Calculating quoted Price Breakup for element ${element.title}`)
        if (titleType === 'offer') {
          const priceValue = parseFloat(element.price.value)

          if (isNaN(priceValue)) {
            errorObj.invalidPrice = `Price for title type "offer" is not a valid number.`
          } else if (priceValue >= 0) {
            errorObj.positivePrice = `Price for title type "offer" must be negative, but got ${priceValue}.`
          }
        }
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
        if (titleType === 'offer' && providerOffers.length > 0 && offers.length > 0) {
          try {
            if (applicableOffers?.length > 0) {
              const offerType = element?.item?.tags
                ?.find((tag: any) => tag.code === 'offer')
                ?.list?.find((entry: any) => entry.code === 'type')?.value
              const offerId = element?.item?.tags
                ?.find((tag: any) => tag.code === 'offer')
                ?.list?.find((entry: any) => entry.code === 'id')?.value
              const onSelectOfferAutoApplicable = element?.item?.tags
                ?.find((tag: any) => tag.code === 'offer')
                ?.list?.find((entry: any) => entry.code === 'auto')?.value
              if (!offerId) {
                errorObj['inVldItemId'] = [`offerId cannot be null or empty.`]
                return
              }
              const quoteType =
                element?.item?.tags
                  .find((tag: any) => tag.code === 'quote')
                  ?.list?.map((type: any) => type.value)
                  .join(',') || ''

              console.log('quoteType', quoteType)
              // if(quoteType == "order"){
              //   const offerId = element['@ondc/org/item_id']
              //   if (!offerId) {
              //     errorObj['inVldItemId'] = [`offerId cannot be null or empty.`]
              //     return
              //   }
              //   const applicableOffer = getValue('selected_offer')
              //   console.log('applicableOffer', applicableOffer)
              //   const offer = applicableOffer?.find((offer: any) => offer?.id === offerId)
              //   if(!offer){
              //     errorObj[`invalidOffer`] =
              //     `Offer with id '${offerId}' is not applicable for this order.`;
              //   return;
              //   }

              // }
              const offerPriceValue: number = Math.abs(parseFloat(element?.price?.value))
              console.log('offerType', offerType)
              console.log('offerId', offerId)

              // const applicableOffer = getValue('selected_offer')
              // console.log('applicableOffer', applicableOffer)
              const selectedOffer = applicableOffer?.find((offer: any) => offer?.id === offerId)
              if (!applicableOffer) {
                const providerOffer = applicableOffers?.find((p: any) => p?.id === offerId)
                const providerMetaTag =
                  providerOffer?.tags
                    ?.find((tag: any) => tag.code === 'meta')
                    ?.list?.find((code: any) => code.code === 'auto')?.value || {}
                const offerAutoApplicable: boolean =
                  providerMetaTag === onSelectOfferAutoApplicable && onSelectOfferAutoApplicable === 'yes'
                if (!offerAutoApplicable && offerId) {
                  errorObj[`invalidOffer[${offerId}]`] =
                    `Offer with id '${offerId}' is not applicable for this order as this offer cannot be auto applied but found in on select as defined in the catalog.`
                  return
                }
                if (!selectedOffer && !offerAutoApplicable) {
                  const key = `inVldItemId[${i}]`
                  errorObj[key] =
                    `item with id: ${element['@ondc/org/item_id']} in quote.breakup[${i}] does not exist in select offers id (should be a valid item id)`
                }
              }

              const providerOffer = providerOffers?.find((p: any) => p?.id === offerId)
              const orderLocationIds = on_select?.provider?.locations?.map((loc: any) => loc.id) || []

              console.log('providerOffer', JSON.stringify(providerOffer))

              const offerLocationIds = providerOffer?.location_ids || []
              const locationMatch = offerLocationIds.some((id: string) => orderLocationIds.includes(id))

              if (!locationMatch) {
                errorObj[`offer_location[${i}]`] =
                  `Offer with id '${offerId}' is not applicable for any of the order's locations. \nApplicable locations in offer: [${offerLocationIds.join(', ')}], \nLocations in order: [${orderLocationIds.join(', ')}].`
                return
              }

              const offerItemIds = providerOffer?.item_ids || []
              const itemMatch = offerItemIds.some((id: string) => orderItemIds.includes(id))

              if (!itemMatch && titleType === 'buyXgetY') {
                errorObj[`offer_item[${i}]`] =
                  `Offer with id '${offerId}' is not applicable for any of the ordered item(s). \nApplicable items in offer: [${offerItemIds.join(', ')}], \nItems in order: [${orderItemIds.join(', ')}].`
              }

              const benefitTag: any = providerOffer?.tags?.find((tag: any) => {
                return tag?.code === 'benefit'
              })
              const benefitList = benefitTag?.list || []
              const qualifierTag: any = providerOffer?.tags?.find((tag: any) => {
                return tag?.code === 'qualifier'
              })
              const qualifierList: any = qualifierTag?.list || []
              console.log('qualifierList', qualifierList, qualifierTag)

              const minValue = parseFloat(qualifierList.find((l: any) => l.code === 'min_value')?.value) || 0
              console.log('min_value', minValue)
              const itemsOnSearch: any = getValue(`onSearchItems`)
              console.log('itemsOnSearch', JSON.stringify(itemsOnSearch))
              if (offerType === 'discount') {
                if (minValue > 0 && minValue !== null) {
                  const qualifies: boolean = totalWithoutOffers >= minValue
                  console.log('qualifies', qualifies, minValue)

                  if (!qualifies) {
                    errorObj['priceErr'] =
                      `Offer not applicable for quote with actual quote value before discount is ${totalWithoutOffers} as required  min_value for order is ${minValue}`
                  }
                }

                const benefitList = benefitTag?.list || []

                const valueType = benefitList.find((l: any) => l?.code === 'value_type')?.value
                const value_cap = Math.abs(
                  parseFloat(benefitList.find((l: any) => l?.code === 'value_cap')?.value || '0'),
                )
                const benefitAmount = Math.abs(
                  parseFloat(benefitList.find((l: any) => l.code === 'value')?.value || '0'),
                )
                const quotedPrice = parseFloat(on_select.quote.price.value || '0')

                let benefitValue = 0
                let qualifies = false

                if (valueType === 'percent') {
                  if (value_cap > 0) {
                    benefitValue = (benefitAmount / 100) * value_cap

                    if (offerPriceValue !== benefitValue) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${benefitValue.toFixed(2)} (i.e., ${benefitAmount}% of capped value ₹${value_cap}), but found -₹${offerPriceValue.toFixed(2)}.`
                    }

                    qualifies = Math.abs(value_cap - benefitValue - quotedPrice) < 0.01

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Quoted price mismatch: After ${benefitAmount}% discount on ₹${value_cap}, expected price is ₹${(value_cap - benefitValue).toFixed(2)}, but got ₹${quotedPrice.toFixed(2)}.`
                    }
                  } else {
                    const quotePercentageAmount = (benefitAmount / 100) * totalWithoutOffers

                    if (offerPriceValue !== quotePercentageAmount) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${quotePercentageAmount.toFixed(2)} (i.e., ${benefitAmount}% of ₹${totalWithoutOffers}), but found -₹${offerPriceValue.toFixed(2)}.`
                    }

                    const quoteAfterBenefit = totalWithoutOffers - quotePercentageAmount
                    qualifies = Math.abs(quoteAfterBenefit - quotedPrice) < 0.01

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Quoted price mismatch: After ${benefitAmount}% discount on ₹${totalWithoutOffers}, expected price is ₹${quoteAfterBenefit.toFixed(2)}, but got ₹${quotedPrice.toFixed(2)}.`
                    }
                  }
                } else {
                  if (value_cap > 0) {
                    benefitValue = value_cap - benefitAmount

                    if (offerPriceValue !== benefitAmount) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${benefitAmount.toFixed(2)} (from capped value ₹${value_cap}), but found -₹${offerPriceValue.toFixed(2)}.`
                    }

                    qualifies = Math.abs(benefitValue - quotedPrice) < 0.01

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Quoted price mismatch: After applying ₹${benefitAmount} on cap ₹${value_cap}, expected price is ₹${benefitValue.toFixed(2)}, but got ₹${quotedPrice.toFixed(2)}.`
                    }
                  } else {
                    const quoteAfterBenefit = totalWithoutOffers - benefitAmount

                    if (offerPriceValue !== benefitAmount) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${benefitAmount.toFixed(2)}, but found -₹${offerPriceValue.toFixed(2)}.`
                    }

                    qualifies = Math.abs(quoteAfterBenefit - quotedPrice) < 0.01

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Quoted price mismatch: After ₹${benefitAmount} discount on ₹${totalWithoutOffers}, expected price is ₹${quoteAfterBenefit.toFixed(2)}, but got ₹${quotedPrice.toFixed(2)}.`
                    }
                  }
                }
              }

              if (offerType === 'freebie') {
                // const benefitTag: any = providerOffer?.tags?.find((tag: any) => {
                //   return tag?.code === 'benefit'
                // })
                // const benefitList = benefitTag?.list || []
                // const qualifierTag: any = providerOffer?.tags?.find((tag: any) => {
                //   return tag?.code === 'qualifier'
                // })
                // if(!benefitTag){
                //   errorObj.invalidTags = `bpp/providers/offers/${offerId} tags with code benefit are missing and required`
                //   return
                // }
                // const qualifierList: any = qualifierTag?.list || []
                // console.log('qualifierList', qualifierList, qualifierTag)

                // const minValue = parseFloat(qualifierList.find((l: any) => l.code === 'min_value')?.value) || 0
                // console.log('min_value', minValue)

                if (minValue > 0 && minValue !== null) {
                  console.log('benefit lsit', benefitList)
                  const qualifies: boolean = totalWithoutOffers >= minValue

                  console.log('qualifies', qualifies, minValue)

                  if (!qualifies) {
                    errorObj['priceErr'] =
                      `Offer not applicable for quote with actual quote value before discount is ${totalWithoutOffers} as required  min_value for order is ${minValue}`
                  }
                  const benefitItemId = benefitList.find((entry: any) => entry.code === 'item_id')?.value || ''
                  const benefitItemCount = parseInt(
                    benefitList.find((entry: any) => entry.code === 'item_count')?.value || '0',
                  )
                  const itemTags = element?.item?.tags || []

                  const offerTag = itemTags.find((tag: any) => tag.code === 'offer')
                  if (!offerTag) {
                    errorObj.invalidTags = `tags are required in on_select   /quote with @ondc/org/title_type:${titleType} and offerId:${offerId}`
                  }

                  const offerItemId = offerTag?.list?.find((entry: any) => entry.code === 'item_id')?.value || ''
                  const offerItemCount = parseInt(
                    offerTag?.list?.find((entry: any) => entry.code === 'item_count')?.value || '0',
                  )
                  if (!offerItemCount) {
                    errorObj.invalidItems = `item_count is required in on_select   /quote with @ondc/org/title_type:${titleType} `
                  }
                  if (offerItemId !== benefitItemId) {
                    errorObj.invalidItems = `Mismatch: item_id used in on_select quote.breakup (${offerItemId}) doesn't match with offer benefit item_id (${benefitItemId}) in on_search catalog for offer ID: ${offerId}`
                  }
                  if (benefitItemCount !== offerItemCount) {
                    errorObj.invalidItems = `Mismatch: item_id used in on_select quote.breakup (${offerItemCount}) quantity doesn't match with offer benefit item_id (${benefitItemCount}) in on_search catalog  for offer ID: ${offerId}`
                  }
                  if (!offerItemId) {
                    errorObj.invalidItems = `item_id is required in on_select   /quote with @ondc/org/title_type:${titleType} with  offer_id:${offerId}`
                  }

                  // const offerPrice = Math.abs(parseFloat(element?.price?.value || '0'))

                  const itemIds = offerItemId.split(',').map((id: string) => id.trim())

                  const matchedItems = itemsOnSearch[0].filter((item: any) => itemIds.includes(item.id))

                  const priceMismatchItems: string[] = []
                  let totalExpectedOfferValue: number = 0
                  console.log(totalExpectedOfferValue)
                  let allItemsEligible = true

                  matchedItems.forEach((item: any) => {
                    const itemPrice = Math.abs(parseFloat(item?.price?.value || '0'))
                    const availableCount = parseInt(item?.quantity?.available?.count || '0', 10)

                    // Calculate the expected total price for the item
                    const expectedItemTotal = itemPrice * offerItemCount
                    totalExpectedOfferValue += expectedItemTotal

                    // Validate stock availability
                    if (availableCount < offerItemCount) {
                      errorObj.invalidItems = `Item ID: ${item.id} does not have sufficient stock. Required: ${offerItemCount}, Available: ${availableCount}`
                      allItemsEligible = false
                    }

                    // Validate price consistency
                    const quotedPrice = Math.abs(parseFloat(element?.price?.value || '0'))
                    if (expectedItemTotal !== quotedPrice) {
                      priceMismatchItems.push(
                        `ID: ${item.id} (Expected Total: ₹${expectedItemTotal}, Quoted: ₹${quotedPrice})`,
                      )
                      allItemsEligible = false
                    }
                  })

                  if (priceMismatchItems.length > 0) {
                    errorObj.priceMismatch = `Price mismatch found for item(s): ${priceMismatchItems.join('; ')}`
                  }

                  if (!allItemsEligible) {
                    const missingOrOutOfStock = itemIds.filter((id: string) => {
                      const matchedItem = matchedItems.find((item: any) => item.id === id)
                      if (!matchedItem) return true
                      const availableCount = parseInt(matchedItem?.quantity?.available?.count || '0', 10)
                      return availableCount < offerItemCount
                    })

                    if (missingOrOutOfStock.length > 0) {
                      errorObj.invalidItems = `Item(s) with ID(s) ${missingOrOutOfStock.join(', ')} not found in catalog or do not have enough stock for offer ID: ${offerId}`
                    }
                  }
                } else {
                  console.log('benefit lsit', benefitList)
                  const benefitItemId = benefitList.find((entry: any) => entry.code === 'item_id')?.value || ''
                  const benefitItemCount = parseInt(
                    benefitList.find((entry: any) => entry.code === 'item_count')?.value || '0',
                  )
                  const itemTags = element?.item?.tags || []

                  const offerTag = itemTags.find((tag: any) => tag.code === 'offer')
                  if (!offerTag) {
                    errorObj.invalidTags = `tags are required in on_select   /quote with @ondc/org/title_type:${titleType} and offerId:${offerId}`
                  }

                  const offerItemId = offerTag?.list?.find((entry: any) => entry.code === 'item_id')?.value || ''
                  const offerItemCount = parseInt(
                    offerTag?.list?.find((entry: any) => entry.code === 'item_count')?.value || '0',
                  )
                  if (!offerItemCount) {
                    errorObj.invalidItems = `item_count is required in on_select   /quote with @ondc/org/title_type:${titleType} `
                  }
                  if (offerItemId !== benefitItemId) {
                    errorObj.invalidItems = `Mismatch: item_id used in on_select quote.breakup (${offerItemId}) doesn't match with offer benefit item_id (${benefitItemId}) in on_search catalog for offer ID: ${offerId}`
                  }
                  if (benefitItemCount !== offerItemCount) {
                    errorObj.invalidItems = `Mismatch: item_id used in on_select quote.breakup (${offerItemCount}) quantity doesn't match with offer benefit item_id (${benefitItemCount}) in on_search catalog  for offer ID: ${offerId}`
                  }
                  if (!offerItemId) {
                    errorObj.invalidItems = `item_id is required in on_select   /quote with @ondc/org/title_type:${titleType} with  offer_id:${offerId}`
                  }

                  // const offerPrice = Math.abs(parseFloat(element?.price?.value || '0'))

                  const itemIds = offerItemId.split(',').map((id: string) => id.trim())
                  // let totalExpectedOfferValue = 0
                  const matchedItems = itemsOnSearch[0].filter((item: any) => itemIds.includes(item.id))

                  const priceMismatchItems: string[] = []
                  let totalExpectedOfferValue = 0
                  console.log(totalExpectedOfferValue)
                  let allItemsEligible = true

                  matchedItems.forEach((item: any) => {
                    const itemPrice = Math.abs(parseFloat(item?.price?.value || '0'))
                    const availableCount = parseInt(item?.quantity?.available?.count || '0', 10)

                    // Calculate the expected total price for the item
                    const expectedItemTotal = itemPrice * offerItemCount
                    totalExpectedOfferValue += expectedItemTotal

                    // Validate stock availability
                    if (availableCount < offerItemCount) {
                      errorObj.invalidItems = `Item ID: ${item.id} does not have sufficient stock. Required: ${offerItemCount}, Available: ${availableCount}`
                      allItemsEligible = false
                    }

                    // Validate price consistency
                    const quotedPrice = Math.abs(parseFloat(element?.price?.value || '0'))
                    if (expectedItemTotal !== quotedPrice) {
                      priceMismatchItems.push(
                        `ID: ${item.id} (Expected Total: ₹${expectedItemTotal}, Quoted: ₹${quotedPrice})`,
                      )
                      allItemsEligible = false
                    }
                  })

                  // Report any price mismatches
                  if (priceMismatchItems.length > 0) {
                    errorObj.priceMismatch = `Price mismatch found for item(s): ${priceMismatchItems.join('; ')}`
                  }

                  // If not all items are eligible, identify missing or out-of-stock items
                  if (!allItemsEligible) {
                    const missingOrOutOfStock = itemIds.filter((id: string) => {
                      const matchedItem = matchedItems.find((item: any) => item.id === id)
                      if (!matchedItem) return true
                      const availableCount = parseInt(matchedItem?.quantity?.available?.count || '0', 10)
                      return availableCount < offerItemCount
                    })

                    if (missingOrOutOfStock.length > 0) {
                      errorObj.invalidItems = `Item(s) with ID(s) ${missingOrOutOfStock.join(', ')} not found in catalog or do not have enough stock for offer ID: ${offerId}`
                    }
                  }
                }
              }

              if (offerType === 'buyXgetY') {
                const offerMinItemCount =
                  parseFloat(qualifierList.find((l: any) => l.code === 'item_count')?.value) || 0
                if (!offerMinItemCount || offerMinItemCount === 0) {
                  errorObj.invalidItems = `Minimum Item Count required in catalog /offers/tags/qualifier/list/code:item_count or minimum item_count cannot be 0 for offer with id :${offerId}`
                }
                if (minValue > 0 && minValue !== null) {
                  const qualifies: boolean = minValue >= priceSums
                  console.log('qualifies', qualifies, minValue)

                  if (!qualifies) {
                    errorObj['priceErr'] =
                      `Offer not applicable as required ${minValue} min_value for order is not satisfied`
                  }
                }
                const benefitItemId = benefitList.find((entry: any) => entry.code === 'item_id')?.value || ''
                const benefitItemCount = parseInt(
                  benefitList.find((entry: any) => entry.code === 'item_count')?.value || '0',
                )
                const itemTags = element?.item?.tags || []

                const offerTag = itemTags.find((tag: any) => tag.code === 'offer')
                if (!offerTag) {
                  errorObj.invalidTags = `tags are required in on_select   /quote with @ondc/org/title_type:${titleType} and offerId:${offerId}`
                }

                const offerItemId = offerTag?.list?.find((entry: any) => entry.code === 'item_id')?.value || ''
                const offerItemCount = parseInt(
                  offerTag?.list?.find((entry: any) => entry.code === 'item_count')?.value || '0',
                )
                if (!offerItemCount) {
                  errorObj.invalidItems = `item_count is required in on_select   /quote with @ondc/org/title_type:${titleType} and offerId:${offerId} `
                }
                if (offerItemId !== benefitItemId) {
                  errorObj.invalidBenefitItem = `Mismatch: item_id used in on_select quote.breakup (${offerItemId}) doesn't match with offer benefit item_id (${benefitItemId}) in on_search catalog for offer ID: ${offerId}`
                }
                if (benefitItemCount !== offerItemCount) {
                  errorObj.invalidItemCount = `Mismatch: item_count used in on_select quote.breakup (${offerItemCount}) quantity doesn't match with offer benefit item_count (${benefitItemCount}) in on_search catalog  for offer ID: ${offerId}`
                }
                if (offerItemId) {
                  const itemIds = offerItemId.split(',').map((id: string) => id.trim())
                  // let totalExpectedOfferValue = 0
                  const matchedItems = itemsOnSearch[0].filter((item: any) => itemIds.includes(item.id))

                  const priceMismatchItems: string[] = []
                  let totalExpectedOfferValue = 0
                  console.log(totalExpectedOfferValue)
                  let allItemsEligible = true

                  matchedItems.forEach((item: any) => {
                    const itemPrice = Math.abs(parseFloat(item?.price?.value || '0'))
                    const availableCount = parseInt(item?.quantity?.available?.count || '0', 10)

                    // Calculate the expected total price for the item
                    const expectedItemTotal = itemPrice * offerItemCount
                    totalExpectedOfferValue += expectedItemTotal

                    // Validate stock availability
                    if (availableCount < offerItemCount) {
                      errorObj.invalidItems = `Item ID: ${item.id} does not have sufficient stock. Required: ${offerItemCount}, Available: ${availableCount}`
                      allItemsEligible = false
                    }

                    // Validate price consistency
                    const quotedPrice = Math.abs(parseFloat(element?.price?.value || '0'))
                    if (expectedItemTotal !== quotedPrice) {
                      priceMismatchItems.push(
                        `ID: ${item.id} (Expected Total: ₹${expectedItemTotal}, Quoted: ₹${quotedPrice})`,
                      )
                      allItemsEligible = false
                    }
                  })

                  // Report any price mismatches
                  if (priceMismatchItems.length > 0) {
                    errorObj.priceMismatch = `Price mismatch found for item(s): ${priceMismatchItems.join('; ')}`
                  }

                  // If not all items are eligible, identify missing or out-of-stock items
                  if (!allItemsEligible) {
                    const missingOrOutOfStock = itemIds.filter((id: string) => {
                      const matchedItem = matchedItems.find((item: any) => item.id === id)
                      if (!matchedItem) return true
                      const availableCount = parseInt(matchedItem?.quantity?.available?.count || '0', 10)
                      return availableCount < offerItemCount
                    })

                    if (missingOrOutOfStock.length > 0) {
                      errorObj.invalidItems = `Item(s) with ID(s) ${missingOrOutOfStock.join(', ')} not found in catalog or do not have enough stock for offer ID: ${offerId}`
                    }
                  }
                }
              }
              if (offerType === 'delivery' && quoteType === 'fulfillment') {
                if (deliveryCharges > 0 || deliveryCharges !== null) {
                  if (minValue > 0 && minValue !== null) {
                    const qualifies: boolean = totalWithoutOffers >= minValue
                    console.log('qualifies', qualifies, minValue)

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Offer not applicable for quote with actual quote value before discount is ${totalWithoutOffers} as required  min_value for order is ${minValue}`
                    }
                  }

                  const benefitList = benefitTag?.list || []

                  const valueType = benefitList.find((l: any) => l?.code === 'value_type')?.value
                  const value_cap = Math.abs(
                    parseFloat(benefitList.find((l: any) => l?.code === 'value_cap')?.value || '0'),
                  )
                  const benefitValue = Math.abs(
                    parseFloat(benefitList.find((l: any) => l.code === 'value')?.value || '0'),
                  )
                  const quotedPrice = parseFloat(on_select.quote.price.value || '0')
                  let qualifies = false

                  if (valueType === 'percent') {
                    if (value_cap === 0) {
                      errorObj['priceErr'] = `Offer benefit amount cannot be equal to ${value_cap}`
                    } else {
                      console.log('delivery charges', deliveryCharges, offerPriceValue)
                      let expectedDiscount = 0
                      expectedDiscount = (benefitValue / 100) * deliveryCharges
                      if (expectedDiscount > value_cap) {
                        expectedDiscount = value_cap
                      }
                      if (expectedDiscount > deliveryCharges) {
                        errorObj.priceMismatch = `Discount exceeds delivery charge. Discount: ₹${expectedDiscount.toFixed(2)}, Delivery Charge: ₹${deliveryCharges.toFixed(2)}`
                      }
                      if (offerPriceValue !== expectedDiscount) {
                        errorObj.priceMismatch = `Discount value mismatch. Expected: -${expectedDiscount.toFixed(2)}, Found: -${offerPriceValue.toFixed(2)}`
                      }
                    }
                  } else {
                    if (benefitValue !== offerPriceValue) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${benefitValue.toFixed(2)}, but found -₹${offerPriceValue.toFixed(2)}. in offer with ${offerId} in ${titleType}`
                    }

                    if (offerPriceValue !== deliveryCharges) {
                      errorObj['priceErr'] =
                        `Discount mismatch: Expected discount is -₹${offerPriceValue.toFixed(2)}, but delivery charges are -₹${deliveryCharges.toFixed(2)}.`
                    }

                    const quoteAfterBenefit = totalWithoutOffers - benefitValue

                    qualifies = Math.abs(quoteAfterBenefit - quotedPrice) < 0.01

                    if (!qualifies) {
                      errorObj['priceErr'] =
                        `Quoted price mismatch: After ₹${benefitValue} discount on ₹${totalWithoutOffers}, expected price is ₹${quoteAfterBenefit.toFixed(2)}, but got ₹${quotedPrice.toFixed(2)}.`
                    }
                  }
                } else {
                  errorObj.invalidOfferType = `item with id: ${offerId} in quote.breakup[${i}] does not exist in items[]. Hence offer cannot be applied for this order.`
                }
              }
            }
          } catch (error: any) {
            logger.error(
              `!!Error while checking and validating the offer price in /${constants.ON_SELECT}, ${error.stack}`,
            )
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

        if (
          item['@ondc/org/title_type'] !== 'item' &&
          item['@ondc/org/title_type'] !== 'offer' &&
          !(item.title.toLowerCase().trim() in retailPymntTtl)
        ) {
          errorObj.pymntttl = `Quote breakup Payment title "${item.title}" is not as per the API Contract`
        } else if (
          item['@ondc/org/title_type'] !== 'item' &&
          item['@ondc/org/title_type'] !== 'offer' &&
          retailPymntTtl[item.title.toLowerCase().trim()] !== item['@ondc/org/title_type']
        ) {
          errorObj.pymntttlmap = `Quote breakup Payment title "${item.title}" comes under the title type "${retailPymntTtl[item.title.toLowerCase().trim()]}"`
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
      let ffId = ''
      if (!ff.id) {
        logger.info(`Fulfillment Id must be present `)
        errorObj['ffId'] = `Fulfillment Id must be present`
      }

      ffId = ff.id

      if (ffId) {
        if (ff.tracking === false || ff.tracking === true) {
          setValue(`${ffId}_tracking`, ff.tracking)
        } else {
          logger.info(`Tracking must be present for fulfillment ID: ${ff.id} in boolean form`)
          errorObj['ffTracking'] = `Tracking must be present for fulfillment ID: ${ff.id} in boolean form`
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
  const MinOrderValue = getValue('MinOrderValue')
  if (MinOrderValue) {
    if (_.lt(Number(on_select.quote.price.value), Number(MinOrderValue))) {
      const key = `orderValue`
      errorObj[key] = `Order value must be greater or equal to Minimum Order Value`
    }
  }
  if(flow===FLOW.FLOW003){
    const fulfillments = on_select.fulfillments
  setValue('fulfillmentSlots',fulfillments)

  }

   if (flow === FLOW.FLOW016) {
        // Flow 016 specific validation - check for customization items and their relationships
        try {
          logger.info(`Checking for customization items in /${constants.SELECT} for flow 016`)
          
          const items = on_select.items
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
          console.log('hasInputText', hasInputText)
          
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

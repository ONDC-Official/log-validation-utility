import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchemaRetailV2, isObjectEmpty, checkContext, checkItemTag, checkBppIdOrBapId } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { FLOW, OFFERSFLOW } from '../../../utils/enum'

export const checkInit = (data: any, msgIdSet: any, flow: string) => {
  const initObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.INIT]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)
    const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.INIT, data)

    const contextRes: any = checkContext(context, constants.INIT)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(initObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(initObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(initObj, schemaValidation)
    }
    if (_.isEqual(data.context, getValue(`domain`))) {
      initObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    if (!contextRes?.valid) {
      Object.assign(initObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.INIT}`, data)

    try {
      logger.info(`Checking context for /${constants.INIT} API`) //checking context
      const res: any = checkContext(context, constants.INIT)
      if (!res.valid) {
        Object.assign(initObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.INIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.INIT}`)

      if (!_.isEqual(searchContext.city, context.city)) {
        initObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.INIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.SEARCH} and /${constants.INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_SELECT} and /${constants.INIT}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        initObj.tmpstmp = `Timestamp for  /${constants.ON_SELECT} api cannot be greater than or equal to /init api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_SELECT} and /${constants.INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.INIT}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        initObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Adding Message Id /${constants.INIT}`)
      if (msgIdSet.has(context.message_id)) {
        initObj[`${ApiSequence.INIT}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
      setValue(`${ApiSequence.INIT}_msgId`, data.context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.INIT}, ${error.stack}`)
    }

    const init = message.order
    try {
      const on_selectFulfillment = getValue('fulfillment_item_obj')
      if (flow === FLOW.FLOW01D) {
        const isValid = init.items.every((item: any) => {
          return on_selectFulfillment.some(
            (entry: any) => entry.id === item.id && entry.fulfillment_id === item.fulfillment_id,
          )
        })

        if (!isValid) {
          initObj['mismatchFulfillmentId'] =
            `item Id with Respective Fulfillment_id mismatches in /${constants.ON_SELECT} and /${constants.INIT}`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items object in /${constants.SELECT} and /${constants.INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing provider object in /${constants.SELECT} and /${constants.INIT}`)

      if (getValue('providerId') != init.provider['id']) {
        initObj.prvdId = `Provider Id mismatches in /${constants.SELECT} and /${constants.INIT}`
      }

      if (getValue('providerLoc') != init.provider.locations[0].id) {
        initObj.prvdfrLoc = `Provider.locations[0].id mismatches in /${constants.SELECT} and /${constants.INIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.SELECT} and /${constants.INIT}, ${error.stack}`,
      )
    }

    try {
      //checking address components length
      const noOfFulfillments = init.fulfillments.length //will be 1 ideally
      let i = 0
      while (i < noOfFulfillments) {
        const address = init.fulfillments[i].end.location.address

        const lenName = address.name.length
        const lenBuilding = address.building.length
        const lenLocality = address.locality.length

        if (lenName + lenBuilding + lenLocality >= 190) {
          initObj.addressLen = `address.name + address.building + address.locality should be less than 190 chars;`
        }

        if (lenBuilding <= 3) {
          initObj.lenBuilding = `address.building should be more than 3 chars`
        }

        if (lenName <= 3) {
          initObj.lenName = `address.name should be more than 3 chars`
        }

        if (lenLocality <= 3) {
          initObj.lenLocality = `address.locality should be more than 3 chars`
        }

        if (
          address.building === address.locality ||
          address.name === address.building ||
          address.name === address.locality
        ) {
          initObj.addressComponents = `value of address.name, address.building and address.locality should be unique`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking address components in /${constants.INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Storing billing address in /${constants.INIT}`)
      setValue('billing', init.billing)
    } catch (error: any) {
      logger.error(`!!Error while storing billing object in /${constants.INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.INIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = init.items.length
      while (i < len) {
        const itemId = init.items[i].id
        const item = init.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          initObj[itemkey] =
            `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.ON_SEARCH} and /${constants.INIT}`
        }

        if (parentItemIdSet && item.parent_item_id && !parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          initObj[itemkey] =
            `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SEARCH} and /${constants.INIT}`
        }

        if (itemId in itemFlfllmnts) {
          const validFfIds = Array.isArray(itemFlfllmnts[itemId])
            ? itemFlfllmnts[itemId]
            : [itemFlfllmnts[itemId]];

          if (!validFfIds.includes(init.items[i].fulfillment_id)) {
            const itemkey = `item_FFErr${i}`;
            initObj[itemkey] =
              `items[${i}].fulfillment_id (${init.items[i].fulfillment_id}) does not match any valid fulfillment_id for Item ${itemId} in /${constants.ON_SELECT}`;
          }
        } else {
          const itemkey = `item_FFErr${i}`;
          initObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`;
        }

        if (itemId in itemsIdList) {
          if (init.items[i].quantity.count != itemsIdList[itemId]) {
            initObj.countErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.INIT}`)
    }
    try {
      logger.info(`Comparing offer Ids in /${constants.SELECT} and /${constants.INIT}`)
      const applicableOffers: any[] = []
      if (init?.offers && init?.offers.length > 0) {
        const providerOffers: any = getValue(`${ApiSequence.ON_SEARCH}_offers`)
        const orderItemIds = init?.items?.map((item: any) => item.id) || []
        const orderLocationIds = init?.provider?.locations?.map((item: any) => item.id) || []

        init.offers.forEach((offer: any, index: number) => {
          const providerOffer = providerOffers?.find(
            (providedOffer: any) => providedOffer?.id.toLowerCase() === offer?.id.toLowerCase(),
          )
          console.log('providerOffer in select call', JSON.stringify(providerOffer))

          if (!providerOffer) {
            initObj[`offer[${index}]`] = `Offer with id ${offer.id} is not available for the provider.`
            return
          }

          const offerLocationIds = providerOffer?.location_ids || []
          const locationMatch = offerLocationIds.some((id: string) => orderLocationIds.includes(id))
          if (!locationMatch) {
            initObj[`offer[${index}]`] =
              `Offer with id '${offer.id}' is not applicable for any of the order's locations [${orderLocationIds.join(', ')}].`
            return
          }

          const offerItemIds = providerOffer?.item_ids || []
          const itemMatch = offerItemIds.some((id: string) => orderItemIds.includes(id))
          if (!itemMatch) {
            initObj[`offer[${index}]`] =
              `Offer with id '${offer.id}' is not applicable for any of the ordered item(s) [${orderItemIds.join(', ')}].`
            return
          }

          const { label, range } = providerOffer?.time || {}
          const start = range?.start
          const end = range?.end
          if (label !== 'valid' || !start || !end) {
            initObj[`offer[${index}]`] = `Offer with id ${offer.id} has an invalid or missing time configuration.`
            return
          }

          const currentTimeStamp = new Date(context?.timestamp)
          const startTime = new Date(start)
          const endTime = new Date(end)
          if (!(currentTimeStamp >= startTime && currentTimeStamp <= endTime)) {
            initObj[`offer[${index}]`] = `Offer with id ${offer.id} is not currently valid based on time range.`
            return
          }

          const isSelected = offer?.tags?.some(
            (tag: any) =>
              tag.code === 'selection' &&
              tag.list?.some((entry: any) => entry.code === 'apply' && entry.value === 'yes'),
          )
          if (!isSelected) {
            initObj[`offer[${index}]`] = `Offer with id ${offer.id} is not selected (apply: "yes" missing).`
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
            initObj[`offer[${offer.index}]`] =
              `Offer ${offer.id} is non-additive and cannot be combined with other non-additive offers.`
          })
          // setValue('Addtive-Offers',false)
          return
        }
        console.log('Applicable Offers:', applicableOffers)
        setValue('init_offer', applicableOffers)
      }
      const applicableOfferIds = applicableOffers.map((offer: any) => offer.id.toLowerCase())
      const initOffersIds = init?.offers?.map((offer: any) => offer.id.toLowerCase())
      const selectOffers = getValue('selected_offer')
      console.log('select offers', JSON.stringify(selectOffers))
      if (selectOffers && !initOffersIds) {
        initObj['offers'] = `Offers are required in init call when given in select call`
      }
      if (selectOffers && initOffersIds.length > 0) {
        selectOffers.forEach((offer: any) => {
          const offerTagId = offer?.id

          if (offerTagId && !initOffersIds.includes(offerTagId)) {
            const itemkey = `offer_${offerTagId}`
            initObj[itemkey] =
              `Offer Id mismatched in select /quote/offer with ${offerTagId} in /${constants.SELECT} and /${constants.INIT}`
            console.log(`Unmatched offer ID: ${offerTagId}`)
          }
        })
      }

      const on_select_offers = getValue('on_select_offers')
      console.log('offers in init call', JSON.stringify(on_select_offers))
      if (on_select_offers?.length > 1 || on_select_offers !== null)
        if (applicableOfferIds) {
          const hasMatchingOffer = on_select_offers.some((offer: any) => {
            const offerTagId = offer.item?.tags
              ?.find((tag: any) => tag.code === 'offer')
              ?.list?.find((entry: any) => entry.code === 'id')
              ?.value?.toLowerCase()

            return offerTagId && applicableOfferIds.includes(offerTagId)
          })
          if (!hasMatchingOffer) {
            const OFFER_NOT_FOUND_MSG = `No matching offer ID found in /${constants.ON_SELECT} and /${constants.INIT}`
            initObj.offerNotFound = OFFER_NOT_FOUND_MSG
          }
        }
    } catch (error: any) {
      logger.error(`!!Error while comparing Offer Id in /${constants.ON_SELECT} and /${constants.INIT}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.INIT}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = init.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        const id = init.fulfillments[i].id
        if (id) {
          if(flow === FLOW.FLOW002){
            const onSelectSelfPickupFulfillment = getValue('selfPickupFulfillment')
            if(id !== onSelectSelfPickupFulfillment.id){
              initObj['invldFlmntId'] = `Mismatch in on_init fulfillment.id: ${id} with on_select Self-Pickup fulfillment id: ${onSelectSelfPickupFulfillment.id}  for Flow: ${FLOW.FLOW002}`
            }
            if(init.fulfillments[i].type !== onSelectSelfPickupFulfillment.type){
              initObj['invldFlmntId'] = `Mismatch in on_init fulfillment.type: ${init.fulfillments[i].type} with on_select fulfillment.type: ${onSelectSelfPickupFulfillment.type}  for Flow: ${FLOW.FLOW002}`
            }
          }
          const key = `ffID ${id}`
          const isItemIdPresent = Object.values(itemFlfllmnts).some((val) => {
            if (Array.isArray(val)) {
              return val.includes(id)
            }
            return val === id
          })

          if (!isItemIdPresent) {
            initObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
          // if (!Object.values(itemFlfllmnts).includes(id)) {

          //   //MM->Mismatch
          //   initObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          // }

          if (!_.isEqual(init.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
            const gpskey = `ff/end/location/gpsKey${i}`
            initObj[gpskey] =
              `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.INIT}`
          }

          if (!_.isEqual(init.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
            const addrkey = `addrKey${i}`
            initObj[addrkey] =
              `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.INIT}`
          }
        } else {
          initObj.ffId = `fulfillments[${i}].id is missing in /${constants.INIT}`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.INIT}, ${error.stack}`)
    }

    try {
      const collect_payment = getValue('collect_payment')
      if ((init?.offers && init?.offers.length > 0) || flow === OFFERSFLOW.FLOW0098) {
        const providerOffers: any = getValue(`${ApiSequence.ON_SEARCH}_offers`)
        init.offers.forEach((offer: any, index: number) => {
          const providerOffer = providerOffers?.find(
            (providedOffer: any) => providedOffer?.id.toLowerCase() === offer?.id.toLowerCase(),
          )
          console.log('providerOffer in select call', JSON.stringify(providerOffer))

          if (!providerOffer) {
            initObj[`offer[${index}]`] = `Offer with id ${offer.id} is not available for the provider.`
            return
          }
        })
      }
      // if()
      if (flow === FLOW.FLOW0099 || collect_payment === 'N') {
        const bapTermsTag = init.tags.find((tag: any) => tag.code === 'bap_terms')
        if (bapTermsTag?.code !== 'bap_terms' || !Array.isArray(bapTermsTag.list)) {
          initObj['bap_terms'] = "'bap_terms' tag must have a valid 'list' array."
          return
        }

        const typeEntry = bapTermsTag.list.find((item: any) => item.code === 'finance_cost_type')
        const valueEntry = bapTermsTag.list.find((item: any) => item.code === 'finance_cost_value')

        if (!typeEntry || !['percent', 'amount'].includes(typeEntry.value)) {
          initObj['bap_terms_type'] = "'finance_cost_type' must be present and one of 'percent' or 'amount'"
        }

        if (!valueEntry || isNaN(Number(valueEntry.value))) {
          initObj['bap_terms_value'] = "'finance_cost_value' must be a valid number"
        }
      }
    } catch (error) {}

    return initObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
  }
}

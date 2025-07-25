/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence, PAYMENT_STATUS } from '../../../constants'
import { logger } from '../../../shared/logger'
import {
  validateSchemaRetailV2,
  isObjectEmpty,
  checkContext,
  timeDiff as timeDifference,
  compareCoordinates,
  checkItemTag,
  checkBppIdOrBapId,
  areGSTNumbersMatching,
  compareObjects,
  sumQuoteBreakUp,
  payment_status,
  compareQuoteObjects,
  compareLists,
  isoDurToSec,
  // getProviderId,
  deepCompare,
  compareFinanceTermsTags,
  validateFinanceTxnTag,
} from '../..'
import { FLOW, OFFERSFLOW } from '../../enum'
import { getValue, setValue } from '../../../shared/dao'
export const checkOnConfirm = (data: any, flow: string) => {
  const onCnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_CONFIRM]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    try {
      logger.info(`Comparing Message Ids of /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      if (!_.isEqual(getValue(`${ApiSequence.CONFIRM}_msgId`), context.message_id)) {
        onCnfrmObj[`${ApiSequence.ON_CONFIRM}_msgId`] =
          `Message Ids for /${constants.CONFIRM} and /${constants.ON_CONFIRM} api should be same`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_SEARCHINC}, ${error.stack}`)
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)

    const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_CONFIRM, data)

    const contextRes: any = checkContext(context, constants.ON_CONFIRM)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onCnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onCnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(onCnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnfrmObj, contextRes.ERRORS)
    }
    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onCnfrmObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    setValue(`${ApiSequence.ON_CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_CONFIRM}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onCnfrmObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.SEARCH} and /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const tmpstmp = getValue('tmpstmp')
      if (_.gte(tmpstmp, context.timestamp)) {
        onCnfrmObj.tmpstmp = `Timestamp for /${constants.CONFIRM} api cannot be greater than or equal to /${constants.ON_CONFIRM} api`
      } else {
        const timeDiff = timeDifference(context.timestamp, tmpstmp)
        logger.info(timeDiff)
        if (timeDiff > 5000) {
          onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.ON_CONFIRM} and /${constants.CONFIRM} should be less than 5 sec`
        }
      }
      setValue('tmpstmp', context.timestamp)
      setValue('onCnfrmtmpstmp', context.timestamp)
    } catch (error: any) {
      logger.info(
        `Error while comparing timestamp for /${constants.CONFIRM} and /${constants.ON_CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_CONFIRM}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onCnfrmObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_CONFIRM} api, ${error.stack}`,
      )
    }

    const on_confirm = message.order

    try {
      logger.info(`Checking Cancellation terms for /${constants.ON_CONFIRM}`)
      const OnInitCancellationTerms = getValue('OnInitCancellationTerms')
      const Errors = compareObjects(OnInitCancellationTerms,message.order.cancellation_terms)
         if (Errors) {
        let i = 0
        const len = Errors.length
        while (i < len) {
          const key = `cancellationTermsErr${i}`
          console.log('Errors[i]', Errors[i])
          onCnfrmObj[key] = `${Errors[i]} when compared with on_init Cancellation terms`
          i++
        }
      }
      // if (message.order.cancellation_terms && message.order.cancellation_terms.length > 0) {
      //   onCnfrmObj[`message.order`] =
      //     `'cancellation_terms' in /message/order should not be provided as those are not enabled yet`
      // }
    } catch (error: any) {
      logger.error(`!!Error while checking Cancellation terms for /${constants.ON_CONFIRM}, ${error.stack}`)
    }
    try {
      logger.info(`Checking fulfillment ids for  /${constants.ON_CONFIRM}`)
      message.order.fulfillments.forEach((fulfillment: any) => {
        if (!fulfillment['@ondc/org/TAT']) {
          onCnfrmObj[`message.order.fulfillments[${fulfillment.id}]`] =
            `'TAT' must be provided in message/order/fulfillments`
        }
        const on_select_fulfillment_tat_obj: any = getValue('fulfillment_tat_obj')
        const fulfillment_id = fulfillment.id

        logger.info(`Checking TAT Mistatch between  /${constants.ON_CONFIRM} & /${constants.ON_SELECT}`)
        if (
          on_select_fulfillment_tat_obj !== null &&
          on_select_fulfillment_tat_obj[fulfillment_id] !== isoDurToSec(fulfillment['@ondc/org/TAT'])
        ) {
          onCnfrmObj[`TAT_Mismatch`] =
            `TAT Mistatch between  /${constants.ON_CONFIRM} i.e ${isoDurToSec(fulfillment['@ondc/org/TAT'])} seconds & /${constants.ON_SELECT} i.e ${on_select_fulfillment_tat_obj[fulfillment_id]} seconds`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while Checking fulfillment ids for  /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing order ids in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      if (getValue('cnfrmOrdrId') != on_confirm.id) {
        onCnfrmObj.orderID = `Order Id mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while trying to fetch order ids in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`checking created_at and updated_at timestamp in /${constants.ON_CONFIRM}`)
      const cnfrmOrdrCrtd = getValue('ordrCrtd')
      const cnfrmOrdrUpdtd = getValue('ordrUpdtd')
      if (!_.isEmpty(on_confirm?.state)) setValue('orderState', on_confirm.state)
      setValue('onCnfrmState', on_confirm.state)
      if (on_confirm.state === 'Created' || on_confirm.state === 'Accepted') {
        if (cnfrmOrdrCrtd && (!on_confirm.created_at || on_confirm.created_at != cnfrmOrdrCrtd)) {
          onCnfrmObj.crtdtmstmp = `order.created_at timestamp mismatches in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`
        }

        if (on_confirm.updated_at) {
          setValue('PreviousUpdatedTimestamp', on_confirm.updated_at)
        }
        if (
          cnfrmOrdrUpdtd &&
          (!on_confirm.updated_at ||
            _.gte(cnfrmOrdrUpdtd, on_confirm.updated_at) ||
            on_confirm.updated_at != getValue('tmpstmp'))
        ) {
          onCnfrmObj.updtdtmstmp = `order.updated_at timestamp should be updated as per the context.timestamp (since default fulfillment state is added)`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking order timestamps in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.ON_CONFIRM}`)
      if (on_confirm.provider.id != getValue('providerId')) {
        onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CONFIRM}`
      }

      if (on_confirm.provider.locations[0].id != getValue('providerLoc')) {
        onCnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = on_confirm.items.length

      while (i < len) {
        const itemId = on_confirm.items[i].id
        const item = on_confirm.items[i]

        if (checkItemTag(item, select_customIdArray)) {
          const itemkey = `item${i}tags.parent_id`
          onCnfrmObj[itemkey] =
            `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.SELECT} and /${constants.INIT}`
        }

        if (parentItemIdSet && item.parent_item_id && !parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          onCnfrmObj[itemkey] =
            `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SEARCH} and /${constants.ON_INIT}`
        }

        if (itemId in itemFlfllmnts) {
          const validFfIds = Array.isArray(itemFlfllmnts[itemId])
            ? itemFlfllmnts[itemId]
            : [itemFlfllmnts[itemId]];

          if (!validFfIds.includes(on_confirm.items[i].fulfillment_id)) {
            const itemkey = `item_FFErr${i}`;
            onCnfrmObj[itemkey] =
              `items[${i}].fulfillment_id (${on_confirm.items[i].fulfillment_id}) does not match any valid fulfillment_id for Item ${itemId} in /${constants.ON_SELECT}`;
          }
        } else {
          const itemkey = `item_FFErr${i}`;
          onCnfrmObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`;
        }

        if (itemId in itemsIdList) {
          if (on_confirm.items[i].quantity.count != itemsIdList[itemId]) {
            onCnfrmObj.countErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Storing fulfillment from ${constants.ON_CONFIRM}`)

      const fulfillmentTypes = ['Delivery', 'Buyer-Delivery']

      const fulfillments = on_confirm.fulfillments || []
      const foundType:any = fulfillmentTypes.find(type => fulfillments.some((f: any) => f.type === type))


      const matchingFulfillments = fulfillments.filter((f: any) => f.type === foundType)

      console.log("Matching fulfillments:", JSON.stringify(matchingFulfillments))

      const validFulfillment = matchingFulfillments.find((f: any) => {
        const startRange = f.start?.time?.range
        const endRange = f.end?.time?.range
        return startRange && endRange
      })

      if (validFulfillment) {
        const keyBase = foundType.replace(/[-\s]/g, '')
        setValue(`${keyBase}Fulfillment`, validFulfillment)
        setValue(`${keyBase}FulfillmentAction`, ApiSequence.ON_CONFIRM)
        logger.info(`Stored valid fulfillment of type ${foundType}`)
      } else {
        logger.warn(`${foundType} fulfillment(s) found but no valid time range`)
      }

    } catch (error: any) {
      logger.error(`Error while storing fulfillment: ${error.stack}`)
    }



    // if (on_confirm.state === 'Accepted') {
    //   try {
    //     // For Delivery Object
    //     const fulfillments = on_confirm.fulfillments
    //     if (fulfillments) {
    //       const deliveryFulfillment = fulfillments.find((f: any) => f.type === 'Delivery')
    //       if (!deliveryFulfillment.hasOwnProperty('provider_id')) {
    //         const key = `missingFulfillments`
    //         onCnfrmObj[key] = `provider_id must be present in ${ApiSequence.ON_CONFIRM} as order is accepted`
    //       }

    //       const id = getProviderId(deliveryFulfillment)
    //       setValue('fulfillmentProviderId', id)
    //     }
    //     if (!fulfillments.length) {
    //       const key = `missingFulfillments`
    //       onCnfrmObj[key] = `missingFulfillments is mandatory for ${ApiSequence.ON_CONFIRM}`
    //     } else {
    //       const deliveryObjArr = _.filter(fulfillments, { type: 'Delivery' })
    //       if (!deliveryObjArr.length) {
    //         onCnfrmObj[`message/order.fulfillments/`] =
    //           `Delivery fullfillment must be present in ${ApiSequence.ON_CONFIRM} if the Order.state is 'Accepted'`
    //       } else {
    //         const deliverObj = deliveryObjArr[0]
    //         delete deliverObj?.state
    //         delete deliverObj?.tags
    //         delete deliverObj?.start?.instructions
    //         delete deliverObj?.end?.instructions
    //         fulfillmentsItemsSet.add(deliverObj)
    //       }
    //     }
    //   } catch (error: any) {
    //     logger.error(`Error while checking Fulfillments Delivery Obj in /${ApiSequence.ON_CONFIRM}, ${error.stack}`)
    //   }
    // }
    //Vehicle registeration for (Self-Pickup) Kerbside
    const fulfillments = on_confirm.fulfillments
    if (Array.isArray(fulfillments)) {
      fulfillments.forEach((fulfillment, index) => {
        const type = fulfillment.type
        const category = fulfillment['@ondc/org/category']
        const vehicle = fulfillment.vehicle
        const SELF_PICKUP = 'Self-Pickup'
        const KERBSIDE = 'Kerbside'

        if (type === SELF_PICKUP && category === KERBSIDE) {
          if (!vehicle) {
            onCnfrmObj[`fulfillment${index}_vehicle`] =
              `Vehicle is required for fulfillment ${index} with type ${SELF_PICKUP} and category ${KERBSIDE} in /${constants.CONFIRM}`
          } else if (!vehicle.registration) {
            onCnfrmObj[`fulfillment${index}_vehicle_registration`] =
              `Vehicle registration is required for fulfillment ${index} with type ${SELF_PICKUP} and category ${KERBSIDE} in /${constants.CONFIRM}`
          }
        } else if (vehicle) {
          onCnfrmObj[`fulfillment${index}_vehicle`] =
            `Vehicle should not be present in fulfillment ${index} with type ${type} and category ${category} in /${constants.CONFIRM}`
        }
      })
    }

    try {
      logger.info(`Checking for valid pan_id in provider_tax_number and tax_number in /on_confirm`)
      const bpp_terms_obj: any = message.order.tags.filter((item: any) => {
        return item?.code == 'bpp_terms'
      })[0]
      const list = bpp_terms_obj.list
      const np_type_arr = list.filter((item: any) => item.code === 'np_type')
      const accept_bap_terms = list.filter((item: any) => item.code === 'accept_bap_terms')
      const np_type_on_search = getValue(`${ApiSequence.ON_SEARCH}np_type`)
      let np_type = ''

      if (np_type_arr.length > 0) {
        np_type = np_type_arr[0].value
      } else {
        const key = 'message.order.tags[0].list'
        onCnfrmObj[key] = `np_type not found in on_confirm`
      }

      if (accept_bap_terms.length > 0) {
        const key = 'message.order.tags[0].list'
        onCnfrmObj[key] = `accept_bap_terms is not required for now!`
      }

      if (np_type && np_type != np_type_on_search) {
        const key = 'message.order.tags[0].list'
        onCnfrmObj[key] = `np_type of on_search is not same to np_type of on_confirm`
      }

      if (!_.isEmpty(bpp_terms_obj)) {
        let tax_number = ''
        let provider_tax_number = ''
        list.map((item: any) => {
          if (item.code == 'tax_number') {
            if (item.value.length != 15) {
              const key = `message.order.tags[0].list`
              onCnfrmObj[key] = `Number of digits in tax number in  message.order.tags[0].list should be 15`
            } else {
              tax_number = item.value
            }
          }

          if (item.code == 'provider_tax_number') {
            if (item.value.length != 10) {
              const key = `message.order.tags[0].list`
              onCnfrmObj[key] = `Number of digits in provider tax number in  message.order.tags[0].list should be 10`
            } else {
              provider_tax_number = item.value
            }
          }
        })

        if (tax_number.length == 0) {
          logger.error(`tax_number must present in ${constants.ON_CONFIRM}`)
          onCnfrmObj['tax_number'] = `tax_number must be present for ${constants.ON_CONFIRM}`
        } else {
          const taxNumberPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')
          if (!taxNumberPattern.test(tax_number)) {
            logger.error(`Invalid format for tax_number in ${constants.ON_INIT}`)
            onCnfrmObj.tax_number = `Invalid format for tax_number in ${constants.ON_CONFIRM}`
          }
        }

        if (provider_tax_number.length == 0) {
          logger.error(`tax_number must present in ${constants.ON_CONFIRM}`)
          onCnfrmObj['provider_tax_number'] = `provider_tax_number must be present for ${constants.ON_CONFIRM}`
        } else {
          const taxNumberPattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
          if (!taxNumberPattern.test(provider_tax_number)) {
            logger.error(`Invalid format for provider_tax_number in ${constants.ON_INIT}`)
            onCnfrmObj.provider_tax_number = `Invalid format for provider_tax_number in ${constants.ON_CONFIRM}`
          }
        }

        if (tax_number.length == 15 && provider_tax_number.length == 10) {
          const pan_id = tax_number.slice(2, 12)
          if (pan_id != provider_tax_number && np_type_on_search == 'ISN') {
            onCnfrmObj[`message.order.tags[0].list`] =
              `Pan_id is different in tax_number and provider_tax_number in message.order.tags[0].list`
            logger.error(
              'onCnfrmObj[`message.order.tags[0].list`] = `Pan_id is different in tax_number and provider_tax_number in message.order.tags[0].list`',
            )
          } else if (pan_id == provider_tax_number && np_type_on_search === 'MSN') {
            onCnfrmObj[`message.order.tags[0].list`] =
              `Pan_id shouldn't be same in tax_number and provider_tax_number in message.order.tags[0].list`
            logger.error(
              "onCnfrmObj[`message.order.tags[0].list`] = `Pan_id shoudn't be same in tax_number and provider_tax_number in message.order.tags[0].list`",
            )
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while comparing valid pan_id in tax_number and provider_tax_number`)
    }

    try {
      logger.info(`Comparing timestamp of context and updatedAt for /${constants.ON_CONFIRM}`)
      if (!_.isEqual(context.timestamp, on_confirm.updated_at)) {
        const key = `invldUpdtdTmstp`
        onCnfrmObj[key] = `updated_at timestamp should be equal to  context timestamp for /${constants.ON_CONFIRM}`
        logger.error(`updated_at timestamp should be equal to  context timestamp for /${constants.ON_CONFIRM}`)
      }
    } catch (error: any) {
      logger.error(`!!Error while compairing updated_at timestamp with context timestamp for ${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing billing object in ${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, on_confirm.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          onCnfrmObj[key] = `${billingErrors[i]} when compared with init billing object`
          i++
        }
      }
    } catch (error: any) {
      logger.info(`!Error while comparing billing object in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CONFIRM}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_confirm.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        if (on_confirm.fulfillments[i].id) {
          const id = on_confirm.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            onCnfrmObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          onCnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.ON_CONFIRM}`
        }

        if (!on_confirm.fulfillments[i].type) {
          const key = `ffID type`
          onCnfrmObj[key] = `fulfillment type does not exist in /${constants.ON_SELECT}`
        }

        const ffId = on_confirm.fulfillments[i].id || ''
        if (getValue(`${ffId}_tracking`)) {
          if (on_confirm.fulfillments[i].tracking === false || on_confirm.fulfillments[i].tracking === true) {
            if (getValue(`${ffId}_tracking`) != on_confirm.fulfillments[i].tracking) {
              logger.info(`Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`)
              onCnfrmObj['ffTracking'] = `Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`
            }
          } else {
            logger.info(`Tracking must be present for fulfillment ID: ${ffId} in boolean form`)
            onCnfrmObj['ffTracking'] = `Tracking must be present for fulfillment ID: ${ffId} in boolean form`
          }
        }

        logger.info('Checking the fulfillments state')

        const ffDesc = on_confirm.fulfillments[i].state.descriptor

        const ffStateCheck = ffDesc.hasOwnProperty('code') ? ffDesc.code === 'Pending' : false
        setValue(`ffIdPrecancel`, ffDesc?.code)
        if (!ffStateCheck) {
          const key = `ffState${i}`
          onCnfrmObj[key] = `default fulfillments state is missing in /${constants.ON_CONFIRM}`
        }

        if (on_confirm.fulfillments[i].type === "Self-Pickup") {
          if (!on_confirm.fulfillments[i].start) {
            onCnfrmObj.ffstart = `fulfillments[${i}] start location is mandatory`
          }
        }

        else {
          if(!on_confirm.fulfillments[i].start || !on_confirm.fulfillments[i].end){
            onCnfrmObj.ffstartend = `fulfillments[${i}] start and end locations are mandatory`
          }
        }

        try {
          if (!compareCoordinates(on_confirm.fulfillments[i].start.location.gps, getValue('providerGps'))) {
            onCnfrmObj.sellerGpsErr = `store gps location /fulfillments[${i}]/start/location/gps can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store location in /${constants.ON_CONFIRM}, ${error.stack}`)
        }

        try {
          if (!getValue('providerName')) {
            onCnfrmObj.sellerNameErr = `Invalid store name inside fulfillments in /${constants.ON_CONFIRM}`
          } else if (!_.isEqual(on_confirm.fulfillments[i].start.location.descriptor.name, getValue('providerName'))) {
            onCnfrmObj.sellerNameErr = `store name  /fulfillments[${i}]/start/location/descriptor/name can't change`
          }
        } catch (error: any) {
          logger.error(`!!Error while checking store name in /${constants.ON_CONFIRM}`)
        }
        if (on_confirm.fulfillments[i].type !== "Self-Pickup") {
          if (!_.isEqual(on_confirm.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
            onCnfrmObj.buyerGpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`
          }

          if (!_.isEqual(on_confirm.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
            onCnfrmObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing /${constants.ON_CONFIRM} quoted Price and Payment Params amount`)
      setValue('quotePrice', on_confirm.quote.price.value)
      if (parseFloat(on_confirm.payment.params.amount) != parseFloat(on_confirm.quote.price.value)) {
        onCnfrmObj.onConfirmedAmount = `Quoted price (/${constants.ON_CONFIRM}) doesn't match with the amount in payment.params`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing /${constants.ON_CONFIRM} quoted Price and Payment Params amount, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking quote breakup prices for /${constants.ON_CONFIRM}`)
      if (!sumQuoteBreakUp(on_confirm.quote)) {
        const key = `invldPrices`
        onCnfrmObj[key] = `item quote breakup prices for ${constants.ON_CONFIRM} should be equal to the total price.`
        logger.error(`item quote breakup prices for ${constants.ON_CONFIRM} should be equal to the total price`)
      }
      const collect_payment = getValue('collect_payment')
      if (flow === FLOW.FLOW0099 || collect_payment === 'N' || flow === OFFERSFLOW.FLOW0098) {
        let offers = on_confirm.quote.breakup.filter((item: any) => item['@ondc/org/title_type'] === 'offer')
        if (offers.length === 0) {
          onCnfrmObj['offer-not-found'] = `Offer is required for the flow: ${flow}`
        } else if (offers.length > 0) {
          const providerOffers: any = getValue(`${ApiSequence.ON_SEARCH}_offers`)
          offers.forEach((offer: any, index: number) => {
            const providerOffer = providerOffers?.find(
              (providedOffer: any) => providedOffer?.id.toLowerCase() === offer['@ondc/org/item_id'].toLowerCase(),
            )
            console.log('providerOffer in select call', JSON.stringify(providerOffer))

            if (!providerOffer) {
              onCnfrmObj[`offer[${index}]`] = `Offer with id ${offer.id} is not available for the provider.`
              return
            }
            const offerType = providerOffer.descriptor.code
            if (offerType === 'financing') {
              const finance_tags = offer.item.tags.find((tag: any) => tag.code === 'finance_terms')
              const finance_txn = offer.item.tags.find((tag: any) => tag.code === 'finance_txn')
              if (finance_tags) {
                const on_init_finance_tags = getValue(`finance_terms${constants.ON_INIT}`)
                const financeTagsError = compareFinanceTermsTags(on_init_finance_tags,finance_tags)
                if (financeTagsError) {
                  let i = 0
                  const len = financeTagsError.length
                  while (i < len) {
                    const key = `financeTagsError${i}`
                    onCnfrmObj[key] = `${financeTagsError[i]}`
                    i++
                  }
                }
              }
              if(finance_txn){
                const financeTxnError = validateFinanceTxnTag(finance_txn)
                if (financeTxnError) {
                  let i = 0
                  const len = financeTxnError.length
                  while (i < len) {
                    const key = `financeTagsError${i}`
                    onCnfrmObj[key] = `${financeTxnError[i]}`
                    i++
                  }
                }
              }
            }
          })
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)

      const on_select_quote: any = getValue('quoteObj')
       if (flow !== FLOW.FLOW0099 && flow != OFFERSFLOW.FLOW0098) {
      const quoteErrors = compareQuoteObjects(
        on_select_quote,
        on_confirm.quote,
        constants.ON_CONFIRM,
        constants.ON_SELECT,
      )

      const hasItemWithQuantity = _.some(on_confirm.quote.breakup, (item) => _.has(item, 'item.quantity'))
      if (hasItemWithQuantity) {
        const key = `quantErr`
        onCnfrmObj[key] =
          `Extra attribute Quantity provided in quote object i.e not supposed to be provided after on_select so invalid quote object`
      } else if (quoteErrors) {
        let i = 0
        const len = quoteErrors.length
        while (i < len) {
          const key = `quoteErr${i}`
          onCnfrmObj[key] = `${quoteErrors[i]}`
          i++
        }
      }
    }
    } catch (error: any) {
      logger.error(`!!Error while comparing quote in /${constants.ON_SELECT} and /${constants.ON_CONFIRM}`)
    }

    try {
      logger.info(`Comparing order price value in /${constants.ON_INIT} and /${constants.CONFIRM}`)
      const oninitQuotePrice: any = getValue('initQuotePrice')
      const onConfirmQuotePrice = parseFloat(on_confirm.quote.price.value)
      setValue(`${constants.ON_CONFIRM}/quote`,on_confirm.quote)

      logger.info(`Comparing quote prices of /${constants.ON_INIT} and /${constants.CONFIRM}`)
      if (oninitQuotePrice != onConfirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.CONFIRM} is not equal to the quoted price in /${constants.ON_INIT}`,
        )
        onCnfrmObj.quoteErr = `Quoted Price in /${constants.CONFIRM} INR ${onConfirmQuotePrice} does not match with the quoted price in /${constants.ON_INIT} INR ${oninitQuotePrice}`
      }
      setValue('quotePrice', onConfirmQuotePrice)
    } catch (error: any) {
      logger.error(`!!Error while comparing order price value in /${constants.ON_INIT} and /${constants.CONFIRM}`)
    }

    try {
      logger.info(`Comparing payment object in /${constants.CONFIRM} & /${constants.ON_CONFIRM}`)

      if (!_.isEqual(getValue('cnfrmpymnt'), on_confirm.payment)) {
        onCnfrmObj.pymntObj = `payment object mismatches in /${constants.CONFIRM} & /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing payment object in /${constants.CONFIRM} & /${constants.ON_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Buyer App finder fee amount in /${constants.ON_CONFIRM}`)
      const buyerFF: any = getValue(`${ApiSequence.SEARCH}_buyerFF`)
      if (
        on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount'] &&
        parseFloat(on_confirm.payment['@ondc/org/buyer_app_finder_fee_amount']) != buyerFF
      ) {
        onCnfrmObj.buyerFF = `Buyer app finder fee can't change in /${constants.ON_CONFIRM}`
        logger.info(`Buyer app finder fee can't change in /${constants.ON_CONFIRM}`)
      }
    } catch (error: any) {
      logger.info(`!Error while comparing buyer app finder fee in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    const list_ON_INIT: any = getValue('list_ON_INIT')
    let ON_INIT_val: string
    list_ON_INIT.map((data: any) => {
      if (data.code == 'tax_number') {
        ON_INIT_val = data.value
      }
    })

    try {
      logger.info(`Checking if tax_number in bpp_terms in ON_CONFIRM and ON_INIT is same`)
      let list_ON_CONFIRM: any
      message.order.tags.forEach((data: any) => {
        if (data.code == 'bpp_terms') {
          list_ON_CONFIRM = data.list
        }
      })
      if (!list_ON_CONFIRM.some((data: any) => data.code == 'np_type')) {
        onCnfrmObj['message/order/tags/bpp_terms/np_type'] =
          `np_type is missing in message/order/tags/bpp_terms for ON_CONFIRM`
      }
      list_ON_CONFIRM.map((data: any) => {
        if (data.code == 'tax_number') {
          if (data.value != ON_INIT_val) {
            onCnfrmObj['message/order/tags/bpp_terms'] =
              `Value of tax Number mismatched in message/order/tags/bpp_terms for ON_INIT and ON_CONFIRM`
          }
        }
      })
    } catch (error: any) {
      logger.error(`Error while matching the tax_number in ON_CONFIRM and ON_INIT`)
    }

    try {
      logger.info(`Comparing tags in /${constants.CONFIRM} and /${constants.ON_CONFIRM}`)
      const confirm_tags: any[] | any = getValue('confirm_tags')
      if (on_confirm.tags) {
        const bap_terms = areGSTNumbersMatching(confirm_tags, on_confirm.tags, 'bap_terms')

        if (bap_terms === false) {
          onCnfrmObj.tags_bap_terms = `Tags should have same and valid gst_number as passed in /${constants.CONFIRM}`
        }

        const bpp_terms = areGSTNumbersMatching(confirm_tags, on_confirm.tags, 'bpp_terms')
        if (bpp_terms === false) {
          onCnfrmObj.tags_bpp_terms = `Tags should have same and valid gst_number as passed in /${constants.CONFIRM}`
        }
      }
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing tags in /${constants.CONFIRM} and /${constants.ON_CONFIRM}
        ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking if transaction_id is present in message.order.payment`)
      const payment = on_confirm.payment
      const status = payment_status(payment, flow)
      if (!status) {
        onCnfrmObj['message/order/transaction_id'] = `Transaction_id missing in message/order/payment`
      }
    } catch (err: any) {
      logger.error(`Error while checking transaction is in message.order.payment`)
    }
    try {
      if (flow === FLOW.FLOW012) {
        logger.info('Payment status check in on confirm call')
        const payment = on_confirm.payment
        const confirmPaymentStatus = getValue('confirmPaymentStatus')
        if (payment.status !== confirmPaymentStatus) {
          const key = `missmatchStatus`
          onCnfrmObj[key] = `payment status in /${constants.ON_CONFIRM} must be same as in /${constants.CONFIRM} `
        }
        if (payment.status !== PAYMENT_STATUS.NOT_PAID) {
          logger.error(
            `Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW012} flow (Cash on Delivery)`,
          )
          onCnfrmObj.pymntstatus = `Payment status should be ${PAYMENT_STATUS.NOT_PAID} for ${FLOW.FLOW012} flow (Cash on Delivery)`
        }
      }
    } catch (err: any) {
      logger.error('Error while checking payment in message/order/payment: ' + err.message)
    }

    try {
      logger.info(`Checking if list provided in bpp_terms is same as provided in ${constants.ON_INIT} `)
      const tags = on_confirm.tags

      for (const tag of tags) {
        if (tag.code === 'bpp_terms') {
          const result = compareLists(tag.list, list_ON_INIT)
          if (result.length > 0) {
            onCnfrmObj['message/order/tags/bpp_terms'] =
              `List of bpp_terms mismatched in message/order/tags/bpp_terms for ${constants.ON_INIT} and ${constants.ON_CONFIRM} here ${result}`
          }
        }
      }
    } catch (err: any) {
      logger.error(
        `Error while Checking if list provided in bpp_terms is same as provided in ${constants.ON_INIT}, ${err.stack} `,
      )
    }

    try {
      logger.info(`Checking if bap_terms is present in ${constants.ON_CONFIRM} `)
      const tags = on_confirm.tags

      for (const tag of tags) {
        if (tag.code === 'bap_terms') {
          const hasStaticTerms = tag.list.some((item: { code: string }) => item.code === 'static_terms')
          if (hasStaticTerms) {
            onCnfrmObj['message/order/tags/bap_terms/static_terms'] =
              `static_terms is not required for now! in ${constants.ON_CONFIRM}`
          }
        }
      }
    } catch (err: any) {
      logger.error(`Error while Checking bap_terms in ${constants.ON_CONFIRM}, ${err.stack} `)
    }

    if (flow === FLOW.FLOW003) {
      const fulfillmentId = getValue('fulfillmentId')
      const slot = getValue('fulfillmentSlots')
      const ele = on_confirm.fulfillments.find((ele: { id: any }): any => ele.id === fulfillmentId)
      const item = slot.find((ele: { id: any }): any => ele.id === fulfillmentId)
      if (!ele || !item) {
        const key = `fulfillments missing`
        onCnfrmObj[key] = `fulfillments must be same as in /${constants.ON_INIT}`
      }
      if (item?.end?.time?.range && ele?.end?.time?.range) {
        const itemRange = item.end.time.range
        const eleRange = ele.end.time.range

        if (itemRange.start !== eleRange.start && itemRange.end !== eleRange.end) {
          const key = `slotsMismatch`
          onCnfrmObj[key] = `slots in fulfillments must be same as in /${constants.ON_INIT}`
        }
      }
    }

    try {
      const credsWithProviderId = getValue('credsWithProviderId')
      const providerId = on_confirm?.provider?.id
      const confirmCreds = on_confirm?.provider?.creds
      const found = credsWithProviderId.find((ele: { providerId: any }) => ele.providerId === providerId)

      const expectedCreds = found?.creds
      if (flow === FLOW.FLOW017) {
        if (!expectedCreds || !credsWithProviderId || !confirmCreds) {
          onCnfrmObj['MissingCreds'] = `creds must be present in /${constants.ON_SEARCH}`
        } else if (!deepCompare(expectedCreds, confirmCreds)) {
          onCnfrmObj['MissingCreds'] = `creds must be present and same as in /${constants.ON_SEARCH}`
        }
      }
      if (credsWithProviderId && confirmCreds) {
        if (expectedCreds) {
          if (!deepCompare(expectedCreds, confirmCreds)) {
            onCnfrmObj['MissingCreds'] = `Mismatch found in creds, it must be same as in /${constants.ON_SEARCH}`
          }
        }
      }
    } catch (err: any) {
      logger.error(`Error while Checking creds in ${constants.ON_CONFIRM}, ${err.stack} `)
    }

   if (flow === FLOW.FLOW01F) {
  const bppTerms = getValue('bppTerms');
  const list = message.order.tags?.find((item: any) => item?.code === 'bpp_terms')?.list;
  if (!deepCompare(list, bppTerms)) {
    onCnfrmObj['missingbppTerms'] = `bppTerms must be same as provided in /${constants.ON_SEARCH} call`;
  }
}


    return onCnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CONFIRM} API`, JSON.stringify(err.stack))
  }
}

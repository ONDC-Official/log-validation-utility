/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkBppIdOrBapId, compareObjects } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkOnCancel = (data: any) => {
  const onCnclObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_CANCEL]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)
    const schemaValidation = validateSchema('RET11', constants.ON_CANCEL, data)
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const contextRes: any = checkContext(context, constants.ON_CANCEL)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(onCnclObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(onCnclObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(onCnclObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(onCnclObj, contextRes.ERRORS)
    }

    setValue(`${ApiSequence.CANCEL}`, data)

    try {
      logger.info(`Checking context for /${constants.ON_CANCEL} API`) //checking context
      const res: any = checkContext(context, constants.ON_CANCEL)
      if (!res.valid) {
        Object.assign(onCnclObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_CANCEL}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onCnclObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_INIT} and /${constants.ON_CANCEL}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.ON_INIT} api cannot be greater than or equal to /${constants.ON_CANCEL} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.ON_INIT} and /${constants.ON_CANCEL} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_CANCEL}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        onCnclObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_CANCEL} api, ${error.stack}`,
      )
    }

    const on_cancel = message.order

    try {
      logger.info(`Comparing order ids in /${constants.ON_CANCEL} and /${constants.ON_CONFIRM}`)
      if (getValue('cnfrmOrdrId') != on_cancel.id) {
        onCnclObj.orderID = `Order Id mismatches in /${constants.ON_CANCEL} and /${constants.ON_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while trying to fetch order ids in /${constants.ON_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Checking provider id and location in /${constants.ON_CANCEL}`)
      if (on_cancel.provider.id != getValue('providerId')) {
        onCnclObj.prvdrId = `Provider Id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CANCEL}`
      }

      if (on_cancel.provider.locations[0].id != getValue('providerLoc')) {
        onCnclObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.ON_SEARCH} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id and location in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item Ids and fulfillment ids in /${constants.ON_SELECT} and /${constants.ON_CANCEL}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      const itemsIdList: any = getValue('itemsIdList')
      let i = 0
      const len = on_cancel.items.length
      while (i < len) {
        const itemId = on_cancel.items[i].id

        if (itemId in itemFlfllmnts) {
          if (on_cancel.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            onCnclObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.ON_CANCEL}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          onCnclObj[itemkey] = `Item Id ${itemId} does not exist in /${constants.ON_SELECT}`
        }

        if (itemId in itemsIdList) {
          if (on_cancel.items[i].quantity.count != itemsIdList[itemId]) {
            itemsIdList[itemId] = on_cancel.items[i].quantity.count
            onCnclObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.ON_CANCEL}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing billing object in /${constants.INIT} and /${constants.ON_CANCEL}`)
      const billing = getValue('billing')

      const billingErrors = compareObjects(billing, onCnclObj.billing)

      if (billingErrors) {
        let i = 0
        const len = billingErrors.length
        while (i < len) {
          const key = `billingErr${i}`
          onCnclObj[key] = `${billingErrors[i]}`
          i++
        }
      }

      setValue('billing', on_cancel.billing)
    } catch (error: any) {
      logger.error(`!!Error while comparing billing object in /${constants.CONFIRM} and /${constants.ON_CANCEL}`)
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.ON_CANCEL}`)
      const itemFlfllmnts: any = getValue('itemFlfllmnts')
      let i = 0
      const len = on_cancel.fulfillments.length
      while (i < len) {
        //Comparing fulfillment Ids
        if (on_cancel.fulfillments[i].id) {
          const id = on_cancel.fulfillments[i].id
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            onCnclObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }
        } else {
          onCnclObj.ffId = `fulfillments[${i}].id is missing in /${constants.CONFIRM}`
        }

        if (!on_cancel.fulfillments[i].end || !on_cancel.fulfillments[i].end.person) {
          onCnclObj.ffprsn = `fulfillments[${i}].end.person object is missing`
        }

        if (!_.isEqual(on_cancel.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
          onCnclObj.gpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`
        }

        if (!_.isEqual(on_cancel.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
          onCnclObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Checking payment object in /${constants.ON_CANCEL}`)

      if (!_.isEqual(on_cancel.payment['@ondc/org/settlement_details'][0], getValue('sttlmntdtls'))) {
        onCnclObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.ON_INIT} & /${constants.ON_CANCEL}`
      }

      if (!on_cancel.hasOwnProperty('created_at') || !on_cancel.hasOwnProperty('updated_at')) {
        onCnclObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.ON_CANCEL}`
      } else {
        if (!_.isEqual(on_cancel.created_at, on_cancel.updated_at)) {
          onCnclObj.ordrupdtd = `order.updated_at timestamp should match order.created_at timestamp`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`storing payment object in /${constants.ON_CANCEL}`)
      setValue('cnfrmpymnt', on_cancel.payment)
    } catch (error: any) {
      logger.error(`!!Error while storing payment object in /${constants.ON_CANCEL}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_CANCEL}`)
      if (!_.isEqual(getValue('quoteObj'), on_cancel.quote)) {
        onCnclObj.quoteObj = `Discrepancies between the quote object in /${constants.ON_SELECT} and /${constants.ON_CANCEL}`
      }
    } catch (error: any) {
      logger.error(`!!Error while Comparing Quote object for /${constants.ON_SELECT} and /${constants.ON_CANCEL}`)
    }

    return onCnclObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.ON_CANCEL} API`, err)
  }
}

import _ from 'lodash'
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../../'
import { getValue, setValue } from '../../../shared/dao'

export const checkInit = (data: any, msgIdSet: any) => {
  const initObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.INIT]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
    const select: any = getValue(`${FisApiSequence.SELECT}`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_INIT, data)

    const contextRes: any = checkFISContext(context, constants.FIS_INIT)
    msgIdSet.add(context.message_id)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(initObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(initObj, { bpp_id: 'context/bpp_id should not be a url' })

    if (schemaValidation !== 'error') {
      Object.assign(initObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(initObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.INIT}`, data)

    try {
      logger.info(`Checking context for /${constants.FIS_INIT} API`)
      const res: any = checkFISContext(context, constants.FIS_INIT)
      if (!res.valid) {
        Object.assign(initObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.FIS_INIT} context, ${error.stack}`)
    }

    try {
      logger.info(`Comparing city of /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)

      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        initObj.city = `City code mismatch in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`
      }
    } catch (error: any) {
      logger.info(`Error while comparing city in /${constants.FIS_SELECT} and /${constants.FIS_INIT}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)

      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        initObj.country = `Country code mismatch in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing country in /${constants.FIS_SELECT} and /${constants.FIS_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.FIS_ONSELECT} and /${constants.FIS_INIT}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        initObj.tmpstmp = `Timestamp for  /${constants.FIS_ONSELECT} api cannot be greater than or equal to /init api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.FIS_ONSELECT} and /${constants.FIS_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        initObj.txnId = `Transaction Id should be same from /${constants.FIS_SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.FIS_SELECT} and /${constants.FIS_INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Message Ids of /${constants.FIS_INIT}`)

      setValue('msgId', context.message_id)
    } catch (error: any) {
      logger.info(`Error while checking message id for /${constants.FIS_INIT}, ${error.stack}`)
    }

    const init = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const storedFormIds: any = getValue('select_storedFormIds')

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      init.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
    }

    setValue('ItmIDS', newItemIDSValue)
    try {
      logger.info(`Comparing provider object in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`)

      if (getValue('providerId') != init.provider['id']) {
        initObj.prvdId = `Provider Id mismatches in /${constants.FIS_SELECT} and /${constants.FIS_INIT}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking provider object in /${constants.FIS_SELECT} and /${constants.FIS_INIT}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing item Ids in /${constants.FIS_ONSELECT} and /${constants.FIS_INIT}`)
      init.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          initObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (
          !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id') ||
          !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')
        )
          initObj[
            `item${index}_xinput`
          ] = `/message/order/items/xinput in item: ${item.id} must have both status & submission_id in form_response`

        const formId = item?.xinput?.form.id
        const status = item?.xinput?.form_response?.status

        if (storedFormIds === undefined) {
          storedFormIds.add(formId)
        }

        if (getValue(`${FisApiSequence.SELECT}_form_${formId}_status`) === status) {
          const key = `item${index}_status`
          initObj[
            key
          ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be different from previous select calls for the same form_id: ${formId}`
        }
      })
    } catch (error: any) {
      logger.error(`!!Error while comparing Item in /${constants.FIS_ONSELECT} and /${constants.FIS_INIT}`)
    }

    const buyerFinderFeesTag = init.payments[0].tags.find((tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES')
    const settlementTermsTag = init.payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

    if (!buyerFinderFeesTag) {
      initObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
    }

    if (!settlementTermsTag) {
      initObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
    }

    if (!init.payments[0].collected_by || !init.payments[0].params) {
      initObj.payments = `collected_by or params is missing in payments`
    } else {
      setValue(`collected_by`, init.payments[0].collected_by)
    }

    return initObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_INIT} API`, err)
    return { error: err.message }
  }
}

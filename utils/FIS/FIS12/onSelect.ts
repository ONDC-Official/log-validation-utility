/* eslint-disable no-prototype-builtins */
import { getValue, setValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext, timeDiff, checkBppIdOrBapId } from '../..'
import _ from 'lodash'
import { logger } from '../../../shared/logger'

export const checkOnSelect = (data: any, msgIdSet: any) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.ON_SELECT]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_ONSELECT, data)

  const contextRes: any = checkFISContext(context, constants.FIS_ONSELECT)
  msgIdSet.add(context.message_id)

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

  const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
  const select: any = getValue(`${FisApiSequence.SELECT}`)

  try {
    logger.info(`Comparing city of /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}`)
    if (!_.isEqual(searchContext.location.city, context.location.city)) {
      errorObj.city = `City code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing city in /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing country of /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}`)
    if (!_.isEqual(searchContext.location.country, context.location.country)) {
      errorObj.country = `Country code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing country in /${constants.FIS_SEARCH} and /${constants.FIS_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing timestamp of /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT}`)
    const tmpstmp = select.context.timestamp
    if (_.gte(tmpstmp, context.timestamp)) {
      errorObj.tmpstmp = `Timestamp for /${constants.FIS_SELECT} api cannot be greater than or equal to /${constants.FIS_ONSELECT} api`
    } else {
      const timeDifference = timeDiff(context.timestamp, tmpstmp)
      logger.info(timeDifference)
      if (timeDifference > 5000) {
        errorObj.tmpstmp = `context/timestamp difference between /${constants.FIS_ONSELECT} and /${constants.FIS_SELECT} should be smaller than 5 sec`
      }
    }

    setValue('tmpstmp', context.timestamp)
  } catch (error: any) {
    logger.error(
      `!!Error while comparing timestamp for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT}, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT}`)
    if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
      errorObj.txnId = `Transaction Id should be same throughout`
    }
  } catch (error: any) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT}`)
    if (!_.isEqual(select.context.message_id, context.message_id)) {
      errorObj.msgId = `Message Id for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT} api, ${error.stack}`,
    )
  }

  try {
    const itemIdArray: any[] = []
    const onSelect = message.order
    const itemIDS: any = getValue('ItmIDS')

    try {
      logger.info(`Comparing Provider Ids of /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT}`)
      const prvrdID: any = getValue('providerId')
      if (!_.isEqual(prvrdID, onSelect.provider.id)) {
        errorObj.prvdrId = `Provider Id for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT} api should be same`
      }
    } catch (error: any) {
      logger.info(
        `Error while comparing provider ids for /${constants.FIS_SELECT} and /${constants.FIS_ONSELECT} api, ${error.stack}`,
      )
    }

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      select.message.order.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
      console.log('test')
    }

    logger.info(
      `Mapping Item Ids with their counts and categories /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}`,
    )

    try {
      onSelect.items.forEach((item: any, index: number) => {
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          errorObj[key] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in select`
        } else {
          if (
            !item?.tags?.some(
              (tag: any) => tag.descriptor.code === 'CONSENT_INFO' || tag.descriptor.code === 'LOAN_INFO',
            )
          ) {
            errorObj['on_select_items'] = {
              tags: 'CONSENT_INFO or LOAN_INFO tag group must be present.',
            }
          }

          if (
            !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status') ||
            !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id')
          )
            errorObj[
              `item${index}_xinput`
            ] = `/message/order/items/xinput in item: ${item.id} must have both status & submission_id in form_response`
        }
      })

      logger.info(`Provider Id in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT} matched`)
    } catch (error: any) {
      logger.error(
        `!!Error while Comparing and Mapping Items in /${constants.FIS_ONSEARCH} and /${constants.FIS_SELECT}, ${error.stack}`,
      )
    }
  } catch (error: any) {
    logger.error(`!!Error occcurred while checking providers info in /${constants.FIS_SELECT},  ${error.message}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

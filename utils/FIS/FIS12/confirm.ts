/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { FisApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../../'
import { getValue, setValue } from '../../../shared/dao'

export const checkConfirm = (data: any) => {
  const cnfrmObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [FisApiSequence.CONFIRM]: 'Json cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)
    const select: any = getValue(`${FisApiSequence.SELECT}`)
    // const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.FIS_CONFIRM, data)

    const contextRes: any = checkFISContext(context, constants.FIS_CONFIRM)

    const checkBap = checkBppIdOrBapId(context.bap_id)
    const checkBpp = checkBppIdOrBapId(context.bpp_id)

    if (checkBap) Object.assign(cnfrmObj, { bap_id: 'context/bap_id should not be a url' })
    if (checkBpp) Object.assign(cnfrmObj, { bpp_id: 'context/bpp_id should not be a url' })
    if (schemaValidation !== 'error') {
      Object.assign(cnfrmObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(cnfrmObj, contextRes.ERRORS)
    }

    setValue(`${FisApiSequence.CONFIRM}`, data)

    try {
      logger.info(`Comparing city of /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}`)
      if (!_.isEqual(searchContext.location.city, context.location.city)) {
        cnfrmObj.city = `City code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing country of /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}`)
      if (!_.isEqual(searchContext.location.country, context.location.country)) {
        cnfrmObj.country = `Country code mismatch in /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing country in /${constants.FIS_SEARCH} and /${constants.FIS_CONFIRM}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.FIS_ONINIT} and /${constants.FIS_CONFIRM}`)
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        cnfrmObj.tmpstmp = `Timestamp for /${constants.FIS_ONINIT} api cannot be greater than or equal to /${constants.FIS_CONFIRM} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.FIS_ONINIT} and /${constants.FIS_CONFIRM} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.FIS_SELECT} and /${constants.FIS_CONFIRM}`)
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        cnfrmObj.txnId = `Transaction Id should be same from /${constants.FIS_SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.FIS_SELECT} and /${constants.FIS_CONFIRM} api, ${error.stack}`,
      )
    }

    const confirm = message.order
    const itemIDS: any = getValue('ItmIDS')
    const itemIdArray: any[] = []
    const storedFormIds: any = getValue('select_storedFormIds')

    let newItemIDSValue: any[]

    if (itemIDS && itemIDS.length > 0) {
      newItemIDSValue = itemIDS
    } else {
      confirm.items.map((item: { id: string }) => {
        itemIdArray.push(item.id)
      })
      newItemIDSValue = itemIdArray
      console.log('test')
    }

    setValue('ItmIDS', newItemIDSValue)

    const cnfrmOrdrId = confirm.id
    setValue('cnfrmOrdrId', cnfrmOrdrId)

    try {
      logger.info(`Checking provider id in /${constants.FIS_CONFIRM}`)
      if (confirm.provider.id != getValue('providerId')) {
        cnfrmObj.prvdrId = `Provider Id mismatches in /${constants.FIS_ONSEARCH} and /${constants.FIS_CONFIRM}`
      }
    } catch (error: any) {
      logger.error(`!!Error while checking provider id in /${constants.FIS_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing item in /${constants.FIS_CONFIRM}`)

      confirm.items.forEach((item: any, index: number) => {
        console.log(
          '==================================================================================================================',
          itemIdArray,
          newItemIDSValue,
        )
        if (!newItemIDSValue.includes(item.id)) {
          const key = `item[${index}].item_id`
          cnfrmObj[
            key
          ] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in previous call`
        }

        if (
          !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id') ||
          !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status')
        )
          cnfrmObj[
            `item${index}_xinput`
          ] = `/message/order/items/xinput in item: ${item.id} must have both status & submission_id in form_response`

        const formId = item?.xinput?.form.id
        const status = item?.xinput?.form_response?.status

        if (storedFormIds === undefined) {
          storedFormIds.add(formId)
        }

        if (storedFormIds.has(formId)) {
          console.log(
            '--------------------------------------------------------------',
            `${FisApiSequence.SELECT}_form_${formId}_status)`,
          )
        }

        if (getValue(`${FisApiSequence.SELECT}_form_${formId}_status`) === status) {
          const key = `item${index}_status`
          cnfrmObj[
            key
          ] = `/message/order/items/xinput/form_response/status in item: ${item.id} should be different from previous select calls for the same form_id: ${formId}`
        }
      })
      // let i = 0
      // const len = confirm.items.length

      // onSelect.items.forEach((item: any, index: number) => {
      //   if (!itemIdArray.includes(item.id)) {
      //     const key = `item${index}item_id`
      //     errorObj[key] = `/message/order/items/id in item: ${item.id} should be one of the /item/id mapped in select`
      //   } else {
      //     if (
      //       !item?.tags?.some(
      //         (tag: any) => tag.descriptor.code === 'CONSENT_INFO' || tag.descriptor.code === 'LOAN_INFO',
      //       )
      //     ) {
      //       errorObj['on_select_items'] = {
      //         tags: 'CONSENT_INFO or LOAN_INFO tag group must be present.',
      //       }
      //     }

      //     if (
      //       !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'status') ||
      //       !Object.prototype.hasOwnProperty.call(item?.xinput?.form_response, 'submission_id')
      //     )
      //       errorObj[
      //         `item${index}_xinput`
      //       ] = `/message/order/items/xinput in item: ${item.id} must have both status & submission_id in form_response`
      //   }
      // })
      // while (i < len) {
      //   // const itemId = confirm.items[i].id
      //   const item = confirm.items[i]

      //   // if (!parentItemIdSet.includes(item.parent_item_id)) {
      //   //   const itemkey = `item_PrntItmId${i}`
      //   //   cnfrmObj[
      //   //     itemkey
      //   //   ] = `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.FIS_CONFIRM}`
      //   // }

      //   console.log('itemitemitemitemitemitemitemitemitemitemitemitem', item)

      //   if (
      //     !item.xinput ||
      //     !item.xinput.form_response ||
      //     !item.xinput.form_response.status ||
      //     !item.xinput.form_response.submission_id
      //   ) {
      //     cnfrmObj.xinput = `xinput or xinput.form_response is missing in /${constants.FIS_CONFIRM}`
      //   }

      //   i++
      // }
    } catch (error: any) {
      logger.error(`!!Error while comparing Item Id in /${constants.RET_ONSELECT} and /${constants.FIS_CONFIRM}`)
    }

    try {
      logger.info(`Checking payment object in /${constants.FIS_CONFIRM}`)

      const buyerFinderFeesTag = confirm.payments[0].tags.find(
        (tag: any) => tag.descriptor.code === 'BUYER_FINDER_FEES',
      )
      const settlementTermsTag = confirm.payments[0].tags.find((tag: any) => tag.descriptor.code === 'SETTLEMENT_TERMS')

      if (!buyerFinderFeesTag) {
        cnfrmObj.buyerFinderFees = `BUYER_FINDER_FEES tag is missing in payments`
      }

      if (!settlementTermsTag) {
        cnfrmObj.settlementTerms = `SETTLEMENT_TERMS tag is missing in payments`
      }

      if (!confirm.payments[0].collected_by || !confirm.payments[0].params) {
        cnfrmObj.payments = `collected_by or params is missing in payments`
      } else {
        const allowedCollectedByValues = ['BPP', 'BAP']
        const allowedStatusValues = ['NOT_PAID', 'PAID']

        const collectedBy = getValue(`collected_by`)
        if (collectedBy && collectedBy !== confirm.payments[0].collected_by) {
          cnfrmObj.collectedBy = `Collected_By didn't matched with what was send in previous call.`
        } else {
          if (!allowedCollectedByValues.includes(confirm.payments[0].collected_by)) {
            cnfrmObj.collectedBy = `Invalid value for collected_by. It should be either BPP or BAP.`
          }

          setValue(`collected_by`, confirm.payments[0].collected_by)
        }

        if (!allowedStatusValues.includes(confirm.payments[0].status)) {
          cnfrmObj.paymentStatus = `Invalid value for status. It should be either NOT_PAID or PAID.`
        }

        const params = confirm.payments[0].params
        const requiredParams = ['bank_code', 'bank_account_number', 'virtual_payment_address']

        const missingParams = requiredParams.filter((param) => !params.hasOwnProperty(param))

        if (missingParams.length > 0) {
          cnfrmObj.missingParams = `Required params ${missingParams.join(', ')} are missing in payments`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking payment object in /${constants.FIS_CONFIRM}, ${error.stack}`)
    }

    try {
      logger.info(`storing payment object in /${constants.FIS_CONFIRM}`)
      setValue('cnfrmpymnt', confirm.payments)
    } catch (error: any) {
      logger.error(`!!Error while storing payment object in /${constants.FIS_CONFIRM}, ${error.stack}`)
    }

    return cnfrmObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.FIS_CONFIRM} API`, err)
    return { error: err.message }
  }
}

import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchema, isObjectEmpty, checkContext, checkItemTag, checkBppIdOrBapId } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'

export const checkInit = (data: any) => {
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
    const select: any = getValue(`${ApiSequence.SELECT}`)
    const parentItemIdSet: any = getValue(`parentItemIdSet`)
    const select_customIdArray: any = getValue(`select_customIdArray`)
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.INIT, data)

    const contextRes: any = checkContext(context, constants.INIT)

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
      if (!_.isEqual(select.context.transaction_id, context.transaction_id)) {
        initObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.INIT} api, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking Message Ids of /${constants.INIT}`)

      setValue('msgId', context.message_id)
    } catch (error: any) {
      logger.info(`Error while checking message id for /${constants.INIT}, ${error.stack}`)
    }

    const init = message.order

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
          initObj[
            itemkey
          ] = `items[${i}].tags.parent_id mismatches for Item ${itemId} in /${constants.SELECT} and /${constants.INIT}`
        }

        if (!parentItemIdSet.includes(item.parent_item_id)) {
          const itemkey = `item_PrntItmId${i}`
          initObj[
            itemkey
          ] = `items[${i}].parent_item_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.INIT}`
        }

        if (itemId in itemFlfllmnts) {
          if (init.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            const itemkey = `item_FFErr${i}`
            initObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.ON_SELECT} and /${constants.INIT}`
          }
        } else {
          const itemkey = `item_FFErr${i}`
          initObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`
        }

        if (itemId in itemsIdList) {
          if (init.items[i].quantity.count != itemsIdList[itemId]) {
            initObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.SELECT}`
          }
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing Item and Fulfillment Id in /${constants.ON_SELECT} and /${constants.INIT}`)
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
          if (!Object.values(itemFlfllmnts).includes(id)) {
            const key = `ffID${id}`
            //MM->Mismatch
            initObj[key] = `fulfillment id ${id} does not exist in /${constants.ON_SELECT}`
          }

          if (!_.isEqual(init.fulfillments[i].end.location.gps, getValue('buyerGps'))) {
            const gpskey = `gpsKey${i}`
            initObj[
              gpskey
            ] = `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.INIT}`
          }

          if (!_.isEqual(init.fulfillments[i].end.location.address.area_code, getValue('buyerAddr'))) {
            const addrkey = `addrKey${i}`
            initObj[
              addrkey
            ] = `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.SELECT} & /${constants.INIT}`
          }
        } else {
          initObj.ffId = `fulfillments[${i}].id is missing in /${constants.INIT}`
        }

        i++
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments object in /${constants.INIT}, ${error.stack}`)
    }

    return initObj
  } catch (err: any) {
    logger.error(`!!Some error occurred while checking /${constants.INIT} API`, err)
  }
}

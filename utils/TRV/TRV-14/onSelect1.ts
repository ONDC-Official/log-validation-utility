import { validateOnItemTagsStructure, validateQuote, validateXInput } from './TRV14checks'
import constants, { TRV14ApiSequence } from '../../../constants'
import { getValue, setValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { isObjectEmpty, validateSchema } from '../../../utils'

// @ts-ignore
export const checkOnSelect1 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
  const errorObj: any = {}
  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SELECT_1]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SELECT_1} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SELECT_1, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    const onSelect = message.order
    const ItemMap = getValue(`items`)
    const prvdrId = getValue(`prvdrId`)
    const fulfillmentids = getValue(`fulfillmentids`)
    const itemAddOn = getValue(`addOnItems`)
    const Xinputmap = new Map()

    try {
      if (onSelect.provider.id !== prvdrId) {
        errorObj.prvdrId = `prvdrid mismatches in select and on_select`
      }
    } catch (error) {
      logger.error(error)
    }

    //checking items that they dont contain extra property
    try {
      let ABSTRACT_FLAG = false
      let ENTRY_PASS_FLAG = false

      onSelect.items.forEach((itm: any) => {
        if (itm.descriptor.code === 'ABSTRACT') {
          ABSTRACT_FLAG = true
          const allowedKeys = ['id', 'descriptor', 'location_ids', 'category_ids', 'time', 'fulfillment_ids', 'tags']
          if (itm.price) {
            rsfObj[`${itm.id}_price`] = `itm price should not be there`
          }
          if (itm.quantity) {
            rsfObj[`${itm.id}_quantity`] = `itm quantity should not be there`
          }

          if (itm.parent_item_id) {
            rsfObj[`${itm.id}`] =
              `item with id:${itm.id} with descriptor code as ABSTRACT should not have parent_item_id`
          }

          if (!itm.tags) {
            rsfObj.parentitmtags = `parent item tags is missing`
          } else {
            itm.tags.forEach((itm: any) => {
              const tags = ['INCLUSIONS', 'EXCLUSIONS']
              if (!tags.includes(itm.descriptor.code)) {
                rsfObj.tagsdescriptorcode = `parent tags descriptior code is not valid`
              }
              let list = itm.list
              list.forEach((itm: any) => {
                if (itm.value === '') {
                  rsfObj.list[`${itm}`] = `itm value can be empty string`
                }
              })
            })
          }
          Object.keys(itm).forEach((key) => {
            if (!allowedKeys.includes(key)) {
              rsfObj[`${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
            }
          })
        }
        if (itm.descriptor.code === 'ENTRY_PASS') {
          ENTRY_PASS_FLAG = true
          const allowedKeys = [
            'id',
            'descriptor',
            'parent_item_id',
            'location_ids',
            'category_ids',
            'price',
            'quantity',
            'time',
            'fulfillment_ids',
            'add_ons',
            'xinput',
            'tags',
          ]
          if (itm.parent_item_id === '') {
            rsfObj[`${itm.id}`] = `parent_item_id can't have empty values for item with id: ${itm.id}  `
          }
          if (!itm.parent_item_id) {
            rsfObj[`${itm.id}`] = `parent_item_id is missing in item obj with id:${itm.id}`
          }
          Object.keys(itm).forEach((key) => {
            if (!allowedKeys.includes(key)) {
              rsfObj[`${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
            }
          })
          const tagsError = validateOnItemTagsStructure(itm.tags, itm.id)
          Object.assign(rsfObj, tagsError)
        }
        if (itm.descriptor.code === 'ADD_ON') {
          if (itemAddOn.length <= 0) {
            rsfObj[`Addons`] = `No items were selected for Add-ons`
          } else {
            const allowedKeys = ['id', 'descriptor', 'parent_item_id', 'price', 'quantity']
            if (itm.parent_item_id === '') {
              rsfObj[`Addon${itm.id}`] = `${itm.id} can't have empty string parent_item_id`
            }
            if (!itm.parent_item_id) {
              rsfObj[`Addon${itm.id}`] = `parent_item_id is missing in item obj with id:${itm.id}`
            }
            if (!itm.price) {
              rsfObj[`Addon${itm.id}`] = `${itm.id} should have price object`
            }
            if (!itm.quantity) {
              rsfObj[`Addon${itm.id}`] = `${itm.id} should have quantity object`
            }

            Object.keys(itm).forEach((key) => {
              if (!allowedKeys.includes(key)) {
                rsfObj[`Addon${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
              }
            })
          }
        }
      })
      if (!ABSTRACT_FLAG && ENTRY_PASS_FLAG) {
        rsfObj[`parent_item`] = `parent item object having descriptor.code as ABSTRACT was not found in items array`
      } else if (ABSTRACT_FLAG && !ENTRY_PASS_FLAG) {
        rsfObj[`child_item`] = `child_item does not exist for the parent item`
      }
    } catch (error) {
      logger.error(error)
    }

    try {
      onSelect.items.forEach((itm: any) => {
        if (itm.parent_item_id) {
          if (ItemMap.has(itm.id)) {
            if (itm.quantity.selected.count !== ItemMap.get(itm.id)) {
              rsfObj.item[itm.id] = `${itm.id} selected quantity mismatches on select and on_select`
            }
          } else {
            rsfObj.item[itm.id] = `${itm.id} does not exist in select`
          }
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //checking fulfillments id
    try {
      onSelect.fulfillments.forEach((itm: any) => {
        if (!fulfillmentids.includes(itm.id)) {
          errorObj.fulfmentId = `fulfillment id mismatched on select and on_select`
        }
        if (itm.agent.organization.contact.phone === '') {
          errorObj[`contact/phone`] = ` phone cant be empty string`
        }
        if (itm.agent.organization.contact.email === '') {
          errorObj[`contact/email`] = ` email cant be empty string`
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //quote checking
    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)
      const quoteErrors = validateQuote(onSelect.quote, constants.ON_SELECT, itemAddOn)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
    }

    //checking quote
    try {
      onSelect.quote.breakup.forEach((itm: any) => {
        const allowed = ['BASE_FARE', 'ADD_ONS']

        // Ensure rsfObj.item is initialized
        if (!rsfObj.item) {
          rsfObj.item = {}
        }

        if (itm.title === 'ADD_ONS') {
          if (!itemAddOn.has(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} does not have addons property in items`
          }
        }

        if (itm.item && allowed.includes(itm.item.title)) {
          if (!ItemMap.has(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} does not exist in select`
          } else if (itm.item.quantity.selected.count !== ItemMap.get(itm.item.id)) {
            rsfObj.item[itm.item.id] = `${itm.item.id} selected quantity mismatches`
          }
        }

        if (Object.keys(rsfObj.item).length === 0) {
          delete rsfObj.item
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //validating xinput
    try {
      onSelect.items.forEach((itm: any) => {
        if (itm.descriptor.code === 'ENTRY_PASS') {
          const validateXinput = validateXInput(itm?.xinput)
          if (Xinputmap.get(itm.id)) {
            rsfObj.itm.id = `${itm.id} has been already in items`
          } else {
            Xinputmap.set(itm.id, itm.xinput)
          }
          Object.assign(rsfObj, validateXinput)
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //checking cancellation_terms
    // try {
    //   onSelect.cancellation_terms.forEach((itm:any,index:number)=>{
    //     if(!itm.cancellation_eligible){
    //       rsfObj[`cancellation_terms[${index}].cancellation_eligible`] = `Cancellation_eligible is missing at index: ${index}`
    //     }
    //   })
    // } catch (error) {
    //   logger.error(error)
    // }

    setValue('onSelect1_context', context)
    setValue('onSelect1_message', message)
    setValue('agent', onSelect.fulfillments[0]?.agent)
    setValue('replacementterms', onSelect.replacement_terms)
    setValue('onselect1quote', onSelect.quote)
    setValue('onSelect1Items', onSelect.items)
    setValue('xinputmap', Xinputmap)
    Object.assign(rsfObj, errorObj)
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SELECT_1} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SELECT_1} API`, err)
    }
  }
}

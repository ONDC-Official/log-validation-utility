import constants, { TRV14ApiSequence } from '../../../constants'
import { getValue, setValue } from '../../../shared/dao'
import { logger } from '../../../shared/logger'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { compareonItems, compareQuote, compareReplacementTerms, validateOnItemTagsStructure, validateQuote } from './TRV14checks'

// @ts-ignore
export const checkOnSelect2 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
  const errorObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SELECT_2]: 'JSON cannot be empty' }
  }

  const replacement_terms = getValue('replacementterms')
  const Xinput = getValue(`onSelect1xinput`)
  const quote = getValue(`onselect1quote`)

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SELECT_2} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SELECT_2, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }
    const onSelect = message.order
    const ItemMap = getValue(`items`)
    const prvdrId = getValue(`prvdrId`)
    const itemAddOn = getValue(`addOnItems`)
    const fulfillmentids = getValue(`select2fulfillmentids`)
    const items = getValue(`onSelect1Items`)

    if (onSelect.provider.id !== prvdrId) {
      errorObj.prvdrId = `prvdrid mismatches in select and on_select`
    }

    //checking id and their quantity
    onSelect.items.forEach((itm: any) => {
      if (itm.parent_item_id) {
        if (ItemMap.has(itm.id)) {
          if (itm.quantity.selected.count !== ItemMap.get(itm.id)) {
            errorObj.item.id = `${itm.id} selected quantity mismatches on select and on_select`
          }
        } else {
          errorObj.item.id = `${itm.id} doesnot exist in select`
        }
      }
    })

    //checking fulfillments id
    try {
      onSelect.fulfillments.forEach((itm: any) => {
        if (!fulfillmentids.includes(itm.id)) {
          errorObj.fulfmentId = `fulfillment id mismatched on select and on_select`
        }
      })
    } catch (error) {
      logger.error(error)
    }
    

    //quote checking
    try {
      logger.info(`Checking quote details in /${constants.ON_SELECT}`)

       //checking quote calculation
       let totalsum = 0

       // ✅ Ensure rsfObj.quote is initialized
       if (!rsfObj.quote || typeof rsfObj.quote !== 'object') {
         rsfObj.quote = {}
       }
 
       onSelect.quote.breakup.forEach((itm: any) => {
         const expectedValue = Number(itm.item.price.value) * Number(itm.item.quantity.selected.count)
         const actualValue = Number(itm.price.value)
 
         if (actualValue !== expectedValue) {
           rsfObj.quote[`${itm.item.id}`] = `${itm.id} with price expected  ${expectedValue} this but got ${actualValue} this `
         } else {
           totalsum += expectedValue
         }
       })
 
       if (totalsum !== Number(onSelect.quote.price.value)) {
         rsfObj.quote[`price`] = `quote breakup summation is not correct`
       }

       //validating quote structure

      const quoteErrors = validateQuote(onSelect.quote, constants.ON_SELECT,itemAddOn)
      Object.assign(errorObj, quoteErrors)
    } catch (error: any) {
      logger.error(`!!Error occcurred while checking Quote in /${constants.ON_SELECT},  ${error.message}`)
      return { error: error.message }
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

          if (itm.parent_item_id === '') {
            rsfObj.parent_item_id = ` parent_item_id can't be empty string `
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
              rsfObj[`Addon${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
            }
          })
        }
        if (itm.descriptor.code === 'ENTRY_PASS') {
          ENTRY_PASS_FLAG = true
          const allowedKeys = [
            'id',
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
            rsfObj[`${itm.id}`] = `parent_item_id can't have empty values for item with id:${itm.id} `
          }
          if (!itm.parent_item_id) {
            rsfObj[`${itm.id}`] = `parent_item_id is missing in item obj with id:${itm.id} `
          }
          Object.keys(itm).forEach((key) => {
            if (!allowedKeys.includes(key)) {
              rsfObj[`Child${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
            }
          })

          const tagsError = validateOnItemTagsStructure(itm.tags,itm.id)
          Object.assign(rsfObj,tagsError)
        }
        if (itm.descriptor.code === 'ADD_ON') {
          if(itemAddOn.length <= 0){
            rsfObj[`Addons`] = `No items were selected for Add-ons`
          }
          else{
            const allowedKeys = ['id', 'descriptor', 'parent_item_id', 'price', 'quantity'];
          if(itm.parent_item_id === ''){
            rsfObj[`Addon${itm.id}`] = `${itm.id} can't have empty string parent_item_id`
          }
          if(!itm.parent_item_id){
            rsfObj[`Addon${itm.id}`] = `parent_item_id is missing in item obj with id:${itm.id}`
          }
          if(!itm.price){
            rsfObj[`Addon${itm.id}`] = `${itm.id} should have price object`
          }
          if(!itm.quantity){
            rsfObj[`Addon${itm.id}`] = `${itm.id} should have quantity object`
          }

          Object.keys(itm).forEach((key) => {
            if (!allowedKeys.includes(key)) {
              rsfObj[`Addon${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`;
            }
          });
          }
        }
      })
      if(!ABSTRACT_FLAG && ENTRY_PASS_FLAG){
        rsfObj[`parent_item`]= `parent item not found having descriptor.code as ABSTRACT`
      }
      else if(ABSTRACT_FLAG && !ENTRY_PASS_FLAG){
        rsfObj[`child_item`]= `child_item does not found having descriptor.code as ENTRY_PASS`
      }
    } catch (error) {
      logger.error(error)
    }

    // comparinf quote breakup
    try {
      const quoteError = compareQuote(onSelect.quote, quote)
      Object.assign(rsfObj, quoteError)
    } catch (error) {
      logger.error(error)
    }

    // compareItems
    try {
      const ItemsError = compareonItems(onSelect.items, items)
      Object.assign(rsfObj, ItemsError)
    } catch (error) {
      logger.error(error)
    }

    // validating Xinput
    try {
      onSelect.items.forEach((itm: any) => {
        if (itm.xinput && itm.xinput.form?.id) {
          const xinputFormId = itm.xinput.form.id

          const exists = items.some((existingItem: any) => existingItem.xinput?.form?.id === Xinput.form.id)

          if (exists) {
            console.log(`Form with ID ${xinputFormId} already exists in items`)
          } else {
            console.log(`New form detected: ${xinputFormId}`)
          }
        }
      })
    } catch (error) {
      logger.error(error)
    }

    //checking diff in replacement terms
    try {
      const diff = compareReplacementTerms(onSelect.replacement_terms, replacement_terms)
      Object.assign(rsfObj, diff)
    } catch (error) {
      logger.error(error)
    }
  

     //checking cancellation_terms
     try {
      onSelect.cancellation_terms.forEach((itm:any,index:number)=>{
        if(!itm.cancellation_eligible){
          rsfObj[`cancellation_terms[${index}].cancellation_eligible`] = `Cancellation_eligible is missing at index: ${index}`
        }
      })
    } catch (error) {
      logger.error(error)
    }

    setValue('onSelectquote', onSelect.quote)
    setValue('onSelect2items', onSelect.items)
    setValue('onSelect2fulfillment', onSelect.fulfillments)
    setValue('onSelect1_context', context)
    setValue('onSelect1_message', message)
    Object.assign(rsfObj, errorObj)
    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SELECT_2} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SELECT_2} API`, err)
    }
  }
}

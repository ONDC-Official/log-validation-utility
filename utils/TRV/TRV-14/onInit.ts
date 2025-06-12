import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import {
  compareOnFulfillments,
  compareonItems,
  compareQuote,
  compareReplacementTerms,
  validateOnItemTagsStructure,
  validateQuote,
  validateTagsStructure,
} from './TRV14checks'

// @ts-ignore
export const checkOnInit = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_INIT]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_INIT} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_INIT, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const oninit = message.order
    const fulfillments = getValue(`onSelect2fulfillment`)
    const prvdrId = getValue(`initprvdrId`)
    const items = getValue(`onSelect2items`)
    const itemMap = getValue(`items`)
    const itemAddOn = getValue(`addOnItems`)
    const onselectquote = getValue('onSelectquote')
    const replacement_terms = getValue('replacementterms')

    try {
      //checking providerid
      if (oninit.provider.id !== prvdrId) {
        rsfObj.prvdrid = `prvdr id mismatches on on_init and init`
      }

      setValue(`oninitprvdrid`, oninit.provider.id)
    } catch (error) {
      logger.error(error)
    }

    try {
      const quoteErr = validateQuote(oninit.quote,"onInit",itemAddOn)
      Object.assign(rsfObj,quoteErr)
    } catch (error) {
      logger.error(error)
    }

    //validating fulfillments
    try {
      oninit.fulfillments.forEach((itm:any,index:Number)=>{
        if(!itm.agent){
          rsfObj[`fulfillment${index}agent`]= `fulfillment index:${index} agent is missing`
        }
        else{
          const agent = itm.agent
          if(!agent.organization){
            rsfObj[`fulfillment${index}agentOrg`]= `fulfillment index:${index} agent organization is missing`
          }
          if(!agent.organization.contact){
            rsfObj[`fulfillment${index}agentOrgContact`]= `fulfillment index:${index} agent organization contact is missing`
          }
          if(!agent.organization.contact.phone){
            rsfObj[`fulfillment${index}agent/Org/Contact.Phone`]= `fulfillment index:${index} agent/organization/contact.phone is missing`
            }
            if(agent.organization.contact.phone === ''){
              rsfObj[`fulfillment${index}agent/Org/Contact.Phone`]= `fulfillment index:${index} agent/organization/contact.phone cant be empty string`
              }
              if(!agent.organization.contact.email){
                rsfObj[`fulfillment${index}agent/Org/Contact/Email`]= `fulfillment index:${index} agent/organization/contact.email is missing`
                }
                if(agent.organization.contact.email === ''){
                  rsfObj[`fulfillment${index}agent/Org/Contact/Email`]= `fulfillment index:${index} agent/organization/contact.email cant be empty string`
                  }
        }

        if(!itm.vehicle){
          rsfObj[`fulfillment${index}vehicle`]= `fulfillment index:${index} vehicle is missing`
        }
        else{
          const vehicle = itm.vehicle
          if(!vehicle.category){
            rsfObj[`fulfillment${index}vehicleCategory`]= `fulfillment index:${index} vehicle.category is missing`
          }
          if(vehicle.category === ''){
            rsfObj[`fulfillment${index}vehicleCategory`]= `fulfillment index:${index} vehicle.category cant be empty string`
          }
        }
      })
    } catch (error) {
      logger.error(error)
    }

    try {
      //validate replacementterms
      const replacementerror = compareReplacementTerms(oninit.replacement_terms, replacement_terms)
      Object.assign(rsfObj, replacementerror)
    } catch (error) {
      logger.error(error)
    }

    try {
      //validate tags
      const tagsError = validateTagsStructure(oninit.tags)
      Object.assign(rsfObj, tagsError)
    } catch (error) {
      logger.error(error)
    }

    try {
      //checking quote calculation
      let totalsum = 0

      // ✅ Ensure rsfObj.quote is initialized
      if (!rsfObj.quote || typeof rsfObj.quote !== 'object') {
        rsfObj.quote = {}
      }

      oninit.quote.breakup.forEach((itm: any) => {
        const expectedValue = Number(itm.item.price.value) * Number(itm.item.quantity.selected.count)
        const actualValue = Number(itm.price.value)

        if (actualValue !== expectedValue) {
          rsfObj.quote[`${itm.item.id}`] = `itm id ${itm.item.id} with price expected  ${expectedValue} this but got ${actualValue}  `
        } else {
          totalsum += expectedValue
        }
      })

      if (totalsum !== Number(oninit.quote.price.value)) {
        rsfObj.quote[`price`] = `quote breakup summation is not correct`
      }
    } catch (error) {
      logger.error(error)
    }

    //comparefulfilment
    try {
      const fulfillmentError = compareOnFulfillments(oninit.fulfillments, fulfillments)
      Object.assign(rsfObj, fulfillmentError)
    } catch (error) {
      logger.error(error)
    }

    //compare Items
    try {
      const ItemsError = compareonItems(oninit.items, items)
      Object.assign(rsfObj, ItemsError)
    } catch (error) {
      logger.error(error)
    }

    //checking items that they dont contain extra property

    try {
      let ABSTRACT_FLAG = false
      let ENTRY_PASS_FLAG = false

      oninit.items.forEach((itm: any) => {
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
            rsfObj[`${itm.id}`] = `parent_item_id can't have empty values for item with id: ${itm.id} `
          }
          if (!itm.parent_item_id) {
            rsfObj[`${itm.id}`] = `parent_item_id is missing in item obj with id:${itm.id}`
          }
          Object.keys(itm).forEach((key) => {
            if (!allowedKeys.includes(key)) {
              rsfObj[`${itm.id}_${key}`] = `'${key}' is not required in item obj with id:${itm.id}`
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

    //checking quote keys
    oninit.quote.breakup.forEach((itm: any) => {
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
        if (!itemMap.has(itm.item.id)) {
          rsfObj.item[itm.item.id] = `${itm.item.id} does not exist in select`
        } else if (itm.item.quantity.selected.count !== itemMap.get(itm.item.id)) {
          rsfObj.item[itm.item.id] = `${itm.item.id} selected quantity mismatches`
        }
      }
      if (JSON.stringify(rsfObj.item) === '{}') {
        delete rsfObj.item
      }
    })

    //comparing quote
    try {
      const quoteError = compareQuote(oninit.quote, onselectquote)
      Object.assign(rsfObj, quoteError)
    } catch (error) {
      logger.error(error)
    }

     //checking cancellation_terms
     try {
      oninit.cancellation_terms.forEach((itm:any,index:number)=>{
        if(!itm.cancellation_eligible){
          rsfObj[`cancellation_terms[${index}].cancellation_eligible`] = `Cancellation_eligible is missing at index: ${index}`
        }
      })
    } catch (error) {
      logger.error(error)
    }

    setValue('onInit_context', context)
    setValue('onInit_message', message)
    setValue(`onInitfulfilments`, oninit.fulfillments)
    setValue(`onInitProvider`, oninit.provider)
    setValue(`onInitItems`, oninit.items)
    setValue(`onInitquote`, oninit.quote)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_INIT} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_INIT} API`, err)
    }
  }
}

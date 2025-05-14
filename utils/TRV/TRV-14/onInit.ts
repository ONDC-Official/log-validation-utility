import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { getValue, setValue } from '../../../shared/dao'
import { compareOnFulfillments, compareonItems, compareQuote, compareReplacementTerms, validateTagsStructure } from './TRV14checks'

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
    const prvdrId = getValue(`select2prvdrId`)
    const items =  getValue(`onSelect2items`)
    const itemMap= getValue(`items`)
    const itemAddOn= getValue(`addOnItems`)
    const onselectquote =  getValue('onSelectquote') 
    const replacement_terms = getValue('replacementterms')


    try {
      //checking providerid
      if(oninit.provider.id !== prvdrId){
        rsfObj.prvdrid=`prvdr id mismatches on on_init and init` 
      }
      
        setValue(`oninitprvdrid`,oninit.provider.id)

    } catch (error) {
      logger.error(error)
    }
   

    try {
      //validate replacementterms
    const replacementerror = compareReplacementTerms(oninit.replacement_terms,replacement_terms)
    Object.assign(rsfObj,replacementerror)
    } catch (error) {
      logger.error(error)
    }

    

    try {
      //validate tags
    const tagsError =  validateTagsStructure(oninit.tags)
    Object.assign(rsfObj,tagsError)
    } catch (error) {
      logger.error(error)
    }

    

      try {
         //checking quote price
    if(oninit.quote.price.value !== onselectquote.price.value ){
      rsfObj.quote.price = `quote price mismatches in on_select and on_init`
    }
      } catch (error) {
        logger.error
      }
   

    //comparefulfilment
    try {
      const fulfillmentError = compareOnFulfillments(oninit.fulfillments,fulfillments)
      Object.assign(rsfObj,fulfillmentError)
    } catch (error) {
      logger.error(error)
    }

    //compare Items
    try {
      const ItemsError = compareonItems(oninit.items,items) 
      Object.assign(rsfObj,ItemsError) 
    } catch (error) {
      logger.error(error)
    }

    //checking quote keys 
    oninit.quote.breakup.forEach((itm: any) => {
      const allowed = ["BASE_FARE", "ADD_ONS"];
      
      // Ensure rsfObj.item is initialized
      if (!rsfObj.item) {
        rsfObj.item = {};
      }
    
      if (itm.title === "ADD_ONS") {
        if (!itemAddOn.has(itm.item.id)) {
          rsfObj.item[itm.item.id] = `${itm.item.id} does not have addons property in items`;
        }
      }
    
      if (itm.item && allowed.includes(itm.item.title)) {
        if (!itemMap.has(itm.item.id)) {
          rsfObj.item[itm.item.id] = `${itm.item.id} does not exist in select`;
        } else if (itm.item.quantity.selected.count !== itemMap.get(itm.item.id)) {
          rsfObj.item[itm.item.id] = `${itm.item.id} selected quantity mismatches`;
        }
      }
    });

    //comparing quote
    try {
      const quoteError = compareQuote(oninit.quote,onselectquote)
      Object.assign(rsfObj,quoteError)
    } catch (error) {
      logger.error(error)
    }

    setValue('onInit_context', context)
    setValue('onInit_message', message)
    setValue(`onInitfulfilments`, oninit.fulfillments)
    setValue(`onInitProvider`,oninit.provider)
    setValue(`onInitItems`,oninit.items)
    setValue(`onInitquote`,oninit.quote)

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

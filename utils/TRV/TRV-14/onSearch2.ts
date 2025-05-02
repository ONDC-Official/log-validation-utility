import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { compareCategories, compareLocations, compareOnFulfillments, compareonItems, onSearchCompareDescriptors, onSearchCompareTags } from './TRV14checks'

// @ts-ignore
export const checkOnSearch2 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SEARCH_2]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SEARCH_2} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SEARCH, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const items = getValue('onSearchitems')
    const fulfillment =  getValue('onSearch1fulfillment')
    const provider = getValue('onSearch1provider')
    const descriptor = getValue('onSearch1descriptor')
    // const payments = getValue('onSearch1payments')
    const tags = getValue('onSearch1tags')
    // const cur = getValue('curr')

    const onSearch =  message.catalog

    try {
      const itemsError =  compareonItems(onSearch.providers[0].items,items)
      Object.assign(rsfObj,itemsError)
    } catch (error) {
      logger.error(error)
    }

    try {
      const LocationError =  compareLocations(onSearch.providers[0].locations,provider[0].locations)
      Object.assign(rsfObj,LocationError)
    } catch (error) {
      logger.error(error)
    }

    try {
      const CategoriesError =  compareCategories(onSearch.providers[0].categories,provider[0].categories)
      Object.assign(rsfObj,CategoriesError)
    } catch (error) {
      logger.error(error)
    }

    try {
      const fulfillmentError =  compareOnFulfillments(onSearch.providers[0].fulfillments,fulfillment)
      Object.assign(rsfObj,fulfillmentError)
    } catch (error) {
      logger.error(error)
    }

    try {
      const descriptorError = onSearchCompareDescriptors(onSearch.descriptors,descriptor)
      Object.assign(rsfObj,descriptorError)
    } catch (error) {
      logger.error(error)
    }

    try {
      
      const TagError = onSearchCompareTags(onSearch.tags,tags)
      Object.assign(rsfObj,TagError)
    } catch (error) {
      logger.error(error)
    }

    
    setValue('onSearch2_context', context)
    setValue('onSearch2_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SEARCH_2} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SEARCH_2} API`, err)
    }
  }
}

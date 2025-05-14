import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { checkingPagenumber, compareCategories, compareLocations, compareProvidersArray, onSearchCompareDescriptors, onSearchCompareTags } from './TRV14checks'

// @ts-ignore
export const checkOnSearch1 = (data: any, msgIdSet: any, version: any,action:any) => {
  const rsfObj: any = {}

  const { message }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SEARCH_1]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SEARCH_1} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SEARCH_1, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const onSearch = message.catalog
    const provider = getValue('onSearchprovider')
    const tags =  getValue('onSearchTags')
    const descriptor = getValue('onSearchdescriptors')
    const existingItemMap =  getValue("itemMap")

    const itemcurentmap= new Map()
    //comparing provider
    try{
      const providerError = compareProvidersArray(onSearch.providers,provider)
      Object.assign(rsfObj,providerError)
    }
    catch(error){
      logger.error(error)
    }

    //comparing descriptors
    try{
      const DescriptorError = onSearchCompareDescriptors(onSearch.descriptor,descriptor)
      Object.assign(rsfObj,DescriptorError)
    }
    catch(error){
      logger.error(error)
    }

    //comparing categories
    try{
      const CategoriesError = compareCategories(onSearch.providers[0].categories,provider[0].categories)
      Object.assign(rsfObj,CategoriesError)
    }
    catch(error){
      logger.error(error)
    }

    //comparing locations
    try{
      const LocationError = compareLocations(onSearch.providers[0].locations,provider[0].locations)
      Object.assign(rsfObj,LocationError)
    }
    catch(error){
      logger.error(error)
    }

    //comparing tags
    try{
    const paginationerror = checkingPagenumber(onSearch.tags,action.charAt(action.length-1))
      Object.assign(rsfObj,paginationerror)
      const TagError = onSearchCompareTags(onSearch.tags,tags)
      Object.assign(rsfObj,TagError)
    }
    catch(error){
      logger.error(error)
    }

  try {
  // Step 1: Store fulfillments in a map by ID
  const fulfillmentMap = new Map<string, any>();
  onSearch.providers[0].fulfillments.forEach((itm: any) => {
    if (itm?.id) {
      fulfillmentMap.set(itm.id, { id: itm.id, type: itm.type, agent: itm.agent });
    }
  });

  // Step 2: Process items and build itemcurentmap
  onSearch.providers[0].items.forEach((item: any) => {
    if (!item?.id) return;

    const existing = itemcurentmap.get(item.id) || { fulfillment_ids: [], agent: null };

    // Handle multiple fulfillment_ids
    if (Array.isArray(item.fulfillment_ids)) {
      item.fulfillment_ids.forEach((fid: string) => {
        if (fulfillmentMap.has(fid)) {
          const fullObj = fulfillmentMap.get(fid);
          const alreadyAdded = existing.fulfillment_ids.some((f: any) => f.id === fullObj.id);
          if (!alreadyAdded) {
            existing.fulfillment_ids.push(fullObj);
          }
        }
      });
    }

    // Assign agent if not already set
    if (item.agent && !existing.agent) {
      existing.agent = item.agent;
    }

    itemcurentmap.set(item.id, existing);
  });
} catch (error) {
  logger.error(error);
}

if (!existingItemMap) {
  setValue('itemMap', itemcurentmap);
} else {
  // Merge itemcurentmap into existingItemMap
  itemcurentmap.forEach((value, key) => {
    if (!existingItemMap.has(key)) {
      existingItemMap.set(key, value);
    } else {
      const existingValue = existingItemMap.get(key);

      // Merge fulfillment_ids avoiding duplicates
      const fulfillmentIds = [...existingValue.fulfillment_ids];
      value.fulfillment_ids.forEach((f: any) => {
        if (!fulfillmentIds.some((ef: any) => ef.id === f.id)) {
          fulfillmentIds.push(f);
        }
      });

      // Prefer existing agent if it already exists
      existingItemMap.set(key, {
        fulfillment_ids: fulfillmentIds,
        agent: existingValue.agent || value.agent,
      });
    }
  });

  setValue('itemMap', existingItemMap);
}

    setValue('onSearchitems',onSearch.providers[0].items)
    setValue('onSearch1fulfillment',onSearch.providers[0].fulfillments)
    setValue('onSearch1provider',onSearch.providers)
    setValue('onSearch1descriptor',onSearch.descriptors)
    setValue('onSearch1payments',onSearch.providers[0].payments)
    setValue('onSearch1tags',onSearch.tags)


    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.ON_SEARCH_1} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SEARCH_1} API`, err)
    }
  }
}

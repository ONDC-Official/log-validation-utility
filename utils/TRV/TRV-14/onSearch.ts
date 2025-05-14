import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { setValue } from '../../../shared/dao'
import { validateTagsStructure } from './TRV14checks'

// @ts-ignore
export const checkOnSearch = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.ON_SEARCH_1]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SEARCH} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.ON_SEARCH, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const onSearch = message.catalog

    //validating providers
    try {
      onSearch.providers.forEach((itm:any) => {
        const range = itm.time.range;
        const start = new Date(range.start);
        const end = new Date(range.end);
    
        if (start > end) {
          rsfObj.range = "Range start time can't be greater than end time.";
        }
      });
    } catch (error) {
      logger.error(error);
    }
    

    //validating Tags
    try {
        onSearch.tags.forEach((itm:any)=>{
            if(itm.descriptor.code === 'PAGINATION'){
                itm.list.forEach((itm: any)=>{
                    if(itm.descriptor.code === 'MAX_PAGE_NUMBER'){
                        setValue("MaxPages",itm.value)
                    }
                })
            }
        })
        const TagsError = validateTagsStructure(onSearch.tags)
        Object.assign(rsfObj,TagsError)
    } catch (error) {
        logger.error(error)
    }

    setValue(`onSearchTags`,onSearch.tags)
    setValue('onSearchdescriptors',onSearch.descriptor)
    setValue('onSearchprovider',onSearch.providers)
    setValue('onSearch1_context', context)
    setValue('onSearch1_message', message)

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

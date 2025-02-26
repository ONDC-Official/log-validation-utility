import { SRV19APISequence } from "../../../constants"
import { setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { checkSRVContext, isObjectEmpty, validateSchema } from "../../../utils"
// @ts-ignore
export const checkSearch = (data: any, msgIdSet: any, version: any, sequence: string) => {
    const rsfObj: any = {}

    const { message, context }: any = data

  
    if (!data || isObjectEmpty(data)) {
      return { [SRV19APISequence.SEARCH]: 'JSON cannot be empty' }
    }
  
    try {
      logger.info(`Validating Schema for ${SRV19APISequence.SEARCH} API`)
      const vs = validateSchema('srv19', SRV19APISequence.SEARCH, data)
      
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
      let errors: any = {}
       // validate context
       let contextRes: any
       contextRes = checkSRVContext(data.context, 'search')
 
       if (!contextRes?.valid) {
         Object.assign(errors, contextRes.ERRORS)
       }
      
      setValue('search_context', context)
      setValue('search_message', message)

      if (Object.keys(errors).length > 0) {
        return { validation_errors: errors }
    }
  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${SRV19APISequence.SEARCH} API!`)
      } else {
        console.log("Error occurred while checking /API:", err)
        logger.error(`!!Some error occurred while checking /${SRV19APISequence.SEARCH} API`, err)
      }
    }

}
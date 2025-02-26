import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../.."
import {  setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkOnSearch = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
    
        const { message, context }: any = data
        
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.ON_SEARCH]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.ON_SEARCH} API`)
          const vs = validateSchema('srv19', SRV19APISequence.ON_SEARCH, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }

          let errors: any = {}

          const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.SEARCH, context.action)
          if (!contextRes?.valid) {
            Object.assign(errors, contextRes.ERRORS)
          }
       
     setValue('on_search_context', context)
     setValue('on_search_message', message)
     
     if (Object.keys(errors).length > 0) {
       return { validation_errors: errors }
   }
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.ON_SEARCH} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_SEARCH} API`, err)
          }
        }
    
}
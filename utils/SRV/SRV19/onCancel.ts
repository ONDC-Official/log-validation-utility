import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../.."
import { setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkOnCancel = (data: any, msgIdSet: any, version: any) => {
     const rsfObj: any = {}
        
        const { message, context }: any = data
    
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.ON_CANCEL]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.ON_CANCEL} API`)
          const vs = validateSchema('srv19', SRV19APISequence.ON_CANCEL, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
          
          setValue('on_cancel_context', context)
          setValue('on_cancel_message', message)
          let errors: any = {}
                   const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_INIT, context.action)
                   if (!contextRes?.valid) {
                       Object.assign(errors, contextRes.ERRORS)
                   }
                   if (Object.keys(errors).length > 0) {
                    return { validation_errors: errors }
                  }
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.ON_CANCEL} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_CANCEL} API`, err)
          }
        }
}
import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkOnUpdate = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
    
        const { message, context }: any = data
        
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.ON_UPDATE]: 'JSON cannot be empty' }
        }

      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.ON_UPDATE} API`)
          const vs = validateSchema('srv19', SRV19APISequence.ON_UPDATE, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('on_update_context', context)
          setValue('on_update_message', message)

           let errors: any = {}
                setValue('update_context', context)
                setValue('update_message', message)
                const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.UPDATE, context.action)
                if (!contextRes?.valid) {
                  Object.assign(errors, contextRes.ERRORS)
                }
                const prevMessage = getValue('update_message')
                if (prevMessage?.order?.id && message.order_id) {
                  if (message.order_id !== prevMessage.order.id) {
                      rsfObj.order_id = 'Mismatch in order_id with update'
                  }
                }
                    if (Object.keys(errors).length > 0) {
                      return { validation_errors: errors }
                    }
            
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.ON_UPDATE} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_UPDATE} API`, err)
          }
        }
    
}
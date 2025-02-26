import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../.."
import { getValue, setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkCancel = (data: any, msgIdSet: any, version: any) => {
     const rsfObj: any = {}
        
        const { message, context }: any = data
    
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.CANCEL]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.CANCEL} API`)
          const vs = validateSchema('srv19', SRV19APISequence.CANCEL, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('cancel_context', context)
          setValue('cancel_message', message)

          let errors: any = {}
         
          const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_STATUS, context.action)
          if (!contextRes?.valid) {
              Object.assign(errors, contextRes.ERRORS)
          }
          const prevMessage = getValue('on_status_message')
          if (prevMessage?.order?.id && message.order_id) {
            if (message.order_id !== prevMessage.order.id) {
                rsfObj.order_id = 'Mismatch in order_id with status'
            }
        }
        if (Object.keys(errors).length > 0) {
          return { validation_errors: errors }
        }
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.CANCEL} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.CANCEL} API`, err)
          }
        }
}
import { SRV19APISequence } from "../../../constants"
import { getValue, setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { validateContext } from "./srvChecks"
// @ts-ignore
export const checkUpdate = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}

    const { message, context }: any = data

  
    if (!data || isObjectEmpty(data)) {
      return { [SRV19APISequence.UPDATE]: 'JSON cannot be empty' }
    }
  
    try {
      logger.info(`Validating Schema for ${SRV19APISequence.UPDATE} API`)
      const vs = validateSchema('srv19', SRV19APISequence.UPDATE, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
      let errors: any = {}
      setValue('update_context', context)
      setValue('update_message', message)
      const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_CONFIRM, context.action)
      if (!contextRes?.valid) {
        Object.assign(errors, contextRes.ERRORS)
      }
      const prevMessage = getValue('on_confirm_message')
      if (prevMessage?.order?.id && message.order_id) {
        if (message.order_id !== prevMessage.order.id) {
            rsfObj.order_id = 'Mismatch in order_id with on_confirm'
        }
      }
          if (Object.keys(errors).length > 0) {
            return { validation_errors: errors }
          }
  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${SRV19APISequence.UPDATE} API!`)
      } else {
        console.log("Error occurred while checking /API:", err)
        logger.error(`!!Some error occurred while checking /${SRV19APISequence.UPDATE} API`, err)
      }
    }

}
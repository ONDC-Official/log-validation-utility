import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { setValue } from "../../../shared/dao"

// @ts-ignore
export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
    
    const { message, context }: any = data

  
    if (!data || isObjectEmpty(data)) {
      return { [SRV19APISequence.CONFIRM]: 'JSON cannot be empty' }
    }
  
    try {
      logger.info(`Validating Schema for ${SRV19APISequence.CONFIRM} API`)
      const vs = validateSchema('srv19', SRV19APISequence.CONFIRM, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
  
      setValue('confirm_context', context)
      setValue('confirm_message', message)
  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${SRV19APISequence.CONFIRM} API!`)
      } else {
        console.log("Error occurred while checking /API:", err)
        logger.error(`!!Some error occurred while checking /${SRV19APISequence.CONFIRM} API`, err)
      }
    }
    
}
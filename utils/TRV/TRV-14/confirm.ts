import { logger } from "../../../shared/logger"
import { TRV14ApiSequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { setValue } from "../../../shared/dao"

// @ts-ignore
export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
    
    const { message, context }: any = data

  
    if (!data || isObjectEmpty(data)) {
      return { [TRV14ApiSequence.CONFIRM]: 'JSON cannot be empty' }
    }
  
    try {
      logger.info(`Validating Schema for ${TRV14ApiSequence.CONFIRM} API`)
      const vs = validateSchema('trv14', TRV14ApiSequence.CONFIRM, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
  
      setValue('confirm_context', context)
      setValue('confirm_message', message)
  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${TRV14ApiSequence.CONFIRM} API!`)
      } else {
        console.log("Error occurred while checking /API:", err)
        logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.CONFIRM} API`, err)
      }
    }
    
}

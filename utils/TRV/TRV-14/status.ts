
import { TRV14ApiSequence } from "../../../constants"
import { setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"
// @ts-ignore
export const checkStatus = (data: any, msgIdSet: any) => {
    const rsfObj: any = {}
    
        const { message, context }: any = data
    
      
        if (!data || isObjectEmpty(data)) {
          return { [TRV14ApiSequence.STATUS]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${TRV14ApiSequence.STATUS} API`)
          const vs = validateSchema('trv14', TRV14ApiSequence.STATUS, data)
         
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('status_context', context)
          setValue('status_message', message)
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${TRV14ApiSequence.STATUS} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.STATUS} API`, err)
          }
        }
}
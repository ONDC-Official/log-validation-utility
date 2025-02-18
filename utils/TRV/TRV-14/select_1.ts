import { logger } from "../../../shared/logger"
import { TRV14ApiSequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { setValue } from "../../../shared/dao"

// @ts-ignore
export const checkSelect1 = (data: any, msgIdSet: any) => {
     const rsfObj: any = {}
    
        const { message, context }: any = data
       
      
        if (!data || isObjectEmpty(data)) {
          return { [TRV14ApiSequence.SELECT1]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${TRV14ApiSequence.SELECT1} API`)
          const vs = validateSchema('trv14', TRV14ApiSequence.SELECT1, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('select1_context', context)
          setValue('select1_message', message)
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${TRV14ApiSequence.SELECT1} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.SELECT1} API`, err)
          }
        }
}
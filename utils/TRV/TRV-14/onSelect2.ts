import { TRV14ApiSequence } from "../../../constants"
import { setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"

// @ts-ignore
export const checkOnSelect2 = (data: any, msgIdSet: any, version: any) => {
     const rsfObj: any = {}
            
                const { message, context }: any = data
              
              
                if (!data || isObjectEmpty(data)) {
                  return { [TRV14ApiSequence.ON_SELECT2]: 'JSON cannot be empty' }
                }
              
                try {
                  logger.info(`Validating Schema for ${TRV14ApiSequence.ON_SELECT2} API`)
                  const vs = validateSchema('trv14', TRV14ApiSequence.ON_SELECT2, data)
              
                  if (vs != 'error') {
                    Object.assign(rsfObj, vs)
                  }
              
                  setValue('onSelect2_context', context)
                  setValue('onSelect2_message', message)
              
                  return rsfObj
                } catch (err: any) {
                  if (err.code === 'ENOENT') {
                    logger.info(`!!File not found for /${TRV14ApiSequence.ON_SELECT2} API!`)
                  } else {
                    console.log("Error occurred while checking /API:", err)
                    logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.ON_SELECT2} API`, err)
                  }
                }
}
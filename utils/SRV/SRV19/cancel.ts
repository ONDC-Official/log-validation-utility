import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../.."
import { setValue } from "../../../shared/dao"

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
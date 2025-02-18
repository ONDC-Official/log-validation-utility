import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { setValue } from "../../../shared/dao"

// @ts-ignore
export const checkOnInit = (data: any, msgIdSet: any, version: any) => {
     const rsfObj: any = {}
        
            const { message, context }: any = data
            
          
            if (!data || isObjectEmpty(data)) {
              return { [SRV19APISequence.ON_INIT]: 'JSON cannot be empty' }
            }
          
            try {
              logger.info(`Validating Schema for ${SRV19APISequence.ON_INIT} API`)
              const vs = validateSchema('srv19', SRV19APISequence.ON_INIT, data)
          
              if (vs != 'error') {
                Object.assign(rsfObj, vs)
              }
          
              setValue('onInit_context', context)
              setValue('onInit_message', message)
          
              return rsfObj
            } catch (err: any) {
              if (err.code === 'ENOENT') {
                logger.info(`!!File not found for /${SRV19APISequence.ON_INIT} API!`)
              } else {
                console.log("Error occurred while checking /API:", err)
                logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_INIT} API`, err)
              }
            }
}
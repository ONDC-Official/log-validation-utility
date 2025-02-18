import { SRV19APISequence } from "../../../constants"
import { setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"

// @ts-ignore
export const checkOnSelect = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
        
            const { message, context }: any = data
          
          
            if (!data || isObjectEmpty(data)) {
              return { [SRV19APISequence.ON_SELECT]: 'JSON cannot be empty' }
            }
          
            try {
              logger.info(`Validating Schema for ${SRV19APISequence.ON_SELECT} API`)
              const vs = validateSchema('srv19', SRV19APISequence.ON_SELECT, data)
          
              if (vs != 'error') {
                Object.assign(rsfObj, vs)
              }
          
              setValue('onSelect_context', context)
              setValue('onSelect_message', message)
          
              return rsfObj
            } catch (err: any) {
              if (err.code === 'ENOENT') {
                logger.info(`!!File not found for /${SRV19APISequence.ON_SELECT} API!`)
              } else {
                console.log("Error occurred while checking /API:", err)
                logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_SELECT} API`, err)
              }
            }
}
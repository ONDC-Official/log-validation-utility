import { SRV19APISequence } from "../../../constants"
import { setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"
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
  
      setValue('update_context', context)
      setValue('update_message', message)
  
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
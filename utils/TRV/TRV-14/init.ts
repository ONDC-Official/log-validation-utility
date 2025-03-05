import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { setValue } from '../../../shared/dao'

// @ts-ignore
export const checkInit = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.INIT]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.INIT} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.INIT, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('init_context', context)
    setValue('init_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.INIT} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.INIT} API`, err)
    }
  }
}

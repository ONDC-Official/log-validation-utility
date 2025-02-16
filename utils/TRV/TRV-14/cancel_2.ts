import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../..'
import { setValue } from '../../../shared/dao'

// @ts-ignore
export const checkCancel2 = (data: any, msgIdSet: any, version: any) => {
  const rsfObj: any = {}

  const { message, context }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.CANCEL]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.CANCEL} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.CANCEL, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('cancel_context', context)
    setValue('cancel_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.CANCEL} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.CANCEL} API`, err)
    }
  }
}

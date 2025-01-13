import { RSF_v2_apiSequence } from '../../../constants/index'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'

const checkRsfRecon = (data: any) => {
  const rsfObj: any = {}
  const { message, context }: any = data
  console.log("message",message)

  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.RECON]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${RSF_v2_apiSequence.RECON} API`)
    const vs = validateSchema('rsf', RSF_v2_apiSequence.RECON, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    setValue('recon_context', context)
    setValue('recon_message', message)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${RSF_v2_apiSequence.RECON} API!`)
    } else {
      console.log("Error occurred while checking /API:", err)
      logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.RECON} API`, err)
    }
  }
}

export default checkRsfRecon

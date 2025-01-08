import { RSF_v2_apiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
import constants from '../../../constants/index'
import { compareContexts } from '../../RSF/rsfHelpers'

const checkRsfOnSettle = (data: any) => {
  const rsfObj: any = {}
  const setlMsg: any = getValue('settle_message')
  const {context, message} = data
  console.log("msg",message)
  try {
  
  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.ON_SETTLE]: 'JSON cannot be empty' }
  }

  const setlContext: any = getValue('settle_context')

    console.log("setlContext",setlContext)
    console.log("setlMsg",setlMsg)

    try {
      logger.info(`Validating Schema for ${RSF_v2_apiSequence.ON_SETTLE} API`)
      const vs = validateSchema('rsf', RSF_v2_apiSequence.ON_SETTLE, data)
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${RSF_v2_apiSequence.ON_SETTLE} API!`)
      } 
    }

    try{
    const contextValidationErrors = compareContexts(setlContext, context)
    if (contextValidationErrors != 'error') {
      Object.assign(rsfObj, contextValidationErrors)
    }

    }catch(error: any){
      logger.error(`!!Error while comparing context for /${constants.SETTLE} and /${constants.ON_SETTLE} api, ${error.stack}`)
    }



  }
  catch (err: any) {
    logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.ON_SETTLE} API`, err)
  }
}

export default checkRsfOnSettle
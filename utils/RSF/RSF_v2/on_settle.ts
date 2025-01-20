import { RSF_v2_apiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
import constants from '../../../constants/index'
import { compareContexts } from '../../RSF/rsfHelpers'
import { RSF_v2_Errors } from '../../../constants/RSFv2ErrorCodes'

const checkRsfOnSettle = (data: any) => {
  const rsfObj: any = {}
  const {context, message} = data
  try {
  
  if (!data || isObjectEmpty(data)) {
    return { [RSF_v2_apiSequence.ON_SETTLE]: 'JSON cannot be empty' }
  }

  const setlContext: any = getValue('settle_context')

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

    try {
      logger.info(`Validating error codes in settlement orders`)
      message?.settlement?.orders?.forEach((order: any, index: number) => {
        ['self', 'provider', 'inter_participant'].forEach(field => {
          if (order[field]?.error?.code) {
            const errorCode = order[field].error.code
            if (typeof errorCode === 'string' && !(errorCode in RSF_v2_Errors)) {
              rsfObj[`orders_${index}_${field}_error`] = `Invalid error code ${errorCode}. Must match RSFv2ErrorCodes.`
            }
          }
        })
      })
    } catch (error: any) {
      logger.error(`Error while validating error codes in settlement orders: ${error.stack}`)
    }


  }
  catch (err: any) {
    logger.error(`!!Some error occurred while checking /${RSF_v2_apiSequence.ON_SETTLE} API`, err)
  }
}

export default checkRsfOnSettle
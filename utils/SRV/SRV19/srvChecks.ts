import _ from "lodash"
import { getValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { checkIdAndUri, checkSRVContext } from "../../../utils"

export const validateContext = (context: any, msgIdSet: any, pastCall: any, curentCall: any) => {
  const errorObj: any = {}

  const contextRes: any = checkSRVContext(context, curentCall)

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const prevContext: any = getValue(`${pastCall}_context`)
 

  msgIdSet.add(context.message_id)

  if (!context.location || !context.location.city || !context.location.country) {
    errorObj['location'] = 'context/location/city and context/location/country are required'
  }

  try {
    logger.info(`Comparing BAP and BPP in /${curentCall}`)
   

    const bppValidationResult = checkIdAndUri(context?.bpp_id, context?.bpp_uri, 'bpp')
    const bapValidationResult = checkIdAndUri(context?.bap_id, context?.bap_uri, 'bap')

    if (context.action != 'cancel' && bppValidationResult !== null) {
      errorObj.bpp = bppValidationResult
    }

    if (bapValidationResult !== null) {
      errorObj.bap = bapValidationResult
    }

    if (prevContext) {
      if (pastCall !== 'search' && pastCall !== 'on_status') {
        if (!_.isEqual(prevContext.bpp_id, context.bpp_id)) {
          console.log('PastCall:😀', pastCall)
        
          errorObj.bppIdContextMismatch = `BPP Id mismatch in /${pastCall} and /${curentCall}`
        }

        if (!_.isEqual(prevContext.bpp_uri, context.bpp_uri)) {
          errorObj.bppUriContextMismatch = `BPP URL mismatch in /${pastCall} and /${curentCall}`
        }
      }

      if (!_.isEqual(prevContext.bap_id, context.bap_id)) {
        errorObj.bapIdContextMismatch = `BAP Id mismatch in /${pastCall} and /${curentCall}`
      }

      if (pastCall !== 'search' && pastCall !== 'on_status' && !_.isEqual(prevContext.bap_uri, context.bap_uri)) {
        errorObj.bapUriContextMismatch = `BAP URL mismatch in /${pastCall} and /${curentCall}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while comparing BAP and BPP Ids in /${curentCall}, ${error.stack}`)
  }

  if (prevContext) {
    try {
      logger.info(`Comparing city of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.city, context.location.city)) {
       
        errorObj.city = `City code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing city in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing country of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.location.country, context.location.country)) {
        errorObj.country = `Country code mismatch in /${pastCall} and /${curentCall}`
      }
    } catch (error: any) {
      logger.error(`!!Error while comparing country in /${pastCall} and /${curentCall}, ${error.stack}`)
    }

    try {
      logger.info(`Comparing transaction Ids of /${pastCall} and /${curentCall}`)
      if (!_.isEqual(prevContext.transaction_id, context.transaction_id)) {
        errorObj.transaction_id = `Transaction Id for /${pastCall} and /${curentCall} api should be same`
      }
    } catch (error: any) {
      logger.info(`Error while comparing transaction ids for /${pastCall} and /${curentCall} api, ${error.stack}`)
    }

   

    try {
      logger.info(`Comparing timestamp of /${pastCall} and /${curentCall}`);
      
      const prevTimestamp = prevContext.timestamp;
   
    
      if (!_.gte(context.timestamp, prevTimestamp)) {
        
        errorObj.tmpstmp = `Timestamp for /${curentCall} API should be greater than timestamp of /${pastCall} API`;
      }
    
     
    } catch (error: any) {
      logger.error(`!!Error while comparing timestamp for /${pastCall} and /${curentCall}, ${error.stack}`);
    }
    
  }

  if (_.isEmpty(errorObj)) {
    const result = { valid: true, SUCCESS: 'Context Valid' }
    return result
  } else {
    const result = { valid: false, ERRORS: errorObj }
    return result
  }
}

export function isSubset(sub: any[], main: any[]): boolean {
  const mainSet = new Set(main);
  return sub.every(id => mainSet.has(id));
}

export function isJsonASubsequence(subset: any, superset: any): boolean {
  if (typeof subset !== 'object' || typeof superset !== 'object' || subset === null) {
      return subset === superset;
  }
  
  if (Array.isArray(subset)) {
      if (!Array.isArray(superset)) return false;
      return subset.every(item => superset.some(superItem => isJsonASubsequence(item, superItem)));
  }
  
  return Object.keys(subset).every(key => key in superset && isJsonASubsequence(subset[key], superset[key]));
}
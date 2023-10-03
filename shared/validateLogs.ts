import _ from 'lodash'
import { checkSearchFullCatalogRefresh } from '../utils/Retail/RET11/searchFullCatalogRefresh'
import { dropDB } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence } from '../constants'
import { checkSearchIncremental } from '../utils/Retail/RET11/searchIncremental'
import { validateSchema, isObjectEmpty } from '../utils'
import { checkOnsearchFullCatalogRefresh } from '../utils/Retail/RET11/onSearch'

export const validateLogs = (data: any, domain: string) => {
  const msgIdSet = new Set()
  let logReport: any = {}

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  try {
    if (domain === 'ONDC:RET11') {
      if (data[ApiSequence.SEARCH]) {
        const searchFullCatalogRefreshResp = checkSearchFullCatalogRefresh(data[ApiSequence.SEARCH], msgIdSet)
        if (!_.isEmpty(searchFullCatalogRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.SEARCH]: searchFullCatalogRefreshResp }
        }
      }

      if (data[ApiSequence.INC_SEARCH]) {
        const searchIncrementalRefreshResp = checkSearchIncremental(data[ApiSequence.INC_SEARCH], msgIdSet)

        if (!_.isEmpty(searchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.INC_SEARCH]: searchIncrementalRefreshResp }
        }
      }

      if (data[ApiSequence.ON_SEARCH]) {
        const searchIncrementalRefreshResp = checkOnsearchFullCatalogRefresh(data[ApiSequence.ON_SEARCH], msgIdSet)

        if (!_.isEmpty(searchIncrementalRefreshResp)) {
          logReport = { ...logReport, [ApiSequence.ON_SEARCH]: searchIncrementalRefreshResp }
        }
      }

      logger.info(logReport, 'Report Generated Successfully!!')
      return logReport
    } else {
      logger.warn('Invalid Domain!! Please Enter a valid domain')
      return 'Invalid Domain!! Please Enter a valid domain'
    }
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

export const validateActionSchema = (data: any, domain: string, action: string) => {
  const errorObj: any = {}

  switch (domain) {
    case 'ONDC:RET11': {
      const schemaError = validateSchema('RET11', action, data)
      if (schemaError !== 'error') Object.assign(errorObj, schemaError)
      return isObjectEmpty(errorObj) ? false : errorObj
    }

    default:
      return 'Invalid Domain!! Please Enter a valid domain'
  }
}

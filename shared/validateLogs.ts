import _ from 'lodash'
import { checkSearchFullCatalogRefresh } from '../utils/Retail/RET11/searchFullCatalogRefresh'
import { dropDB } from '../shared/dao'
import { logger } from './logger'
import { ApiSequence } from '../constants'
import { checkSearchIncremental } from '../utils/Retail/RET11/searchIncremental'

export const validateLogs = (data: any, domain: string) => {
  const msgIdSet = new Set()
  let logReport: any = {}

  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (domain === 'ONDC:RET11') {
    const searchFullCatalogRefreshResp = checkSearchFullCatalogRefresh(data[ApiSequence.SEARCH], msgIdSet)

    const searchIncrementalRefreshResp = checkSearchIncremental(data[ApiSequence.INC_SEARCH], msgIdSet)

    if (!_.isEmpty(searchFullCatalogRefreshResp)) {
      logReport = { ...logReport, [ApiSequence.SEARCH]: searchFullCatalogRefreshResp }
    }

    if (!_.isEmpty(searchIncrementalRefreshResp)) {
      logReport = { ...logReport, [ApiSequence.INC_SEARCH]: searchIncrementalRefreshResp }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } else {
    logger.warn('Invalid Domain!! Please Enter a valid domain')
    return 'Invalid Domain!! Please Enter a valid domain'
  }
}

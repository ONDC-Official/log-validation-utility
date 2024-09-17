import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { FIS14ApiSequence, fis14Flows } from '../../constants'
import { checkSearch } from 'utils/FIS/FIS14/search'

export function validateLogsForFIS14(data: any, flow: string, version: string) {
  const msgIdSet = new Set()
  let logReport: any = {}
  try {
    dropDB()
  } catch (error) {
    logger.error('!!Error while removing LMDB', error)
  }

  if (!_.isEqual(version, '2.0.0')) {
    logReport = { ...logReport, version: `Invalid version ${version}` }
  }

  if (!(flow in fis14Flows)) {
    logReport = { ...logReport, version: `Invalid flow ${flow}` }
  }

  try {
    if (data[FIS14ApiSequence.SEARCH]) {
      const searchResp = checkSearch(data[FIS14ApiSequence.SEARCH], msgIdSet, flow, FIS14ApiSequence.SEARCH)
      if (!_.isEmpty(searchResp)) {
        logReport = { ...logReport, [FIS14ApiSequence.SEARCH]: searchResp }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

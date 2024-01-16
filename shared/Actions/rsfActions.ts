import _ from 'lodash'
import { dropDB } from '../dao'
import { logger } from '../logger'
import { rsfSequence } from '../../constants'
import { collectorRecon } from '../../utils/rsf/collectorRecon'
import { onCollectorRecon } from '../../utils/rsf/onCollectorRecon'
import { settle } from '../../utils/rsf/settle'
import { onSettle } from '../../utils/rsf/onSettle'
import { receiverRecon } from '../../utils/rsf/receiverRecon'
import { onReceiverRecon } from '../../utils/rsf/onReceiverRecon'

export function validateLogsForRsf(data: any, domain: string, flow: string, version: string) {
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

  console.log('domain', domain, flow)

  try {
    //change the order if required
    if (data[rsfSequence.COLLECTOR_RECON]) {
      const res = collectorRecon(data[rsfSequence.COLLECTOR_RECON], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.COLLECTOR_RECON]: res }
      }
    }

    if (data[rsfSequence.ON_COLLECTOR_RECON]) {
      const res = onCollectorRecon(data[rsfSequence.ON_COLLECTOR_RECON], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.ON_COLLECTOR_RECON]: res }
      }
    }

    if (data[rsfSequence.SETTLE]) {
      const res = settle(data[rsfSequence.SETTLE], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.SETTLE]: res }
      }
    }

    if (data[rsfSequence.ON_SETTLE]) {
      const res = onSettle(data[rsfSequence.ON_SETTLE], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.ON_SETTLE]: res }
      }
    }

    if (data[rsfSequence.RECEIVER_RECON]) {
      const res = receiverRecon(data[rsfSequence.RECEIVER_RECON], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.RECEIVER_RECON]: res }
      }
    }

    if (data[rsfSequence.ON_RECEIVER_RECON]) {
      const res = onReceiverRecon(data[rsfSequence.ON_RECEIVER_RECON], msgIdSet)
      if (!_.isEmpty(res)) {
        logReport = { ...logReport, [rsfSequence.ON_RECEIVER_RECON]: res }
      }
    }

    logger.info(logReport, 'Report Generated Successfully!!')
    return logReport
  } catch (error: any) {
    logger.error(error.message)
    return error.message
  }
}

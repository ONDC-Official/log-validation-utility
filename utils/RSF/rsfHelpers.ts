import { logger } from '../../shared/logger'
import _ from 'lodash'
import { getValue } from '../../shared/dao'

/**
 * @description Verify all relevant timestamps in the payload of rsf receiver_recon
 * @param {string} endpoint - The API endpoint being checked.
 * @param {string} contextTimeStamp - The context timestamp.
 * @param {string} UpdatedAt - The update timestamp.
 * @param {string} CreatedAt - The create timestamp.
 * @param {string} settlementTimestamp - The settlement timestamp.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function CompareTimeStamps({
  contextTimeStamp,
  CreatedAt,
  UpdatedAt,
  issueReportObj,
}: {
  CreatedAt: string
  contextTimeStamp: string
  UpdatedAt: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking time of creation and updation for rsf`)

    if (_.lte(contextTimeStamp, CreatedAt)) {
      issueReportObj.respTime = `context timestamp should be greater than created_at`
    }
    if (_.isEqual(contextTimeStamp, UpdatedAt)) {
      issueReportObj.respTime = `context timestamp should be greater than updated_at`
    }
  } catch (error) {
    logger.error(`Error occurred while checking time of creation and updation for rsf`)
  }
}
/**
 * @description check if all Collector Ids are same
 * @param {string} collectorId - The collector id.
 * @param {string} receiver_app_id - The receiver id.
 * @param {string} endpoint - The API endpoint being checked.
 * @param {Object} issueReportObj - An object to collect and report discrepancies.
 */
export function checkCollectorAndReciverIdSettle({
  collectorId,
  receiver_app_id,
  endpoint,
  issueReportObj,
}: {
  collectorId: string
  receiver_app_id: string
  endpoint: string
  issueReportObj: any
}) {
  try {
    logger.info(`Checking collector id for rsf`)

    if (collectorId !== getValue('rsfColAppId')) {
      issueReportObj.collectorId = `Collector Id should be same in all the APIs`
    }

    if (receiver_app_id !== getValue('rsfRecAppId')) {
      issueReportObj.receiverId = `Receiver Id should be same in all the APIs`
    }
  } catch (error) {
    logger.error(`Error occurred while checking collector id for rsf ${endpoint}`)
  }
}

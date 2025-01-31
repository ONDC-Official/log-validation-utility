import { logger } from '../../shared/logger'
import _ from 'lodash'

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

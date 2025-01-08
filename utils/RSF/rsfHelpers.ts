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

export const compareContexts = (settleContext: any, onSettleContext: any) => {
  const errorObj: any = {}
  
  const fieldsToCompare = [
    'bpp_id',
    'bpp_uri',
    'bap_id', 
    'bap_uri',
    'transaction_id',
    'message_id'
  ]

  try {
    fieldsToCompare.forEach(field => {
      if (!_.isEqual(settleContext[field], onSettleContext[field])) {
        errorObj[`context_${field}`] = `${field} mismatch between settle and on_settle context: ${settleContext[field]} != ${onSettleContext[field]}`
      }
    })

    const settleTimestamp = new Date(settleContext.timestamp).getTime()
    const onSettleTimestamp = new Date(onSettleContext.timestamp).getTime()
    
    if (!_.gte(settleTimestamp, onSettleTimestamp)) {
      errorObj.timestamp = `settle timestamp (${settleContext.timestamp}) should be greater than or equal to on_settle timestamp (${onSettleContext.timestamp})`
    }

    logger.info('Context comparison completed between settle and on_settle')
    return Object.keys(errorObj).length > 0 ? errorObj : {}

  } catch (error: any) {
    logger.error('Error while comparing settle and on_settle contexts:', error)
    return { error: error.message }
  }
}

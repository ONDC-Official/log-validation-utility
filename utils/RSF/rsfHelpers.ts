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
        errorObj[`context_${field}`] = `${field} mismatch between action and on_action context: ${settleContext[field]} != ${onSettleContext[field]}`
      }
    })

    const settleTimestamp = new Date(settleContext.timestamp).getTime()
    const onSettleTimestamp = new Date(onSettleContext.timestamp).getTime()
    
    if (!_.lt(settleTimestamp, onSettleTimestamp)) {
      errorObj.timestamp = `action call timestamp (${settleContext.timestamp}) should be less than on_action call (${onSettleContext.timestamp})`
    }

    logger.info('Context comparison completed between action and on_action')
    return Object.keys(errorObj).length > 0 ? errorObj : {}

  } catch (error: any) {
    logger.error('Error while comparing action and on_action contexts:', error)
    return { error: error.message }
  }
}

export const checkDuplicateOrderIds = (orders: any[]): string | null => {
  const orderIds = new Set()
  
  for (const order of orders) {
    if (orderIds.has(order.id)) {
      return `Duplicate order ID found: ${order.id}`
    }
    orderIds.add(order.id)
  }
  
  return null

}

export const validateSettlementAmounts = (order: any) => {
  const orderAmount = parseFloat(order.amount.value)
  
  const totalSettlementAmount = order.settlements.reduce((sum: number, settlement: any) => {
    return sum + parseFloat(settlement.amount.value)
  }, 0)

  return Math.abs(orderAmount - totalSettlementAmount) < 0.01 
}
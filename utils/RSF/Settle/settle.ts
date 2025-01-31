import constants, { RSFapiSequence } from '../../../constants/index'
import _ from 'lodash'
import { isObjectEmpty } from '../../index'
import { validateSchema } from '../../index'
import { logger } from '../../../shared/logger'
import { CompareTimeStamps } from '../rsfHelpers'

const checksSettleData = (data: any) => {
    const rsfObj: any = {}

    // Check if the data object is empty or undefined
    if (!data || isObjectEmpty(data)) {
        return { [RSFapiSequence.SETTLE_COLLECTOR]: 'JSON cannot be empty' }
    }

    try {
        logger.info(`Validating Schema for ${constants.SETTLE_COLLECTOR} API`)
        const vs = validateSchema('rsf', constants.SETTLE_COLLECTOR, data)

        if (vs !== 'error') {
            Object.assign(rsfObj, vs)
        } else {
            return { schemaError: 'Schema validation failed for /settle' }
        }

        const { message, context } = data

        // Check if message or context is missing or empty
        if (!message || isObjectEmpty(message) || !context || isObjectEmpty(context)) {
            return { missingFields: '/context or /message is missing or empty' }
        }

        // Check if order exists in the message
        if (!message.order || isObjectEmpty(message.order)) {
            return { missingFields: '/message/order is missing or empty' }
        }

        // Validate the timestamps of the order and context
        if (message.order && message.order.settlements) {
            message.order.settlements.forEach((settlement: any) => {
                CompareTimeStamps({
                    CreatedAt: settlement.created_at,
                    contextTimeStamp: context.timestamp,
                    UpdatedAt: settlement.updated_at,
                    issueReportObj: rsfObj,
                })
            })
        }

        // Validate the presence of required fields in the order
        const { id, amount, settlements } = message.order
        if (!id || _.isEmpty(id)) {
            return { missingOrderField: '/message/order/id is missing or empty' }
        }
        if (!amount || isObjectEmpty(amount)) {
            return { missingOrderField: '/message/order/amount is missing or empty' }
        }
        if (!settlements || !Array.isArray(settlements) || settlements.length === 0) {
            return { missingOrderField: '/message/order/settlements is missing or empty' }
        }

        // Additional checks can be added here

        logger.info('SETTLE data passed all checks')
        return rsfObj
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${constants.SETTLE_COLLECTOR} API!`)
        } else {
            logger.error(`!!Some error occurred while checking /${constants.SETTLE_COLLECTOR} API`, err)
        }
    }
}

export default checksSettleData

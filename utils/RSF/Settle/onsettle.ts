import constants, { RSFapiSequence } from '../../../constants/index'
import _ from 'lodash';
import { isObjectEmpty } from '../../index';
import { validateSchema } from '../../index';
import { logger } from '../../../shared/logger';
import { CompareTimeStamps } from  '../rsfHelpers';

const checksonSettleData = (data: any) => {
  const rsfObj: any = {};

  // Check if data is empty or undefined
  if (!data || isObjectEmpty(data)) {
    return { [RSFapiSequence.ON_SETTLE_COLLECTOR]: 'JSON cannot be empty' };
  }

  try {
    logger.info(`Validating Schema for ${constants.ON_SETTLE_COLLECTOR} API`);

    // Perform schema validation
    const validationResult = validateSchema('rsf', constants.ON_SETTLE_COLLECTOR, data);
    if (validationResult !== 'error') {
      Object.assign(rsfObj, validationResult);
    }

    const { message, context } = data;

    // Check if essential fields are present
    if (!message || !context || !message.order) {
      return { missingFields: '/context, /message, or /message/order is missing or empty' };
    }

    // Validate presence of mandatory fields within message.order
    if (!message.order.id) {
      rsfObj.missingOrderId = 'Order ID is missing';
    }

    // Perform timestamp comparison if required fields are available
    if (message.order.created_at && context.timestamp) {
      CompareTimeStamps({
        CreatedAt: message.order.created_at,
        contextTimeStamp: context.timestamp,
        UpdatedAt: message.order.updated_at,
        issueReportObj: rsfObj,
      });
    }

    // Validate nested items within order, if present
    if (Array.isArray(message.order.items)) {
      message.order.items.forEach((item: any, index: number) => {
        if (!item.id) {
          rsfObj[`missingItemId_${index}`] = `Item at index ${index} is missing an ID`;
        }
        if (!item.quantity || item.quantity <= 0) {
          rsfObj[`invalidQuantity_${index}`] = `Quantity for item at index ${index} is invalid or missing`;
        }
      });
    } else {
      rsfObj.missingOrderItems = 'Order items array is missing or empty';
    }

    // Further nested validations for settlements, if applicable
    if (Array.isArray(message.order.settlements)) {
      message.order.settlements.forEach((settlement: any, index: number) => {
        if (!settlement.id) {
          rsfObj[`missingSettlementId_${index}`] = `Settlement at index ${index} is missing an ID`;
        }
        if (!settlement.amount || isNaN(settlement.amount.value)) {
          rsfObj[`invalidSettlementAmount_${index}`] = `Settlement amount at index ${index} is invalid`;
        }
      });
    } else {
      rsfObj.missingSettlements = 'Settlements array is missing or empty';
    }

    return rsfObj;

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.ON_SETTLE_COLLECTOR} API!`);
    } else {
      logger.error(`!!Some error occurred while checking /${constants.ON_SETTLE_COLLECTOR} API`, error);
    }
  }
};

export default checksonSettleData;

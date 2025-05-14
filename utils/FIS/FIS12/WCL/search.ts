import { logger } from '../../../../shared/logger';
import constants from '../../../../constants';
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../../utils';
import { validateTransactionIdConsistency, validateMessageIdPair } from './commonValidations';

export const checksearchWCL = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {};

  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SEARCH]: 'JSON cannot be empty' };
    }

    console.log('flow', flow, sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty';
      return Object.keys(errorObj).length > 0 && errorObj;
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.SEARCH, data);
    const contextRes: any = checkFISContext(data.context, constants.SEARCH);
    
    // Add transaction ID consistency check
    const transactionIdConsistency = validateTransactionIdConsistency(data.context);
    Object.assign(errorObj, transactionIdConsistency);
    
    // Add message ID pair validation
    const messageIdPair = validateMessageIdPair(data.context, constants.SEARCH, false);
    Object.assign(errorObj, messageIdPair);
    
    // Save message ID to check for uniqueness
    msgIdSet.add(data.context.message_id);

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS);
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation);
    }

    const { context, message } = data;
    const intent = message.intent;

    // Validate context
    if (context.domain !== 'ONDC:FIS12') {
      errorObj['context.domain'] = 'Domain must be ONDC:FIS12';
    }

    if (context.action !== 'search') {
      errorObj['context.action'] = 'Action must be search';
    }

    // Validate intent
    if (!intent.category?.descriptor?.code) {
      errorObj['intent.category'] = 'Category descriptor code is required';
    } else if (intent.category.descriptor.code !== 'WORKING_CAPITAL_LOAN') {
      errorObj['intent.category.code'] = 'Category code must be WORKING_CAPITAL_LOAN';
    }

    // Validate provider
    if (intent.provider) {
      if (!intent.provider.descriptor?.name) {
        errorObj['intent.provider.descriptor'] = 'Provider descriptor name is required';
      }
    }

    // Validate fulfillment
    if (intent.fulfillment) {
      if (!intent.fulfillment.start?.location?.gps) {
        errorObj['intent.fulfillment.start.location'] = 'Fulfillment start location GPS is required';
      }
      if (!intent.fulfillment.end?.location?.gps) {
        errorObj['intent.fulfillment.end.location'] = 'Fulfillment end location GPS is required';
      }
    }

    // Validate tags
    if (!intent.tags || !Array.isArray(intent.tags)) {
      errorObj['intent.tags'] = 'Intent tags array is required';
    } else {
      const loanAmountTag = intent.tags.find((tag: any) => tag.descriptor?.code === 'LOAN_AMOUNT');
      if (!loanAmountTag || !loanAmountTag.list) {
        errorObj['intent.tags.LOAN_AMOUNT'] = 'LOAN_AMOUNT tag with list is required';
      }

      const loanTenureTag = intent.tags.find((tag: any) => tag.descriptor?.code === 'LOAN_TENURE');
      if (!loanTenureTag || !loanTenureTag.list) {
        errorObj['intent.tags.LOAN_TENURE'] = 'LOAN_TENURE tag with list is required';
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj;
  } catch (error: any) {
    logger.error(`Error in checkSearchWCL: ${error.message}`);
    return { error: error.message };
  }
}
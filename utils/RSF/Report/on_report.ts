import constants, { RSFapiSequence } from '../../../constants/index';
import _ from 'lodash';
import { isObjectEmpty, validateSchema } from '../../index';
import { logger } from '../../../shared/logger';
import { CompareTimeStamps } from '../rsfHelpers';

const checksOnReportData = (data: any) => {
    const rsfObj: any = {};

    // Check if the data object is empty or undefined
    if (!data || isObjectEmpty(data)) {
        return { [RSFapiSequence.ON_REPORT]: 'JSON cannot be empty' };
    }

    try {
        logger.info(`Validating Schema for ${constants.ON_REPORT} API`);
        const vs = validateSchema('rsf', constants.ON_REPORT, data);

        if (vs !== 'error') {
            Object.assign(rsfObj, vs);
        } else {
            return { schemaError: 'Schema validation failed for /on_report' };
        }

        const { message, context } = data;

        // Check if message or context is missing or empty
        if (!message || isObjectEmpty(message) || !context || isObjectEmpty(context)) {
            return { missingFields: '/context or /message is missing or empty' };
        }

        // Check if required fields in context are missing
        const requiredContextFields = [
            'domain', 'action', 'country', 'core_version',
            'bap_id', 'bap_uri', 'bpp_id', 'bpp_uri',
            'transaction_id', 'message_id', 'timestamp', 'ttl', 'city'
        ];
        for (const field of requiredContextFields) {
            if (!context[field] || _.isEmpty(context[field])) {
                return { missingContextField: `/context/${field} is missing or empty` };
            }
        }

        // Validate the message fields
        const { ref_transaction_id, ref_message_id, report_type, details } = message;

        if (!ref_transaction_id || _.isEmpty(ref_transaction_id)) {
            return { missingMessageField: '/message/ref_transaction_id is missing or empty' };
        }
        if (!ref_message_id || _.isEmpty(ref_message_id)) {
            return { missingMessageField: '/message/ref_message_id is missing or empty' };
        }

        // Check conditional logic for report_type and details
        if (report_type === 'NIL') {
            if (!details || details.note !== 'No details available') {
                return { reportTypeError: 'For NIL report_type, /message/details/note should be "No details available"' };
            }
        } else if (report_type === 'NP-NP' || report_type === 'MISC') {
            if (!details || _.isEmpty(details.description) || _.isEmpty(details.source)) {
                return { reportTypeError: `For ${report_type} report_type, /message/details/description and /message/details/source are required` };
            }
        }

        // Additional timestamp comparison if needed
        // Validate the timestamps of the report and context
        if (message.details && message.details.timestamp) {
            CompareTimeStamps({
                CreatedAt: message.details.timestamp,
                contextTimeStamp: context.timestamp,
                UpdatedAt: message.details.updated_at || null,  // UpdatedAt if applicable, otherwise set to null
                issueReportObj: rsfObj,
            });
        }


        logger.info('ON_REPORT data passed all checks');
        return rsfObj;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${constants.ON_REPORT} API!`);
        } else {
            logger.error(`!!Some error occurred while checking /${constants.ON_REPORT} API`, err);
        }
    }
};

export default checksOnReportData;

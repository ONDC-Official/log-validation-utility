import _ from 'lodash';
import { setValue, getValue } from '../../../shared/dao';
import { checkContext, isObjectEmpty } from '../../index';
import constants, { IGM2Sequence } from '../../../constants/index';
import { validateSchema } from '../../index';
import { logger } from '../../../shared/logger';
import {
  checkCreatedAtInAll,
  checkDomainInAll,
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareUpdatedAtAndContextTimeStamp,
} from '../igmHelpers';

const checkOnIssue = (data: any, type: string) => {
  const onissueObj: any = {};
  let res: any = {};
  console.log(type);
  try {
    const on_issue: any = data;

    if (!data || isObjectEmpty(data)) {
      return { [IGM2Sequence.ON_ISSUE_3]: 'JSON cannot be empty' };
    }

    try {
      logger.info(`Validating Schema for ${constants.ON_ISSUE_3} API`);
      const vs = validateSchema('igm', constants.ON_ISSUE_3, on_issue);
      if (vs !== 'error') {
        Object.assign(onissueObj, vs);
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while performing schema validation for /${constants.ON_ISSUE_3}, ${error.stack}`);
    }

    logger.info(`Checking context for ${constants.ON_ISSUE_3} API`);
    try {
      res = checkContext(on_issue.context, constants.ON_ISSUE_3);
      if (!res.valid) {
        Object.assign(onissueObj, res.ERRORS);
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.ON_ISSUE_3} context, ${error.stack}`);
    }

    try {
      logger.info(`Comparing transaction ID of /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`);
      if (!_.isEqual(getValue('igmTxnId'), on_issue.context.transaction_id)) {
        onissueObj.igmTxnId = `Transaction ID mismatch in /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`;
      }
    } catch (error: any) {
      logger.error(`Error while comparing transaction ID in /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}, ${error.stack}`);
    }

    try {
      logger.info(`Comparing MESSAGE ID of /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`);
      if (!_.isEqual(getValue('igmIssueMsgId'), on_issue.context.message_id)) {
        onissueObj.igmIssueMsgId = `Message ID mismatch in /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`;
      }
    } catch (error: any) {
      logger.error(`Error while comparing Message ID in /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}, ${error.stack}`);
    }

    try {
      logger.info(`Comparing Domain of /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`);
      if (!_.isEqual(getValue('igmDomain'), on_issue.context.domain)) {
        onissueObj.igmDomain = `Domain for /${constants.ISSUE_3} API should be equal to /${constants.ON_ISSUE_3} API`;
      }
    } catch (error: any) {
      logger.error(`Error while comparing Domain for /${constants.ISSUE_3} and /${constants.ON_ISSUE_3} API, ${error.stack}`);
    }

    try {
      logger.info(`Comparing core version of /${constants.ISSUE_3} and /${constants.ON_ISSUE_3}`);
      setValue('core_version', on_issue.context.core_version);
    } catch (error: any) {
      logger.error(`Error while comparing core version for /${constants.ISSUE_3} and /${constants.ON_ISSUE_3} API, ${error.stack}`);
    }

    try {
      logger.info(`Phone Number Check for /${constants.ON_ISSUE_3}`);
      const phoneNumbers = on_issue.message.actors.map((actor: any) => actor.info.contact.phone);
      phoneNumbers.forEach((phone: string) => {
        if (!_.inRange(Number(phone), 1000000000, 99999999999)) {
          onissueObj.Phn = `Phone Number for /${constants.ON_ISSUE_3} API is not in the valid range`;
        }
      });
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.ON_ISSUE_3} API, ${error.stack}`);
    }

    setValue('igmCreatedAt', on_issue.message.issue.created_at);

    const respondent_actions = on_issue.message.issue.actions;

    checkOrganizationNameandDomain({
      endpoint: constants.ON_ISSUE_3,
      actionPayload: respondent_actions,
      contextSubscriberId: on_issue.context.bpp_id,
      contextDomain: on_issue.context.domain,
      issueReportObj: onissueObj,
      IdType: 'BPP',
    });

    compareUpdatedAtAndContextTimeStamp({
      endpoint: constants.ON_ISSUE_3,
      actionPayload: respondent_actions,
      messageUpdatedAt: on_issue.message.issue.updated_at,
      issueReportObj: onissueObj,
    });

    checkCreatedAtInAll({
      endpoint: constants.ON_ISSUE_3,
      created_at: on_issue.message.issue.created_at,
      issueReportObj: onissueObj,
    });

    checkDomainInAll({
      endpoint: constants.ON_ISSUE_3,
      domain: on_issue.context.domain,
      issueReportObj: onissueObj,
    });

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.ON_ISSUE_3,
      contextTimeStamp: on_issue.context.timestamp,
      issue_updated_at: on_issue.message.issue.updated_at,
      issueReportObj: onissueObj,
    });

    setValue('onissueObj', onissueObj);

    return onissueObj;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.ON_ISSUE_3} API!`);
    } else {
      logger.error(`!!Some error occurred while checking /${constants.ON_ISSUE_3} API`, err);
    }
  }
};

export default checkOnIssue;

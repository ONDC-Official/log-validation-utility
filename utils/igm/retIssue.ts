import _ from 'lodash'
import { setValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import issue_subcategory from '../issue_subcategories'
// import messages from '../../utils/messages_constants'
import {
  checkOrganizationNameandDomain,
  compareContextTimeStampAndUpdatedAt,
  compareCreatedAtAndUpdationTime,
  compareUpdatedAtAndContextTimeStamp,
} from './igmHelpers'

const checkIssue = (data: any) => {
  const issueObj: any = {}
  let res: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.RET_ISSUE]: 'Json cannot be empty' }
  }

  try {
    const issue: any = data

    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE} API`)
      const vs = validateSchema('igm', constants.RET_ISSUE, issue)
      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(`!!Error occurred while performing schema validation for /${constants.RET_ISSUE}, ${error.stack}`)
    }
    try {
      logger.info(`Checking context for ${constants.RET_ISSUE} API`) //checking context
      res = checkContext(issue.context, constants.RET_ISSUE)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ISSUE} context, ${error.stack}`)
    }

    try {
      logger.info(
        `Storing igmTxnID igmTmpstmp igmType igmCoreVersion igmDomain igmIssueMesgId in /${constants.RET_ISSUE}`,
      ) //storing IgmTxnId IgmTmpstmp igmType igmCoreVersion igmDomain
      setValue('igmTxnId', issue.context.transaction_id)
      setValue('igmTmpstmp', issue.context.timestamp)
      setValue('igmCoreVersion', issue.context.core_version)
      setValue('igmDomain', issue.context.domain)
      setValue('igmIssueMsgId', issue.context.message_id)
      setValue('seller_bpp_id', issue.context.bpp_id)
      setValue('seller_bpp_uri', issue.context.bpp_uri)

      if (issue.message) {
        setValue('igmIssueType', issue.message.issue.issue_type)
      }
      // msgIdSet.add(issue.context.message_id);
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} context, ${error.stack}`)
    }

    try {
      logger.info(`Validating category and subcategory in /${constants.RET_ISSUE}`)

      if (
        (issue.message.category === 'ITEM' &&
          !issue_subcategory.issueItmSubCategories.includes(issue.message.sub_category)) ||
        (issue.message.category === 'FULFILLMENT' &&
          !issue_subcategory.issueFlmSubcategories.includes(issue.message.sub_category))
      ) {
        issueObj.ctgrySubCategory = `Invalid sub_category ${issue.sub_category} for issue category "${issue.category}"`
      }

      if (issue.message.issue.category === 'ITEM') {
        if (issue.message.issue.order_details.items.length === 0) {
          issueObj.items = `Items in issue.message.issue.order_details.items should not be empty when message category is ITEM`
        }
      }
      if (issue.message.issue.category === 'FULFILLMENT') {
        if (issue.message.issue.order_details.fulfillments.length === 0) {
          issueObj.items = `Fulfillments in issue.message.issue.order_details.fulfillments should not be empty when message category is FULFILLMENT`
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while validating category and subcategory in /${constants.RET_ISSUE}, ${error.stack}`)
    }

    const complainant_actions = issue.message.issue.issue_actions.complainant_actions

    checkOrganizationNameandDomain({
      endpoint: constants.RET_ISSUE,
      actionPayload: complainant_actions,
      contextSubscriberId: issue.context.bap_id,
      contextDomain: issue.context.domain,
      issueReportObj: issueObj,
      IdType: 'BAP',
    })

    compareUpdatedAtAndContextTimeStamp({
      endpoint: constants.RET_ISSUE,
      actionPayload: complainant_actions,
      messageUpdatedAt: issue.message.issue.updated_at,
      issueReportObj: issueObj,
    })

    compareCreatedAtAndUpdationTime({
      endpoint: constants.RET_ISSUE,
      created_at: issue.message.issue.created_at,
      contextTimeStamp: issue.context.timestamp,
      messageUpdatedAt: issue.message.issue.updated_at,
      domain: issue.context.domain,
      issueReportObj: issueObj,
    })

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ISSUE,
      contextTimeStamp: issue.context.timestamp,
      issue_updated_at: issue.message.issue.updated_at,
      issueReportObj: issueObj,
    })

    try {
      logger.info(`Checking conditional mandatory images for certain issue sub-categories`)
      if (['ITM02', 'ITM03', 'ITM04', 'ITM05', 'FLM04'].includes(issue.sub_category)) {
        const has = Object.prototype.hasOwnProperty
        if (!has.call(issue.description, 'images') || !issue.description.images.length) {
          issueObj.mndtryImages = `issue/description/images are mandatory for issue sub_category ${issue.sub_category}`
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking conditional mandatory images for certain issue sub-categories, ${error.stack}`)
    }

    try {
      logger.info(`Phone Number Check for /${constants.RET_ISSUE}`)
      // on_issue.message.issue.issue_actions.respondent_actions[0].updated_by.contact.phone
      if (!_.inRange(issue.message.issue.complainant_info.contact.phone, 1000000000, 99999999999)) {
        issueObj.Phn = `Phone Number for /${constants.RET_ISSUE} api is not in the valid Range`
      }
      setValue('igmPhn', issue.message.issue.complainant_info.contact.phone)
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ISSUE} api, ${error.stack}`)
    }

    setValue('igmCreatedAt', issue.message.issue.created_at)

    //setValue("issueObj", issueObj);
    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${constants.RET_ISSUE} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} API`, err)
    }
  }
}

export default checkIssue

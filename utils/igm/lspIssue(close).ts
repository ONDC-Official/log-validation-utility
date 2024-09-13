import _ from 'lodash'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'
import issueSubcategories from '../../utils/issue_subcategories'
import getLspIssueMessage from '../messages_constants'
import { setValue, getValue } from '../../shared/dao'
import { compareContextTimeStampAndUpdatedAt, compareUpdatedAtAndContextTimeStamp } from './igmHelpers'

const checkLspIssueClose = (data: any) => {
  let issueObj: any = {}

  const message = getLspIssueMessage(constants.RET_ISSUE)

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.LSP_ISSUE_CLOSE]: 'JSON cannot be empty' }
  }

  try {
    let issue: any = data

    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE} API`)

      const vs = validateSchema('igm', `${constants.RET_ISSUE}_close`, issue)

      if (vs != 'error') {
        Object.assign(issueObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ISSUE}_lsp, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking context for ${constants.RET_ISSUE} API`) //checking context
      var res: any = checkContext(issue.context, constants.RET_ISSUE)
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`Some error occurred while checking /${constants.RET_ISSUE} context, ${error.stack}`)
    }

    try {
      logger.info(`comparing transaction id with stored id in the db in /${constants.RET_ISSUE}`)

      // msgIdSet.add(issue.context.message_id);
      if (!res.valid) {
        Object.assign(issueObj, res.ERRORS)
      }

      // checking transaction id
      const transaction_id = getValue('igmTxnId')

      if (transaction_id === issue.context.transaction_id) {
        issueObj.transaction_id = message.transaction_id_issue_message
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} context, ${error.stack}`)
    }

    try {
      logger.info(`checking the length of respondent action must be greater than 0 in /${constants.RET_ISSUE}`)
      if (issue.message.issue.issue_actions.respondent_actions.length === 0) {
        issueObj.respondent_action = message.respondent_action_required
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} message, ${error.stack}`)
    }

    try {
      logger.info(`Checking organization's name for /${constants.RET_ISSUE}_lsp`)
      let respondent_action = issue.message.issue.issue_actions.respondent_actions

      const orgDomain = respondent_action[0].updated_by.org.name.split('::')

      if (!_.isEqual(issue.context.bap_id, orgDomain[0])) {
        issueObj.org_name = message.organization_name
      }

      for (const obj of respondent_action) {
        if (obj.respondent_action === 'CASCADED') {
          const orgDomain = obj.updated_by.org.name.split('::')

          if (!_.isEqual(issue.context.domain, orgDomain[1])) {
            issueObj.org_domain = message.domain
          }
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking organization's name for /${constants.RET_ISSUE} api, ${error.stack}`)
    }

    try {
      logger.info(
        `items array is Mandatory in case the issue_category is ITEM and at least one respondent_action must be CASCADED in respondent_actions  /${constants.RET_ISSUE}`,
      )

      if (issue.message.issue.category === 'ITEM') {
        if (!Object.keys(issue.message.issue.order_details).includes('items')) {
          issueObj.order_details = message.order_details_issue_message
        }
        outerLoop: for (const item of issue.message.issue.order_details.items) {
          if (!Object.keys(item).includes('quantity')) {
            issueObj.items = message.quantity_issue_message
            break outerLoop
          }
        }
      }

      if (
        !issue.message.issue.issue_actions.respondent_actions.some((item: any) => item.respondent_action === 'CASCADED')
      ) {
        issueObj.respondent_action = message.respondent_action_required
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} message, ${error.stack}`)
    }

    try {
      logger.info(`Validating category and subcategory in /${constants.RET_ISSUE}`)

      if (
        (issue.category === 'ITEM' && !issueSubcategories.issueItmSubCategories.includes(issue.sub_category)) ||
        (issue.category === 'FULFILLMENT' && !issueSubcategories.issueFlmSubcategories.includes(issue.sub_category))
      ) {
        issueObj.ctgrySubCategory = `Invalid sub_category ${issue.sub_category} for issue category "${issue.category}"`
      }
    } catch (error: any) {
      logger.error(`!!Error while validating category and subcategory in /${constants.RET_ISSUE}, ${error.stack}`)
    }

    try {
      logger.info(`Checking conditional mandatory images for certain issue sub-categories`)
      if (['ITM02', 'ITM03', 'ITM04', 'ITM05', 'FLM04'].includes(issue.sub_category)) {
        const has = Object.prototype.hasOwnProperty
        if (!has.call(issue.description, 'images') || !issue.description.images.length) {
          issueObj.mndtryImages = message.imageMendatory
        }
      }
    } catch (error: any) {
      logger.error(`Error while checking conditional mandatory images for certain issue sub-categories, ${error.stack}`)
    }

    try {
      logger.info(`Phone Number for /${constants.RET_ISSUE} api is not in the valid Range`)
      // on_issue.message.issue.issue_actions.respondent_actions[0].updated_by.contact.phone
      if (!_.inRange(issue.message.issue.complainant_info.contact.phone, 1000000000, 99999999999)) {
        issueObj.Phn = message.phone_issue_message
      }
      setValue('igmPhn', issue.message.issue.complainant_info.contact.phone)
    } catch (error: any) {
      logger.error(`Error while checking phone number for /${constants.RET_ISSUE} api, ${error.stack}`)
    }

    compareUpdatedAtAndContextTimeStamp({
      endpoint: constants.RET_ISSUE,
      messageUpdatedAt: issue.message.issue.updated_at,
      actionPayload: issue.message.issue.issue_actions.complainant_actions,
      issueReportObj: issueObj,
    })

    compareContextTimeStampAndUpdatedAt({
      endpoint: constants.RET_ISSUE,
      contextTimeStamp: issue.context.timestamp,
      issue_updated_at: issue.message.issue.updated_at,
      issueReportObj: issueObj,
    })

    return issueObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /lsp_${constants.RET_ISSUE}_lsp API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE} API`, err)
    }
  }
}

export default checkLspIssueClose

import _ from 'lodash'
import { setValue, getValue } from '../../shared/dao'
import { checkContext, isObjectEmpty } from '../../utils/index'
import constants, { IGMApiSequence } from '../../constants/index'
import { validateSchema } from '../../utils/index'
import { logger } from '../../shared/logger'

const checkIssueStatus = (data: any) => {
  const issueStatusObj: any = {}
  let res: any = {}

  if (!data || isObjectEmpty(data)) {
    return { [IGMApiSequence.RET_ISSUE_STATUS]: 'Json cannot be empty' }
  }
  try {
    const issueStatus: any = data
    try {
      logger.info(`Validating Schema for ${constants.RET_ISSUE_STATUS} API`)
      const vs = validateSchema('igm', constants.RET_ISSUE_STATUS, issueStatus)

      if (vs != 'error') {
        Object.assign(issueStatusObj, vs)
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ISSUE_STATUS}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Storing igmIssueStatMesgId in /${constants.RET_ONISSUE_STATUS}`)
      setValue('igmIssueStatMsgId', issueStatus.context.message_id)
      if (!res.valid) {
        Object.assign(issueStatusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE_STATUS} context, ${error.stack}`)
    }

    try {
      logger.info(`Checking context for /${constants.RET_ISSUE_STATUS}rack API`) //checking context
      res = checkContext(issueStatus.context, constants.RET_ISSUE_STATUS)
      if (!res.valid) {
        Object.assign(issueStatusObj, res.ERRORS)
      }
    } catch (error) {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE_STATUS} context`)
    }

    try {
      logger.info(`Comparing transaction ID of /${constants.RET_ISSUE} and /${constants.RET_ISSUE_STATUS}`)
      if (!_.isEqual(getValue('igmTxnId'), issueStatus.context.transaction_id)) {
        issueStatusObj.igmTxnId = `transaction ID mismatch in /${constants.RET_ISSUE} and /${constants.RET_ISSUE_STATUS}`
      }
    } catch (error: any) {
      logger.error(
        `Error while comparing transaction ID in /${constants.RET_ISSUE} and /${constants.RET_ISSUE_STATUS}, ${error.stack}`,
      )
    }

    // setValue("issueStatusObj", issueStatusObj);
    return issueStatusObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.error(`!!File not found for /${constants.RET_ISSUE_STATUS} API!`)
    } else {
      logger.error(`!!Some error occurred while checking /${constants.RET_ISSUE_STATUS} API`, err)
    }
  }
}

export default checkIssueStatus

import { logger } from '../../../../shared/logger'
import { setValue } from '../../../../shared/dao'
import constants from '../../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../..'

export const on_updatePurchaseFinnace = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    // if (!data || isObjectEmpty(data)) {
    //   return { [constants.ON_UPDATE_LOAN_STATUS]: 'JSON cannot be empty' }
    // }

    console.log("flow ---", flow)
    console.log("sequence ---", sequence)

    if (
      !data.message ||
      !data.context ||
      !data.message.order ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.order)
    ) {
      errorObj['missingFields'] = '/context, /message, /order or /message/order is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS_WCL', constants.ON_UPDATE, data)
    const contextRes: any = checkFISContext(data.context, constants.ON_UPDATE)
    
    setValue(`${constants.ON_UPDATE}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    // Specific validation for loan status updates
    if (!data.message.order.loan_status) {
      errorObj['missing_loan_status'] = 'loan_status is required for loan status updates'
    } else {
      // Validate the loan status value
      const validLoanStatuses = ['DISBURSED', 'ACTIVE', 'CLOSED', 'DEFAULTED']
      if (!validLoanStatuses.includes(data.message.order.loan_status)) {
        errorObj['invalid_loan_status'] = `loan_status must be one of: ${validLoanStatuses.join(', ')}`
      }
      
      // Store the loan status for cross-validation
      setValue('last_loan_status', data.message.order.loan_status)
      
      // Additional validations based on loan status
      if (data.message.order.loan_status === 'DISBURSED') {
        if (!data.message.order.disbursement_details) {
          errorObj['missing_disbursement_details'] = 'disbursement_details are required when loan_status is DISBURSED'
        }
      } else if (data.message.order.loan_status === 'CLOSED') {
        if (!data.message.order.closure_details) {
          errorObj['missing_closure_details'] = 'closure_details are required when loan_status is CLOSED'
        }
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

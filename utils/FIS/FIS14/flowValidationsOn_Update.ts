import { logger } from '../../../shared/logger'
//validate SIP flow
export const validateSIPFlow = (fulfillment: any, errorObj: any, index: number) => {
  try {
  
    if (!fulfillment?.stops?.[0]?.time?.schedule?.frequency) {
      errorObj[`fulfillments[${index}].stops.time.schedule.frequency`] = 
        `fulfillment[${index}].stops.time.schedule.frequency is required for SIP flow`
    }

    if (!fulfillment?.customer?.person?.id) {
      errorObj[`fulfillments[${index}].customer.person.id`] = 
        `fulfillment[${index}].customer.person.id is required for SIP flow`
    }
    if (!fulfillment?.agent) {
      errorObj[`fulfillments[${index}].agent`] = 
        `fulfillment[${index}].agent is required for SIP flow`
    }

    if (!fulfillment?.state?.descriptor?.code || !fulfillment?.state?.descriptor?.name) {
      errorObj[`fulfillments[${index}].state.descriptor`] = 
        `fulfillment[${index}].state.descriptor must include both code and name for SIP flow`
    } else if (fulfillment?.state?.descriptor?.code !== 'ONGOING') {
      errorObj[`fulfillments[${index}].state.descriptor.code`] = 
        `fulfillment[${index}].state.descriptor.code should be 'ONGOING' for SIP flow`
    }
    
    validateSIPTags(fulfillment, errorObj, index)
    
  } catch (error: any) {
    logger.error(`Error validating SIP flow: ${error.stack}`)
  }
}

export const validateSIPInstalmentFlow = (fulfillment: any, errorObj: any, index: number, status: string) => {
  try {
    if (!fulfillment?.customer?.person?.id) {
      errorObj[`fulfillments[${index}].customer.person.id`] = 
        `fulfillment[${index}].customer.person.id is required for SIP_INSTALMENT flow`
    }
    
    if (!fulfillment?.agent) {
      errorObj[`fulfillments[${index}].agent`] = 
        `fulfillment[${index}].agent is required for SIP_INSTALMENT flow`
    }
    
    if (!fulfillment?.state?.descriptor?.code || !fulfillment?.state?.descriptor?.name) {
      errorObj[`fulfillments[${index}].state.descriptor`] = 
        `fulfillment[${index}].state.descriptor must include both code and name for SIP_INSTALMENT flow`
    } else {
      if (status === 'COMPLETED' && fulfillment?.state?.descriptor?.code !== 'SUCCESSFUL') {
        errorObj[`fulfillments[${index}].state.descriptor.code`] = 
          `fulfillment[${index}].state.descriptor.code should be 'SUCCESSFUL' when order status is COMPLETED`
      } else if (status === 'CANCELLED' && fulfillment?.state?.descriptor?.code !== 'FAILED') {
        errorObj[`fulfillments[${index}].state.descriptor.code`] = 
          `fulfillment[${index}].state.descriptor.code should be 'FAILED' when order status is CANCELLED`
      }
    }
    
    validateFolioTags(fulfillment, errorObj, index)
    
  } catch (error: any) {
    logger.error(`Error validating SIP_INSTALMENT flow: ${error.stack}`)
  }
}

export const validateLumpsumFlow = (fulfillment: any, errorObj: any, index: number, status: string) => {
  try {
    if (!fulfillment?.customer?.person?.creds?.some((cred: any) => cred.type === 'FOLIO')) {
      errorObj[`fulfillments[${index}].customer.person.creds`] = 
        `fulfillment[${index}].customer.person.creds must include a FOLIO type credential for LUMPSUM flow`
    }

    if (!fulfillment?.agent) {
      errorObj[`fulfillments[${index}].agent`] = 
        `fulfillment[${index}].agent is required for LUMPSUM flow`
    }
    
    if (!fulfillment?.state?.descriptor?.code || !fulfillment?.state?.descriptor?.name) {
      errorObj[`fulfillments[${index}].state.descriptor`] = 
        `fulfillment[${index}].state.descriptor must include both code and name for LUMPSUM flow`
    } else {
      if (status === 'COMPLETED' && fulfillment?.state?.descriptor?.code !== 'SUCCESSFUL') {
        errorObj[`fulfillments[${index}].state.descriptor.code`] = 
          `fulfillment[${index}].state.descriptor.code should be 'SUCCESSFUL' when order status is COMPLETED`
      } else if (status === 'ACCEPTED' && fulfillment?.state?.descriptor?.code !== 'PENDING') {
        errorObj[`fulfillments[${index}].state.descriptor.code`] = 
          `fulfillment[${index}].state.descriptor.code should be 'PENDING' when order status is ACCEPTED`
      }
    }
    
    validateFolioTags(fulfillment, errorObj, index)
    validateThresholdsTags(fulfillment, errorObj, index)
    
  } catch (error: any) {
    logger.error(`Error validating LUMPSUM flow: ${error.stack}`)
  }
}

export const validateRedemptionFlow = (fulfillment: any, errorObj: any, index: number) => {
  try {
    if (!fulfillment?.customer?.person?.creds?.some((cred: any) => cred.type === 'FOLIO')) {
      errorObj[`fulfillments[${index}].customer.person.creds`] = 
        `fulfillment[${index}].customer.person.creds must include a FOLIO type credential for REDEMPTION flow`
    }

    if (!fulfillment?.agent) {
      errorObj[`fulfillments[${index}].agent`] = 
        `fulfillment[${index}].agent is required for REDEMPTION flow`
    }
    if (!fulfillment?.state?.descriptor?.code || !fulfillment?.state?.descriptor?.name) {
      errorObj[`fulfillments[${index}].state.descriptor`] = 
        `fulfillment[${index}].state.descriptor must include both code and name for REDEMPTION flow`
    } else if (fulfillment?.state?.descriptor?.code !== 'SUCCESSFUL') {
      errorObj[`fulfillments[${index}].state.descriptor.code`] = 
        `fulfillment[${index}].state.descriptor.code should be 'SUCCESSFUL' for REDEMPTION flow`
    }

    validateThresholdsTags(fulfillment, errorObj, index)

    if (!fulfillment?.tags?.some((tag: any) => tag.descriptor?.code === 'PAYOUT_BANK_ACCOUNT')) {
      errorObj[`fulfillments[${index}].tags`] = 
        `fulfillment[${index}].tags must include PAYOUT_BANK_ACCOUNT information for REDEMPTION flow`
    }
    
  } catch (error: any) {
    logger.error(`Error validating REDEMPTION flow: ${error.stack}`)
  }
}
const validateFolioTags = (fulfillment: any, errorObj: any, index: number) => {
  const folioTag = fulfillment?.tags?.find((tag: any) => tag.descriptor?.code === 'FOLIO_INFORMATION')
  
  if (!folioTag) {
    errorObj[`fulfillments[${index}].tags.folio`] = 
      `fulfillment[${index}].tags must include FOLIO_INFORMATION`
    return
  }
  
  const requiredFolioFields = ['FOLIO_NUMBER', 'HOLDING_PATTERN', 'HOLDER_NAME']
  
  requiredFolioFields.forEach(field => {
    if (!folioTag.list?.some((item: any) => item.descriptor?.code === field)) {
      errorObj[`fulfillments[${index}].tags.folio.${field.toLowerCase()}`] = 
        `FOLIO_INFORMATION must include ${field}`
    }
  })
}


const validateThresholdsTags = (fulfillment: any, errorObj: any, index: number) => {
  const thresholdsTag = fulfillment?.tags?.find((tag: any) => tag.descriptor?.code === 'THRESHOLDS')
  
  if (!thresholdsTag) {
    errorObj[`fulfillments[${index}].tags.thresholds`] = 
      `fulfillment[${index}].tags must include THRESHOLDS information`
    return
  }
  
  const requiredThresholdFields = ['AMOUNT_MIN', 'AMOUNT_MAX', 'AMOUNT_MULTIPLES']
  
  requiredThresholdFields.forEach(field => {
    if (!thresholdsTag.list?.some((item: any) => item.descriptor?.code === field)) {
      errorObj[`fulfillments[${index}].tags.thresholds.${field.toLowerCase()}`] = 
        `THRESHOLDS must include ${field}`
    }
  })
}

const validateSIPTags = (fulfillment: any, errorObj: any, index: number) => {

  validateFolioTags(fulfillment, errorObj, index)
  const thresholdsTag = fulfillment?.tags?.find((tag: any) => tag.descriptor?.code === 'THRESHOLDS')
  
  if (!thresholdsTag) {
    errorObj[`fulfillments[${index}].tags.thresholds`] = 
      `fulfillment[${index}].tags must include THRESHOLDS information for SIP flow`
    return
  }
  
  const requiredSIPThresholdFields = [
    'FREQUENCY', 'AMOUNT_MIN', 'AMOUNT_MAX', 'AMOUNT_MULTIPLES', 
    'INSTALMENTS_COUNT_MIN', 'INSTALMENTS_COUNT_MAX'
  ]
  
  requiredSIPThresholdFields.forEach(field => {
    if (!thresholdsTag.list?.some((item: any) => item.descriptor?.code === field)) {
      errorObj[`fulfillments[${index}].tags.thresholds.${field.toLowerCase()}`] = 
        `THRESHOLDS must include ${field} for SIP flow`
    }
  })
  
  // Validate Information tag
  const infoTag = fulfillment?.tags?.find((tag: any) => tag.descriptor?.code === 'INFORMATION')
  
  if (!infoTag) {
    errorObj[`fulfillments[${index}].tags.information`] = 
      `fulfillment[${index}].tags must include INFORMATION for SIP flow`
    return
  }
  
  const requiredInfoFields = ['NEXT_INSTALMENT_DATE', 'REMAINING_INSTALMENTS']
  
  requiredInfoFields.forEach(field => {
    if (!infoTag.list?.some((item: any) => item.descriptor?.code === field)) {
      errorObj[`fulfillments[${index}].tags.information.${field.toLowerCase()}`] = 
        `INFORMATION must include ${field} for SIP flow`
    }
  })
}

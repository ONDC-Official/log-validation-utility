import { logger } from '../../../shared/logger'
import _, { isEmpty } from 'lodash'
import constants from '../../../constants'
import { validateSchema } from '../../'

import { checkFullfillementType, validateContext} from './fis14checks'
import { getValue, setValue } from '../../../shared/dao'

export const checkSelect = (data: any, msgIdSet: any, sequence: string) => {
  const errorObj: any = {}
  
  try {
    // Check if data exists
    if (!data || isEmpty(data)) {
      return { [constants.SELECT]: 'JSON cannot be empty' }
    }
    
    const { message, context }: any = data
    
    // Check if required top-level objects exist
    if (!message || !context || !message.order || isEmpty(message) || isEmpty(message.order)) {
      return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
    }

    // Validate against schema
    const schemaValidation = validateSchema('FIS14', constants.SELECT, data)
    
    // Validate context
    const contextRes: any = validateContext(context, msgIdSet, constants.ON_SEARCH, constants.SELECT)

    // Add schema validation errors if any
    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }
    
    // Add context validation errors if any
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    
    const select = message.order

    // 1. Validate provider
    try {
      logger.info(`Validating provider object for /${constants.SELECT}`)
      const selectedProviderId = getValue('selectedProviderId')
      const providerId = select?.provider?.id

      if (!providerId) {
        errorObj.prvdrId = `provider.id is missing in /${constants.SELECT}`
      } else if (selectedProviderId && !_.isEqual(selectedProviderId, providerId)) {
        errorObj.prvdrId = `provider.id: ${providerId} in /${constants.SELECT} doesn't match with the selected id ${selectedProviderId}`
      }
      
      setValue('selectedProviderId', providerId)
    } catch (error: any) {
      logger.error(`!!Error while checking provider object for /${constants.SELECT}, ${error.stack}`)
    }
    
    // 2. Validate items
    try {
      logger.info(`Validating items array in /${constants.SELECT}`)
      const items = select?.items
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        errorObj.items = `items array is missing or empty in /${constants.SELECT}`
      } else {
        const itemIds = new Set()
        
        items.forEach((item: any, i: number) => {
          if (!item?.id) {
            errorObj[`items[${i}].id`] = `items[${i}].id is missing in /${constants.SELECT}`
          } else {
            if (itemIds.has(item.id)) {
              errorObj[`items[${i}].id_duplicate`] = `Duplicate item id: ${item.id} in /${constants.SELECT}`
            }
            itemIds.add(item.id)
          }
          
          // Validate quantity
          if (!item?.quantity) {
            errorObj[`items[${i}].quantity`] = `items[${i}].quantity is missing in /${constants.SELECT}`
          } else if (!item.quantity.selected || !item.quantity.selected.measure) {
            errorObj[`items[${i}].quantity.selected.measure`] = 
              `items[${i}].quantity.selected.measure is missing in /${constants.SELECT}`
          } else {
            const measure = item.quantity.selected.measure
            
            // Validate measure value and unit
            if (!measure.value) {
              errorObj[`items[${i}].quantity.selected.measure.value`] = 
                `items[${i}].quantity.selected.measure.value is missing in /${constants.SELECT}`
            } else if (isNaN(Number(measure.value))) {
              errorObj[`items[${i}].quantity.selected.measure.value_format`] = 
                `items[${i}].quantity.selected.measure.value must be a numeric string in /${constants.SELECT}`
            }
            
            if (!measure.unit) {
              errorObj[`items[${i}].quantity.selected.measure.unit`] = 
                `items[${i}].quantity.selected.measure.unit is missing in /${constants.SELECT}`
            } else if (measure.unit !== 'INR') {
              errorObj[`items[${i}].quantity.selected.measure.unit_value`] = 
                `items[${i}].quantity.selected.measure.unit must be 'INR' in /${constants.SELECT}`
            }
          }
          
          // Validate fulfillment_ids if xinput is present
          if (select.xinput) {
            if (!item.fulfillment_ids || !Array.isArray(item.fulfillment_ids) || item.fulfillment_ids.length === 0) {
              errorObj[`items[${i}].fulfillment_ids`] = 
                `items[${i}].fulfillment_ids is required when xinput is present in /${constants.SELECT}`
            }
          }
        })
      }
    } catch (error: any) {
      logger.error(`!!Error while checking items array in /${constants.SELECT}, ${error.stack}`)
    }

    // 3. Validate fulfillments
    try {
      logger.info(`Validating fulfillments array in /${constants.SELECT}`)
      const fulfillments = select?.fulfillments
      
      if (!fulfillments || !Array.isArray(fulfillments) || fulfillments.length === 0) {
        errorObj.fulfillments = `fulfillments array is missing or empty in /${constants.SELECT}`
      } else {
        const fulfillmentIds = new Set()
        
        fulfillments.forEach((fulfillment: any, i: number) => {
          if (!fulfillment?.id) {
            errorObj[`fulfillments[${i}].id`] = `fulfillment[${i}].id is missing in /${constants.SELECT}`
          } else {
            if (fulfillmentIds.has(fulfillment.id)) {
              errorObj[`fulfillments[${i}].id_duplicate`] = 
                `Duplicate fulfillment id: ${fulfillment.id} in /${constants.SELECT}`
            }
            fulfillmentIds.add(fulfillment.id)
          }
          
          if (!fulfillment?.type) {
            errorObj[`fulfillments[${i}].type`] =
              `fulfillment[${i}].type is missing in /${constants.SELECT}`
          } else {
            // Check if type is valid (SIP or LUMPSUM )
            if (!['SIP', 'LUMPSUM'].includes(fulfillment.type)) {
              errorObj[`fulfillments[${i}].type_invalid`] = 
                `fulfillment[${i}].type must be either 'SIP' or 'LUMPSUM', found: ${fulfillment.type}`
            }
            
            const typeErrors = checkFullfillementType(fulfillment.type, sequence as any)
            if (Object.keys(typeErrors).length > 0) {
              errorObj[`fulfillments[${i}].type_flow`] = typeErrors.type
            }
          }
          
          // Validate customer
          if (!fulfillment?.customer) {
            errorObj[`fulfillments[${i}].customer`] = 
              `fulfillment[${i}].customer is missing in /${constants.SELECT}`
          } else if (!fulfillment.customer.person) {
            errorObj[`fulfillments[${i}].customer.person`] = 
              `fulfillment[${i}].customer.person is missing in /${constants.SELECT}`
          } else if (!fulfillment.customer.person.id) {
            errorObj[`fulfillments[${i}].customer.person.id`] = 
              `fulfillment[${i}].customer.person.id is missing in /${constants.SELECT}`
          } else {
            const personId = fulfillment.customer.person.id
            if (personId.startsWith('pan:')) {
              const pan = personId.substring(4)
              const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
              if (!panRegex.test(pan)) {
                errorObj[`fulfillments[${i}].customer.person.id_format`] =
                  `Invalid PAN format in fulfillment[${i}].customer.person.id: ${personId}`
              }
            }
          }
          
          // Validate agent
          if (!fulfillment?.agent) {
            errorObj[`fulfillments[${i}].agent`] =
              `fulfillment[${i}].agent is missing in /${constants.SELECT}`
          } else {
            if (fulfillment.agent.person && fulfillment.agent.person.id) {
              const personId = fulfillment.agent.person.id
              if (personId.startsWith('euin:')) {
                const euin = personId.substring(5)
                if (!/^[A-Z0-9]+$/.test(euin)) {
                  errorObj[`fulfillments[${i}].agent.person.id_format`] =
                    `Invalid EUIN format in fulfillment[${i}].agent.person.id: ${personId}`
                }
              }
            }
            
            // Validate organization credentials if present
            if (fulfillment.agent.organization && fulfillment.agent.organization.creds) {
              const creds = fulfillment.agent.organization.creds
              if (!Array.isArray(creds) || creds.length === 0) {
                errorObj[`fulfillments[${i}].agent.organization.creds`] =
                  `fulfillment[${i}].agent.organization.creds must be a non-empty array`
              } else {
                creds.forEach((cred: any, credIndex: number) => {
                  if (!cred.id) {
                    errorObj[`fulfillments[${i}].agent.organization.creds[${credIndex}].id`] =
                      `fulfillment[${i}].agent.organization.creds[${credIndex}].id is missing`
                  }
                  if (!cred.type) {
                    errorObj[`fulfillments[${i}].agent.organization.creds[${credIndex}].type`] =
                      `fulfillment[${i}].agent.organization.creds[${credIndex}].type is missing`
                  } else if (!['ARN', 'SUB_BROKER_ARN'].includes(cred.type)) {
                    errorObj[`fulfillments[${i}].agent.organization.creds[${credIndex}].type_invalid`] =
                      `Invalid credential type: ${cred.type}, must be 'ARN' or 'SUB_BROKER_ARN'`
                  }
                })
              }
            }
          }
          
          // Validate stops
          if (!fulfillment?.stops) {
            errorObj[`fulfillments[${i}].stops`] =
              `fulfillment[${i}].stops is missing in /${constants.SELECT}`
          } else if (!Array.isArray(fulfillment.stops) || fulfillment.stops.length === 0) {
            errorObj[`fulfillments[${i}].stops_empty`] =
              `fulfillment[${i}].stops must be a non-empty array in /${constants.SELECT}`
          } else {
            fulfillment.stops.forEach((stop: any, stopIndex: number) => {
              if (!stop.time || !stop.time.schedule || !stop.time.schedule.frequency) {
                errorObj[`fulfillments[${i}].stops[${stopIndex}].time.schedule.frequency`] =
                  `fulfillment[${i}].stops[${stopIndex}].time.schedule.frequency is missing in /${constants.SELECT}`
              } else {
                const frequency = stop.time.schedule.frequency
                const frequencyRegex = /^R\d+\/\d{4}-\d{2}-\d{2}\/P\d+[YMWD]$/
                if (!frequencyRegex.test(frequency)) {
                  errorObj[`fulfillments[${i}].stops[${stopIndex}].time.schedule.frequency_format`] =
                    `Invalid frequency format: ${frequency}, expected format like 'R6/2024-05-15/P1M'`
                }
              }
            })
          }
        })
        
        // Cross-validate item fulfillment_ids with existing fulfillment IDs
        if (select.items && Array.isArray(select.items)) {
          select.items.forEach((item: any, itemIndex: number) => {
            if (item.fulfillment_ids && Array.isArray(item.fulfillment_ids)) {
              item.fulfillment_ids.forEach((ffId: string, ffIndex: number) => {
                if (!fulfillmentIds.has(ffId)) {
                  errorObj[`items[${itemIndex}].fulfillment_ids[${ffIndex}]_invalid`] = 
                    `items[${itemIndex}].fulfillment_ids[${ffIndex}] references non-existent fulfillment id: ${ffId}`
                }
              })
            }
          })
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while checking fulfillments array in /${constants.SELECT}, ${error.stack}`)
    }
    
    // 4. Validate xinput if present
    if (select.xinput) {
      try {
        logger.info(`Validating xinput in /${constants.SELECT}`)
        
        if (!select.xinput.form) {
          errorObj.xinput_form = `xinput.form is missing in /${constants.SELECT}`
        } else if (!select.xinput.form.id) {
          errorObj.xinput_form_id = `xinput.form.id is missing in /${constants.SELECT}`
        }
        
        if (!select.xinput.form_response) {
          errorObj.xinput_form_response = `xinput.form_response is missing in /${constants.SELECT}`
        } else if (!select.xinput.form_response.submission_id) {
          errorObj.xinput_form_response_submission_id = 
            `xinput.form_response.submission_id is missing in /${constants.SELECT}`
        }
      } catch (error: any) {
        logger.error(`!!Error while validating xinput in /${constants.SELECT}, ${error.stack}`)
      }
    }
    return errorObj
  } catch (error: any) {
    logger.error(`!!Error while checking provider object for /${constants.SELECT}, ${error.stack}`)
    return { error: error.message }
  }
}

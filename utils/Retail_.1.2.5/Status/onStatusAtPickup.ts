/* eslint-disable no-prototype-builtins */
import _ from 'lodash'
import constants, { ApiSequence } from '../../../constants'
import { logger } from '../../../shared/logger'
import { validateSchemaRetailV2, isObjectEmpty, checkContext, areTimestampsLessThanOrEqualTo } from '../..'
import { getValue, setValue } from '../../../shared/dao'
import { isStateForbiddenForRouting } from '../common/routingValidator'
import {
  validatePaymentStatus,
  validateProviderCredentials,
  validateFulfillmentConsistency,
  validateRoutingTagStructure,
  validateOrderUpdatedAt,
} from '../common/statusValidationHelpers'

export const checkOnStatusAtPickup = (
  data: any,
  _state: string,
  msgIdSet: any,
  _fulfillmentsItemsSet: any,
  flow?: string,
  schemaValidation?: boolean,
  stateless?: boolean,
) => {
  const onStatusObj: any = {}
  const EXPECTED_STATE = 'At-pickup'
  const schemaErrors: any = {}

  try {
    if (!data || isObjectEmpty(data)) {
      return { [ApiSequence.ON_STATUS_AT_PICKUP]: 'JSON cannot be empty' }
    }

    const { message, context }: any = data
    if (!message || !context || isObjectEmpty(message)) {
      return { missingFields: '/context, /message, is missing or empty' }
    }

    // Check if routing type is P2P
    const routingType = getValue('routingType')
    if (routingType && routingType !== 'P2P') {
      return {
        routingError: `/${constants.ON_STATUS}_${EXPECTED_STATE} is only valid for P2P routing, but current routing is ${routingType}`,
      }
    }

    // Run schema validation conditionally
    let schemaValidationResult = 'skip'
    if (schemaValidation !== false) {
      schemaValidationResult = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_STATUS, data)
    }

    if (schemaValidationResult !== 'error' && schemaValidationResult !== 'skip') {
      Object.assign(schemaErrors, schemaValidationResult)
    }

    const contextRes: any = checkContext(context, constants.ON_STATUS)

    if (!contextRes?.valid) {
      Object.assign(onStatusObj, contextRes.ERRORS)
    }

    if (stateless) {
      const hasSchema = Object.keys(schemaErrors).length > 0
      const hasBusiness = Object.keys(onStatusObj).length > 0
      if (!hasSchema && !hasBusiness) return false
      return { schemaErrors, businessErrors: onStatusObj }
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      onStatusObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)

    try {
      logger.info(`Adding Message Id /${constants.ON_STATUS}_${EXPECTED_STATE}`)
      if (msgIdSet.has(context.message_id)) {
        onStatusObj[`${ApiSequence.ON_STATUS_AT_PICKUP}_msgId`] = `Message id should not be same with previous calls`
      }
      msgIdSet.add(context.message_id)
    } catch (error: any) {
      logger.error(`!!Error while checking message id for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`)
    }

    setValue(`${ApiSequence.ON_STATUS_AT_PICKUP}`, data)

    try {
      logger.info(`Checking context for /${constants.ON_STATUS}_${EXPECTED_STATE} API`)
      const res: any = checkContext(context, constants.ON_STATUS)
      if (!res.valid) {
        Object.assign(onStatusObj, res.ERRORS)
      }
    } catch (error: any) {
      logger.error(
        `!!Some error occurred while checking /${constants.ON_STATUS}_${EXPECTED_STATE} context, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing city of /${constants.SEARCH} and /${constants.ON_STATUS}_${EXPECTED_STATE}`)
      if (!_.isEqual(searchContext.city, context.city)) {
        onStatusObj.city = `City code mismatch in /${constants.SEARCH} and /${constants.ON_STATUS}_${EXPECTED_STATE}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error while comparing city in /${constants.SEARCH} and /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing transaction Ids of /${constants.SELECT} and /${constants.ON_STATUS}_${EXPECTED_STATE}`)
      if (!_.isEqual(getValue('txnId'), context.transaction_id)) {
        onStatusObj.txnId = `Transaction Id should be same from /${constants.SELECT} onwards`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing transaction ids for /${constants.SELECT} and /${constants.ON_STATUS}_${EXPECTED_STATE} api, ${error.stack}`,
      )
    }

    const on_status = message.order

    try {
      logger.info(`Comparing order Id in /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${EXPECTED_STATE}`)
      if (on_status.id != getValue('cnfrmOrdrId')) {
        logger.info(`Order id (/${constants.ON_STATUS}_${EXPECTED_STATE}) mismatches with /${constants.CONFIRM})`)
        onStatusObj.onStatusOdrId = `Order id in /${constants.CONFIRM} and /${constants.ON_STATUS}_${EXPECTED_STATE} do not match`
      }
    } catch (error: any) {
      logger.info(
        `!!Error while comparing order id in /${constants.ON_STATUS}_${EXPECTED_STATE} and /${constants.CONFIRM}`,
        error,
      )
    }

    try {
      logger.info(
        `Comparing timestamp of previous /${constants.ON_STATUS} and /${constants.ON_STATUS}_${EXPECTED_STATE} API`,
      )
      if (_.gte(getValue('tmpstmp'), context.timestamp)) {
        onStatusObj.inVldTmstmp = `Timestamp in previous /${constants.ON_STATUS} api cannot be greater than or equal to /${constants.ON_STATUS}_${EXPECTED_STATE} api`
      }

      setValue('tmpstmp', context.timestamp)
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Comparing timestamp of /${constants.ON_CONFIRM} and /${constants.ON_STATUS}_${EXPECTED_STATE} API`)
      if (_.gte(getValue('onCnfrmtmpstmp'), context.timestamp)) {
        onStatusObj.tmpstmp1 = `Timestamp for /${constants.ON_CONFIRM} api cannot be greater than or equal to /${constants.ON_STATUS}_${EXPECTED_STATE} api`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while comparing timestamp for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    try {
      logger.info(`Checking order state in /${constants.ON_STATUS}_${EXPECTED_STATE}`)
      if (on_status.state !== 'In-progress') {
        onStatusObj.orderState = `Order state should be 'In-progress' for /${constants.ON_STATUS}_${EXPECTED_STATE}`
      }
    } catch (error: any) {
      logger.error(
        `!!Error occurred while checking order state for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    // Validate order.updated_at timestamp
    try {
      const contextTime = context.timestamp
      const previousUpdatedAt = getValue('PreviousUpdatedTimestamp')
      const updatedAtErrors = validateOrderUpdatedAt(
        on_status.updated_at,
        contextTime,
        previousUpdatedAt,
        `/${constants.ON_STATUS}_${EXPECTED_STATE}`,
      )
      Object.assign(onStatusObj, updatedAtErrors)

      if (on_status.updated_at) {
        setValue('PreviousUpdatedTimestamp', on_status.updated_at)
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking order.updated_at in /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    // Validate payment status for COD flows
    if (flow) {
      try {
        const paymentErrors = validatePaymentStatus(
          on_status.payment,
          flow,
          `/${constants.ON_STATUS}_${EXPECTED_STATE}`,
        )
        Object.assign(onStatusObj, paymentErrors)
      } catch (error: any) {
        logger.error(`!!Error while validating payment in /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`)
      }
    }

    // Validate provider credentials for digital lending flows
    if (flow) {
      try {
        const providerErrors = validateProviderCredentials(
          on_status.provider,
          flow,
          `/${constants.ON_STATUS}_${EXPECTED_STATE}`,
        )
        Object.assign(onStatusObj, providerErrors)
      } catch (error: any) {
        logger.error(
          `!!Error while validating provider credentials in /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
        )
      }
    }

    try {
      logger.info('Checking fulfillment.id, fulfillment.type and tracking')
      on_status.fulfillments.forEach((ff: any) => {
        let ffId = ''

        if (!ff.id) {
          logger.info(`Fulfillment Id must be present `)
          onStatusObj['ffId'] = `Fulfillment Id must be present`
        }

        ffId = ff.id
        if (getValue(`${ffId}_tracking`)) {
          if (ff.tracking === false || ff.tracking === true) {
            if (getValue(`${ffId}_tracking`) != ff.tracking) {
              logger.info(`Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`)
              onStatusObj['ffTracking'] = `Fulfillment Tracking mismatch with the ${constants.ON_SELECT} call`
            }
          } else {
            logger.info(`Tracking must be present for fulfillment ID: ${ff.id} in boolean form`)
            onStatusObj['ffTracking'] = `Tracking must be present for fulfillment ID: ${ff.id} in boolean form`
          }
        }

        try {
          logger.info(`Checking fulfillment state for /${constants.ON_STATUS}_${EXPECTED_STATE}`)
          const ffDesc = ff.state?.descriptor
          if (!ffDesc || !ffDesc.code) {
            onStatusObj[`fulfillmentState[${ff.id}]`] =
              `Fulfillment state descriptor is missing for /${constants.ON_STATUS}_${EXPECTED_STATE}`
          } else if (ffDesc.code !== EXPECTED_STATE) {
            onStatusObj[`fulfillmentState[${ff.id}]`] =
              `Fulfillment state should be '${EXPECTED_STATE}' for /${constants.ON_STATUS}_${EXPECTED_STATE} but found '${ffDesc.code}'`
          }

          // Validate state is allowed for routing type (should always be P2P here)
          if (routingType && routingType === 'P2P') {
            const validationError = isStateForbiddenForRouting(ffDesc.code, routingType)
            if (validationError) {
              onStatusObj[`fulfillmentStateRouting[${ff.id}]`] =
                `Fulfillment state '${ffDesc.code}' is not allowed for ${routingType} routing`
            }
          }
        } catch (error: any) {
          logger.error(
            `!!Error while checking fulfillment state for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
          )
        }

        // Validate routing tag structure
        try {
          const routingTagErrors = validateRoutingTagStructure(
            ff,
            routingType || 'P2P',
            `/${constants.ON_STATUS}_${EXPECTED_STATE}`,
          )
          Object.assign(onStatusObj, routingTagErrors)
        } catch (error: any) {
          logger.error(
            `!!Error while validating routing tags for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
          )
        }

        // Validate fulfillment consistency
        if (ff.type === 'Delivery') {
          try {
            const storedFulfillment = getValue('DeliveryFulfillment')
            const consistencyErrors = validateFulfillmentConsistency(
              ff,
              storedFulfillment,
              `/${constants.ON_STATUS}_${EXPECTED_STATE}`,
            )
            Object.assign(onStatusObj, consistencyErrors)
          } catch (error: any) {
            logger.error(
              `!!Error while validating fulfillment consistency for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
            )
          }
        }
      })
    } catch (error: any) {
      logger.info(
        `Error while checking fulfillments id, type and tracking in /${constants.ON_STATUS}_${EXPECTED_STATE}`,
      )
    }

    try {
      // Checking for fulfillment timestamps
      const DeliveryFulfillment = getValue('DeliveryFulfillment')
      const currentFulfillment = on_status.fulfillments.find((f: any) => f.id === DeliveryFulfillment?.id)

      if (currentFulfillment) {
        const prevTimestamp = DeliveryFulfillment?.['@ondc/org/state_updated_at']
        const currentTimestamp = currentFulfillment['@ondc/org/state_updated_at']

        if (!currentTimestamp) {
          onStatusObj[`fulfillmentTimestamp[${currentFulfillment.id}]`] =
            `'@ondc/org/state_updated_at' is required for fulfillment state updates`
        } else if (prevTimestamp && !areTimestampsLessThanOrEqualTo(prevTimestamp, currentTimestamp)) {
          onStatusObj[`fulfillmentTimestampOrder[${currentFulfillment.id}]`] =
            `'@ondc/org/state_updated_at' should be greater than or equal to the previous state timestamp`
        }
      }
    } catch (error: any) {
      logger.error(
        `!!Error while checking fulfillment timestamps for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`,
      )
    }

    try {
      // Store fulfillment for comparison in future calls
      const DeliveryFulfillment = getValue('DeliveryFulfillment')
      if (DeliveryFulfillment) {
        const currentFulfillment = on_status.fulfillments.find((f: any) => f.id === DeliveryFulfillment.id)
        if (currentFulfillment) {
          setValue('DeliveryFulfillment', currentFulfillment)
          setValue('DeliveryFulfillmentAction', ApiSequence.ON_STATUS_AT_PICKUP)
        }
      }
    } catch (error: any) {
      logger.error(`!!Error while storing fulfillment for /${constants.ON_STATUS}_${EXPECTED_STATE}, ${error.stack}`)
    }

    if (schemaValidation === true) {
      // Return only schema errors (or empty if none)
      if (Object.keys(schemaErrors).length === 0) return false
      return schemaErrors
    } else if (schemaValidation === false) {
      // Return only business errors (or empty if none)
      if (Object.keys(onStatusObj).length === 0) return false
      return onStatusObj
    } else {
      // Return both combined by default
      const combinedErrors = { ...schemaErrors, ...onStatusObj }
      if (Object.keys(combinedErrors).length === 0) return false
      return combinedErrors
    }
  } catch (err: any) {
    logger.error(
      `!!Some error occurred while checking /${constants.ON_STATUS}_${EXPECTED_STATE} API`,
      JSON.stringify(err.stack),
    )
    return { error: err.message }
  }
}

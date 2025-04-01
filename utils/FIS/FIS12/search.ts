import { logger } from '../../../shared/logger'
import { getValue, setValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext } from '../../../utils'
import { validatePaymentTags } from './tags'
import { isEmpty } from 'lodash'
import { validateXInputSubmission } from './fisChecks'

export const search = (data: any, msgIdSet: any, flow: string, sequence: string) => {
  const errorObj: any = {}
  try {
    if (!data || isObjectEmpty(data)) {
      return { [constants.SEARCH]: 'JSON cannot be empty' }
    }

    if (
      !data.message ||
      !data.context ||
      !data.message.intent ||
      isObjectEmpty(data.message) ||
      isObjectEmpty(data.message.intent)
    ) {
      errorObj['missingFields'] = '/context, /message, /intent or /message/intent is missing or empty'
      return Object.keys(errorObj).length > 0 && errorObj
    }

    const schemaValidation = validateSchema('FIS', constants.SEARCH, data)
    const contextRes: any = checkFISContext(data.context, constants.SEARCH)
    const code = data.message.intent?.category?.descriptor?.code
    const LoanType = getValue(`LoanType`)
    setValue(`${constants.SEARCH}_context`, data.context)
    msgIdSet.add(data.context.message_id)

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    try {
      logger.info(`Validating category in /${constants.SEARCH}`)
      const descriptorCode = flow.includes('PERSONAL') ? 'PERSONAL_LOAN' : 'INVOICE_BASED_LOAN'
      if (code) {
        if (code != descriptorCode) {
          errorObj['category'] =
            `invalid code, must be in a standard enum format as PERSONAL_LOAN or INVOICE_BASED_LOAN at category.descriptor`
        }

        if (!LoanType) setValue(`LoanType`, code)
      } else errorObj['category'] = `code: ${descriptorCode} is missing at category.descriptor`
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating category in /${constants.SEARCH},  ${error.message}`)
    }

    // validate payments
    try {
      logger.info(`Validating payments in /${constants.SEARCH}`)
      const payment = data?.message.intent?.payment
      const collectedBy = payment?.collected_by
      const allowedCollectedByValues = ['BPP', 'BAP']
      const terms: any = [
        { code: 'STATIC_TERMS', type: 'url' },
        {
          code: 'OFFLINE_CONTRACT',
          type: 'boolean',
        },
      ]

      if (!collectedBy) {
        errorObj[`collected_by`] = `payment.collected_by is missing in ${constants.SEARCH}`
      } else if (!allowedCollectedByValues.includes(collectedBy)) {
        errorObj['collected_by'] = `Invalid value for collected_by, should be either of ${allowedCollectedByValues}`
      } else {
        if (collectedBy == 'BPP') terms?.push({ code: 'DELAY_INTEREST', type: 'amount' })
        else {
          terms?.push({ code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' })
          terms?.push({
            code: 'SETTLEMENT_BASIS',
            type: 'enum',
            value: ['INVOICE_RECEIPT', 'Delivery'],
          })
        }

        setValue(`collected_by`, collectedBy)
      }

      // Validate payment tags
      const tagsValidation = validatePaymentTags(payment.tags, terms)
      if (!tagsValidation.isValid) {
        Object.assign(errorObj, { tags: tagsValidation.errors })
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating payments in /${constants.SEARCH},  ${error.message}`)
    }

    // checking providers
    try {
      // validate providers if type sequence is search_offer
      if (code == 'INVOICE_BASED_LOAN' && sequence !== 'search') {
        logger.info(`Validating providers in /${sequence}`)
        const provider = data?.message.intent?.provider

        if (isEmpty(provider)) {
          errorObj.prvdr = `provider is missing in /${sequence}`
        } else {
          const providerId = getValue(`${constants.ON_SEARCH}prvdrsId`)
          const itemId = getValue(`${constants.ON_SEARCH}_itemsId`)

          console.log('providerId', providerId, providerId?.includes(provider?.id))

          if (!provider?.id) {
            errorObj.prvdrId = `provider.id is missing in /${sequence}`
          } else if (providerId && !providerId?.includes(provider?.id)) {
            errorObj.prvdrId = `provider.id: ${provider?.id} in /${sequence} does'nt exist in /${constants.ON_SEARCH}`
          }

          //check items
          try {
            logger.info(`checking item array in provider /${sequence}`)
            if (!provider.items) {
              errorObj.items = `items array must be present & should non empty in /${sequence}`
            } else {
              provider.items.forEach((item: any, index: number) => {
                // Validate item id
                if (!item?.id) {
                  errorObj[`item[${index}].id`] = `id should be present at item[${index}] /${sequence}`
                } else {
                  if (itemId && !itemId.includes(item.id)) {
                    const key = `item[${index}].item_id`
                    errorObj[key] =
                      `/message/order/items/id in item: ${item.id} should be one of the item.id mapped in previous call`
                  }
                }

                //validate xInput form
                const xinputErrors = validateXInputSubmission(item?.xinput, index, sequence)
                Object.assign(errorObj, xinputErrors)
              })
            }
          } catch (error: any) {
            logger.error(`!!Error while checking item in /${sequence}`)
          }
        }
      }
    } catch (error: any) {
      logger.error(`!!Error occcurred while validating providers in /${sequence},  ${error.message}`)
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}

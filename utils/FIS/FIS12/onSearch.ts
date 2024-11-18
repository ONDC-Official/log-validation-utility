/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { FisApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import {
  checkUniqueCategoryIds,
  validateContext,
  validateDescriptor,
  validateXInput,
  validateXInputSubmission,
} from './fisChecks'
import {
  validatePaymentTags,
  validateLoanTags,
} from './tags'
import { isEmpty } from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any, sequence: string, flow: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.ON_SEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_SEARCH, data)
  const contextRes: any = validateContext(context, msgIdSet, constants.SEARCH, constants.ON_SEARCH)

  setValue(`${FisApiSequence.ON_SEARCH}_message`, message)
  setValue(`${FisApiSequence.ON_SEARCH}`, data)
  console.log('flow', flow)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const loanCode = getValue(`LoanType`)
  const version = getValue('version')

  // check descriptor
  try {
    logger.info(`Validating Descriptor for catalog`)
    const descriptor = onSearchCatalog?.descriptor
    // send true as last argument in case if descriptor?.code validation is needed
    const descriptorError = validateDescriptor(descriptor, constants.ON_SEARCH, `catalog.descriptor`, false, [])
    if (descriptorError) Object.assign(errorObj, descriptorError)
  } catch (error: any) {
    logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Checking Providers info (providers) in /${constants.ON_SEARCH}`)
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    if (len === 0 || len === undefined) {
      errorObj['providers'] = 'Providers array is missing or empty in /message/catalog'
      return errorObj
    }

    let i = 0
    while (i < len) {
      logger.info(`Validating uniqueness for provider id in providers[${i}]...`)
      const categoriesId = new Set()
      const prvdr = bppPrvdrs[i]

      // check provider id
      logger.info(`Validating uniqueness for provider id in providers[${i}]...`)
      if (!prvdr?.id) {
        errorObj[`prvdr${i}id`] = `provider.id: is missing at index: ${i}`
      } else if (prvdrsId.has(prvdr.id)) {
        errorObj[`prvdr${i}id`] = `duplicate provider id: ${prvdr.id} in providers`
      } else {
        prvdrsId.add(prvdr.id)
      }

      // check provider Descriptor
      try {
        logger.info(`Validating Descriptor at index: ${i}`)
        const descriptor = onSearchCatalog['providers'][i]['descriptor']
        const descriptorError = validateDescriptor(
          descriptor,
          constants.ON_SEARCH,
          `providers[${i}].descriptor`,
          false,
          [],
        )
        if (descriptorError) Object.assign(errorObj, descriptorError)
      } catch (error: any) {
        logger.info(`Error while validating descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
      }

      // check provider categories
      try {
        logger.info(`Checking categories for provider (${prvdr.id})`)
        const categories = onSearchCatalog['providers'][i]['categories']

        if (isEmpty(categories)) {
          errorObj['categories'] = 'Categories array is missing or empty in providers'
        } else {
          categories.forEach((category: any, j: number) => {
            logger.info(`Validating uniqueness for categories id in category[${j}]...`)
            if (!category?.id) {
              errorObj[`category${j}`] = `category.id: is missing at index: ${j}`
            } else if (categoriesId.has(category.id)) {
              errorObj[`category${j}`] = `duplicate category id: ${category.id} in providers[${i}]`
            } else {
              categoriesId.add(category.id)
            }

            logger.info(`Validating descriptor in providers[${i}].categories[${j}]...`)
            const descriptorError = validateDescriptor(
              category?.descriptor,
              constants.ON_SEARCH,
              `categories[${j}]`,
              true,
              [loanCode],
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)
          })
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      // check provider payments
      try {
        logger.info(`Checking payments in providers[${i}]`)
        const payments = prvdr?.payments
        if (isEmpty(payments)) {
          errorObj.payments = `payments array is missing or empty`
        } else {
          payments?.forEach((arr: any, i: number) => {
            const terms = [
              { code: 'SETTLEMENT_WINDOW', type: 'time', value: '/^PTd+[MH]$/' },
              {
                code: 'SETTLEMENT_BASIS',
                type: 'enum',
                value: ['INVOICE_RECEIPT', 'Delivery'],
              },
              { code: 'MANDATORY_ARBITRATION', type: 'boolean' },
              { code: 'STATIC_TERMS', type: 'url' },
              { code: 'COURT_JURISDICTION', type: 'string' },
              {
                code: 'OFFLINE_CONTRACT',
                type: 'boolean',
              },
            ]

            if (!arr?.collected_by) {
              errorObj[`payemnts[${i}]_collected_by`] =
                `payments.collected_by must be present in ${constants.ON_SEARCH}`
            } else {
              const srchCollectBy = getValue(`collected_by`)
              if (srchCollectBy != arr?.collected_by)
                errorObj[`payemnts[${i}]_collected_by`] =
                  `payments.collected_by value sent in ${constants.ON_SEARCH} should be same as sent in ${constants.SEARCH}: ${srchCollectBy}`

              if (arr?.collected_by == 'BAP') terms.push({ code: 'DELAY_INTEREST', type: 'amount' })
            }

            // Validate payment tags
            const tagsValidation = validatePaymentTags(arr.tags, terms)
            console.log('tagsValidation', tagsValidation)
            if (!tagsValidation.isValid) {
              Object.assign(errorObj, { paymentTags: tagsValidation.errors })
            }
          })
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking payments in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking items for provider (${prvdr.id}) in providers[${i}]`)
        let j = 0
        const items = onSearchCatalog['providers'][i]['items']
        const iLen = items?.length
        let parentItems = 0

        if (iLen === 0 || iLen === undefined) {
          errorObj['items'] = 'Items array is missing or empty in /message/catalog/providers/items'
        }

        while (j < iLen) {
          logger.info(`Validating uniqueness for item id in providers[${i}].items[${j}]...`)
          const item = items[j]

          if (!item?.id) {
            errorObj[`item${j}`] = `item.id: is missing at index: ${j}`
          } else if (itemsId.has(item.id)) {
            errorObj[`prvdr${i}item${j}`] = `duplicate item id: ${item.id} in providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if ('category_ids' in item) {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)

            if (!areCategoryIdsUnique) {
              const key = `prvdr${i}item${j}uniqueCategoryIds`
              errorObj[key] =
                `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
            }
          }

          // check item Descriptor
          try {
            logger.info(`Validating item Descriptor at index: ${j}`)
            const descriptor = item?.descriptor
            const descriptorError = validateDescriptor(
              descriptor,
              constants.ON_SEARCH,
              `providers[${i}].items[${j}]`,
              true,
              [loanCode],
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)
          } catch (error: any) {
            logger.info(`Error while validating descriptor for items at /${constants.ON_SEARCH}, ${error.stack}`)
          }

          // Validate parent_item_id & price for multi-offer calls
          if (sequence?.includes('_3')) {
            // parent_item_id check
            console.log('itemsId---------------11', item)
            if (!item?.parent_item_id)
              errorObj['parent_item_id'] = `parent_item_id is missing at providers[${i}].items[${j}]`
            else {
              parentItems++
              console.log('itemsId---------------', itemsId, item.parent_item_id)
              if (!itemsId.has(item.parent_item_id)) {
                errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id}  doesn't match with previous item.id in providers[${i}]`
              }
            }

            // price check
            const price = item?.price
            if (!price) errorObj['price'] = `price is missing at providers[${i}].items[${j}]`
            else {
              if (!price?.currency) errorObj['currency'] = `currency is missing at providers[${i}].items[${j}].price`
              if (!price?.value) errorObj['value'] = `value is missing at providers[${i}].items[${j}].price`
            }
          }

          // if (item?.descriptor?.code !== loanCode)
          //   errorObj[
          //     `prvdr[${i}].item[${j}].code`
          //   ] = `Descriptor code: ${item?.descriptor?.code} in item[${j}] must be the same as ${loanCode}`

          // Validate xinput
          // const xinput = item?.xinput
          // const xinputValidationErrors =
          //   version == '2.0.0' && sequence == 'on_select_1'
          //     ? validateXInputSubmission(xinput, index, sequence)
          //     : validateXInput(xinput, index, constants.ON_SELECT, 0)
          // if (xinputValidationErrors) {
          //   Object.assign(errorObj, xinputValidationErrors)
          // }

          const xinput = item?.xinput
          const currIndex = parseInt(sequence.replace('on_search_', ''))
          let xinputValidationErrors
          if (version == '2.1.0' && sequence == 'on_search_2') {
            xinputValidationErrors = validateXInputSubmission(xinput, j, sequence)
          } else if (version == '2.1.0' && sequence == 'on_search_3') xinputValidationErrors = null
          else {
            xinputValidationErrors = validateXInput(xinput, i, constants.ON_SEARCH, currIndex ? currIndex - 1 : 0)
          }
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }

          // Validate Item tags
          let tagsValidation: any = {}
          if (true) {
            tagsValidation = validateLoanTags(item?.tags, sequence)
          } else {
            // tagsValidation = validateItemsTags(item?.tags)
          }

          if (!tagsValidation?.isValid) {
            Object.assign(errorObj, { tags: tagsValidation.errors })
          }

          if (sequence?.includes('_3') && parentItems == 0)
            errorObj.parent_item_id = `child-items not found in providers[${i}]`
          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      // try {
      //   logger.info(`Checking tags construct for providers[${i}]`)

      //   const tags = onSearchCatalog['providers'][i]['tags']

      //   // Validate tags
      //   const tagsValidation = validateProviderTags(tags)
      //   if (!tagsValidation.isValid) {
      //     Object.assign(errorObj, { tags: tagsValidation.errors })
      //   }
      // } catch (error: any) {
      //   logger.error(`!!Error while checking tags construct for providers[${i}], ${error.stack}`)
      // }

      //tags missing

      i++
    }

    setValue(`${FisApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${FisApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${FisApiSequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

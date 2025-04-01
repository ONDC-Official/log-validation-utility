/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../'
import {
  checkUniqueCategoryIds,
  getCodes,
  validateContext,
  validateDescriptor,
  validateXInput,
  getAddOns,
} from './fisChecks'
import { validatePaymentTags, validateGeneralInfo } from './tags'
import { isEmpty } from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any, flow: string, action: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [constants.ON_SEARCH]: 'JSON cannot be empty' }
  }

  console.log('flow---------------', flow)

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema('FIS', constants.ON_SEARCH, data)
  const contextRes: any = validateContext(context, msgIdSet, action.replace('on_', ''), action)

  setValue(`${constants.ON_SEARCH}_message`, message)
  setValue(`${constants.ON_SEARCH}`, data)
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
  const categoriesId = new Set()
  const insurance = getValue('insurance')

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

  // check providers
  try {
    logger.info(`Checking providers info in /${constants.ON_SEARCH}`)
    const bppPrvdrs = onSearchCatalog['providers']
    if (isEmpty(bppPrvdrs)) {
      errorObj['providers'] = 'providers array is missing or empty in message.catalog'
      return errorObj
    }

    bppPrvdrs?.forEach((prvdr: any, i: number) => {
      logger.info(`Validating provider object at index: ${i}`)

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
          const codes = getCodes()
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
              codes,
            )
            if (descriptorError) Object.assign(errorObj, descriptorError)
          })
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      // check provider payments
      if (insurance != 'LIFE_INSURANCE') {
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
                { code: 'DELAY_INTEREST', type: 'amount' },
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
                if (srchCollectBy != arr?.collected_by) {
                  setValue(`collected_by`, arr?.collected_by)
                  errorObj[`payemnts[${i}]_collected_by`] =
                    `payments.collected_by mismatch with what was sent in /${constants.ON_SEARCH}`
                }
              }

              // Validate payment tags
              const tagsValidation = validatePaymentTags(arr.tags, terms)
              if (!tagsValidation.isValid) {
                Object.assign(errorObj, { tags: tagsValidation.errors })
              }
            })
          }
        } catch (error: any) {
          logger.error(`!!Errors while checking payments in providers[${i}], ${error.stack}`)
        }
      }

      // check provider items
      try {
        logger.info(`Checking items in providers[${i}]`)
        const items = onSearchCatalog['providers'][i]['items']

        if (isEmpty(items)) {
          errorObj['items'] = 'items array is missing or empty in message.catalog'
        } else {
          let parentItems = 0
          items.forEach((item: any, j: number) => {
            logger.info(`Validating uniqueness for item id in providers[${i}].items[${j}]...`)
            if (!item?.id) {
              errorObj[`item${j}`] = `item.id: is missing at index: ${j}`
            } else if (itemsId.has(item.id)) {
              errorObj[`prvdr${i}item${j}`] = `duplicate item id: ${item.id} in providers[${i}]`
            } else {
              itemsId.add(item.id)
            }

            // Validate category_ids
            if (isEmpty(item?.category_ids)) {
              errorObj.category_ids = `category_ids is missing or empty at providers[${i}].items[${j}]`
            } else {
              const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)
              if (!areCategoryIdsUnique) {
                const key = `prvdr${i}item${j}_category_ids`
                errorObj[key] =
                  `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
              }
            }

            // Validate descriptor & time
            if (insurance != 'MARINE_INSURANCE') {
              // check item Descriptor
              try {
                logger.info(`Validating item Descriptor at index: ${j}`)
                const descriptor = item?.descriptor
                const descriptorError = validateDescriptor(
                  descriptor,
                  constants.ON_SEARCH,
                  `providers[${i}].items[${j}]`,
                  false,
                  [],
                )
                if (descriptorError) Object.assign(errorObj, descriptorError)
              } catch (error: any) {
                logger.info(`Error while validating descriptor for items at /${constants.ON_SEARCH}, ${error.stack}`)
              }

              // Validate time
              // if (insurance != 'LIFE_INSURANCE') {
              if (isEmpty(item?.time)) {
                errorObj.time = `time is missing or empty at providers[${i}].items[${j}]`
              } else {
                const time = item?.time
                if (!time?.label) errorObj['time.label'] = `label is missing at providers[${i}].items[${j}]`
                else if (time?.label !== 'TENURE')
                  errorObj['time.label'] =
                    `label is missing or should be equal to TENURE at providers[${i}].items[${j}]`

                if (!time?.duration) {
                  errorObj['time.duration'] = `duration is missing at providers[${i}].items[${j}]`
                } else if (!/^P(?:(\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(?:(\d+H)?(\d+M)?(\d+S)?))?$/.test(time?.duration)) {
                  errorObj['time.duration'] = `incorrect format or type for duration at providers[${i}].items[${j}]`
                }
              }
              // }

              // Validate add_ons
              const addOnIdSet = new Set()
              try {
                console.log('``item?.add_ons-----------``', item?.add_ons)
                logger.info(`Checking add_ons`)
                if (!isEmpty(item?.add_ons)) {
                  item?.add_ons?.forEach((addOn: any, index: number) => {
                    const key = `item[${j}]_add_ons[${index}]`

                    if (!addOn?.id) {
                      errorObj[`${key}.id`] = `id is missing in add_ons[${index}]`
                    } else if (addOnIdSet.has(addOn?.id)) {
                      errorObj[`${key}.id`] = `duplicate add_on.id: ${addOn?.id} in add_ons`
                    } else {
                      addOnIdSet.add(addOn?.id)
                    }

                    if (!addOn?.price) {
                      errorObj[`${key}.price`] = `price is missing at ${key}`
                    } else {
                      if (!addOn?.price?.value) {
                        errorObj[`${key}.price.value`] = `price.value should be present at ${key}`
                      }

                      if (!addOn?.price?.currency) {
                        errorObj[`${key}.price.currency`] = `price.currency should be present at ${key}`
                      }
                    }

                    const code = addOn?.descriptor?.code
                    const validAddOnsCodes = getAddOns()
                    if (!code) errorObj[`${key}.code`] = 'descriptor.code is missing'
                    else if (!validAddOnsCodes?.includes(code))
                      errorObj[`${key}.code`] =
                        `descriptor.code shouldn't be present if add_on is not one of what's defined by ONDC`

                    if (!addOn?.quantity?.available?.count) {
                      errorObj[`${key}.quantity.available`] = 'quantity.count is missing in add_ons'
                    } else if (
                      !Number.isInteger(addOn?.quantity.available.count) ||
                      addOn?.quantity.available.count <= 0
                    ) {
                      errorObj[`${key}.quantity.available`] = 'Invalid quantity.selected count'
                    }

                    if (insurance == 'MOTOR_INSURANCE') {
                      if (!addOn?.quantity?.maximum?.count) {
                        errorObj[`${key}.quantity.maximum`] = 'quantity.count is missing in add_ons'
                      } else if (
                        !Number.isInteger(addOn?.quantity.maximum.count) ||
                        addOn?.quantity.maximum.count <= 0
                      ) {
                        errorObj[`${key}.quantity.maximum`] = 'Invalid quantity.selected count'
                      }
                    }
                  })
                }

                return errorObj
              } catch (error: any) {
                logger.info(`checked add_ons`, error)
                logger.error(`!!Error while checking add_ons in /${action}, ${error.stack}`)
              }
              setValue(`${constants.ON_SEARCH}_addOnIdSet_${j}`, addOnIdSet)
            }

            // Validate parent_item_id & price for multi-offer calls
            if (!action?.includes('_1')) {
              // parent_item_id check
              console.log('itemsId---------------11', item)
              if (
                (action?.includes('_3') && insurance == 'LIFE_INSURANCE') ||
                (action?.includes('_2') && insurance != 'LIFE_INSURANCE')
              ) {
                if (!item?.parent_item_id)
                  errorObj['parent_item_id'] = `parent_item_id is missing at providers[${i}].items[${j}]`
                else {
                  parentItems++
                  console.log('itemsId---------------', itemsId, item.parent_item_id)
                  if (!itemsId.has(item.parent_item_id)) {
                    errorObj.parent_item_id = `parent_item_id: ${item.parent_item_id}  doesn't match with previous item.id in providers[${i}]`
                  }
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

            // Validate xinput
            // either call shouldn't be of multi-offer, or parent_item_id should be present to validate xinput
            if (
              !action?.includes('_2') ||
              insurance == 'MOTOR_INSURANCE' ||
              (item?.parent_item_id && insurance == 'LIFE_INSURANCE')
            ) {
              const xinput = item?.xinput
              if (!xinput) errorObj['xinput'] = `xinput is missing or empty at providers[${i}].items[${j}]`
              else {
                const xinputValidationErrors = validateXInput(xinput, j, constants.ON_SEARCH, 0)
                if (xinputValidationErrors) {
                  Object.assign(errorObj, xinputValidationErrors)
                }
              }

              const formId: string[] | any = getValue('formId')
              console.log('formId-------==============22222', formId, action)
            }

            // Validate Item tags
            // let tagsValidation: any = {}
            // if (insurance != 'MOTOR_INSURANCE') {
            const tagsValidation = validateGeneralInfo(item?.tags, action)
            console.log('tagsValidation', tagsValidation)
            // } else {
            //   tagsValidation = validateItemsTags(item?.tags)
            // }
            if (!tagsValidation.isValid) {
              errorObj[`items.tags[${j}]`] = { ...tagsValidation.errors }
            }

            // Validate descriptor
            // if (!item?.descriptor && insurance == 'MARINE_INSURANCE') {
            //   //optional for MARINE
            //   return
            // } else {
            //   const descriptorError = validateDescriptor(
            //     item?.descriptor,
            //     constants.ON_SEARCH,
            //     `items[${j}].descriptor`,
            //     false,
            //     [],
            //   )
            //   if (descriptorError) Object.assign(errorObj, descriptorError)
            // }
          })

          if (action?.includes('_2') && parentItems == 0)
            errorObj.parent_item_id = `child-items not found in providers[${i}]`
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }
    })

    setValue(`${constants.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${constants.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${constants.ON_SEARCH}categoryId`, categoriesId)
    setValue(`${constants.ON_SEARCH}_itemsId`, Array.from(itemsId))
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

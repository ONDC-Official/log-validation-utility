/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { FisApiSequence, fisFlows } from '../../../constants'
import { validateSchema, isObjectEmpty, checkFISContext, checkBppIdOrBapId } from '../../'
import { checkUniqueCategoryIds, validateXInput } from './fisChecks'
import _ from 'lodash'

export const checkOnSearch = (data: any, msgIdSet: any, flow: string) => {
  if (!data || isObjectEmpty(data)) {
    return { [FisApiSequence.ON_SEARCH]: 'Json cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }

  const schemaValidation = validateSchema(data?.context?.domain.split(':')[1], constants.FIS_ONSEARCH, data)

  const contextRes: any = checkFISContext(context, constants.FIS_ONSEARCH)
  setValue(`${FisApiSequence.ON_SEARCH}_context`, context)
  setValue(`${FisApiSequence.ON_SEARCH}_message`, message)
  msgIdSet.add(context.message_id)

  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })
  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  setValue(`${FisApiSequence.ON_SEARCH}`, data)

  const searchContext: any = getValue(`${FisApiSequence.SEARCH}_context`)

  try {
    logger.info(`Storing BAP_ID and BPP_ID in /${constants.FIS_ONSEARCH}`)
    setValue('bapId', context.bap_id)
    setValue('bppId', context.bpp_id)
  } catch (error: any) {
    logger.error(`!!Error while storing BAP and BPP Ids in /${constants.FIS_ONSEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH}`)
    if (!_.isEqual(searchContext.transaction_id, context.transaction_id)) {
      errorObj.transaction_id = `Transaction Id for /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing transaction ids for /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH} api, ${error.stack}`,
    )
  }

  try {
    logger.info(`Comparing Message Ids of /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH}`)
    if (!_.isEqual(searchContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.FIS_SEARCH} and /${constants.FIS_ONSEARCH} api, ${error.stack}`,
    )
  }

  const onSearchCatalog: any = message.catalog
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()

  try {
    logger.info(`Checking Providers info (providers) in /${constants.FIS_ONSEARCH}`)
    let i = 0
    const bppPrvdrs = onSearchCatalog['providers']
    const len = bppPrvdrs.length
    while (i < len) {
      const categoriesId = new Set()

      logger.info(`Validating uniqueness for provider id in providers[${i}]...`)
      const prvdr = bppPrvdrs[i]

      if (prvdrsId.has(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[key] = `duplicate provider id: ${prvdr.id} in providers`
      } else {
        prvdrsId.add(prvdr.id)
      }

      try {
        logger.info(`Checking categories for provider (${prvdr.id}) in providers[${i}]`)
        let j = 0
        const categories = onSearchCatalog['providers'][i]['categories']
        const iLen = categories.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for categories id in providers[${i}].items[${j}]...`)
          const category = categories[j]

          if (categoriesId.has(category.id)) {
            const key = `prvdr${i}category${j}`
            errorObj[key] = `duplicate category id: ${category.id} in providers[${i}]`
          } else {
            categoriesId.add(category.id)
          }

          logger.info(`Validating descriptor code in providers[${i}].categories[${j}]...`)

          if (category?.descriptor?.code !== fisFlows[flow as keyof typeof fisFlows])
            errorObj[`prvdr[${i}].category[${j}].code`] = `category code: ${
              category?.descriptor?.code
            } in providers[${i}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`
          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking payments for provider (${prvdr.id}) in providers[${i}]`)
        prvdr?.payments?.forEach((arr: any, i: number) => {
          if (!arr?.collected_by) {
            errorObj[
              `payemnts[${i}]_collected_by`
            ] = `payments.collected_by must be present in ${FisApiSequence.ON_SEARCH}`
          } else {
            const srchCollectBy = getValue(`collected_by`)
            if (srchCollectBy != arr?.collected_by)
              errorObj[
                `payemnts[${i}]_collected_by`
              ] = `payments.collected_by value sent in ${FisApiSequence.ON_SEARCH} should be ${srchCollectBy} as sent in ${FisApiSequence.SEARCH}`
          }

          if (!arr.tags?.some((tag: any) => tag?.descriptor?.code === 'BUYER_FINDER_FEES')) {
            errorObj[`payemnts[${i}]_BUYER_FINDER_FEES`] = {
              tags: 'BUYER_FINDER_FEES tag is missing. It should be present.',
            }
          }

          if (!arr?.tags?.some((tag: any) => tag?.descriptor?.code === 'SETTLEMENT_TERMS')) {
            errorObj[`payemnts[${i}]_SETTLEMENT_TERMS`] = {
              tags: 'SETTLEMENT_TERMS tag is missing. It should be present.',
            }
          }
        })
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking items for provider (${prvdr.id}) in providers[${i}]`)
        let j = 0
        const items = onSearchCatalog['providers'][i]['items']
        const iLen = items.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for item id in providers[${i}].items[${j}]...`)
          const item = items[j]

          if (itemsId.has(item.id)) {
            const key = `prvdr${i}item${j}`
            errorObj[key] = `duplicate item id: ${item.id} in providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if ('category_ids' in item) {
            const areCategoryIdsUnique = checkUniqueCategoryIds(item.category_ids, categoriesId)

            if (!areCategoryIdsUnique) {
              const key = `prvdr${i}item${j}uniqueCategoryIds`
              errorObj[
                key
              ] = `category_ids value in /providers[${i}]/items[${j}] should match with id provided in categories`
            }
          }

          if (item?.descriptor?.code !== fisFlows[flow as keyof typeof fisFlows])
            errorObj[`prvdr[${i}].item[${j}].code`] = `Descriptor code: ${
              item?.descriptor?.code
            } in item[${j}] must be the same as ${fisFlows[flow as keyof typeof fisFlows]}`

          const xinput = item.xinput
          const xinputValidationErrors = validateXInput(xinput, i, j, constants.FIS_ONSEARCH)
          if (xinputValidationErrors) {
            Object.assign(errorObj, xinputValidationErrors)
          }

          const generalInfoTagGroup = item.tags.find((tag: { code: any }) => tag.code === 'GENERAL_INFO')
          if (!generalInfoTagGroup) {
            const key = `prvdr${i}item${j}_tags_GENERAL_INFO`
            errorObj[key] = `GENERAL_INFO tag group is missing in /providers[${i}]/items[${j}] and is required`
          } else {
            if (generalInfoTagGroup.list.length !== 6) {
              const key = `prvdr${i}item${j}_tags_GENERAL_INFO`
              errorObj[
                key
              ] = `GENERAL_INFO tag group in /providers[${i}]/items[${j}] should have 6 elements as per the API contract`
            }
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking serviceability construct for providers[${i}]`)

        const tags = onSearchCatalog['providers'][i]['tags']

        tags.forEach((sc: any, t: any) => {
          if ('list' in sc) {
            if (sc.list.length != 6) {
              const key = `prvdr${i}tags${t}`
              errorObj[
                key
              ] = `serviceability construct /providers[${i}]/tags[${t}] should be defined as per the API contract`
            }
          }
        })
      } catch (error: any) {
        logger.error(`!!Error while checking serviceability construct for providers[${i}], ${error.stack}`)
      }

      i++
    }

    setValue(`${FisApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
    setValue(`${FisApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${FisApiSequence.ON_SEARCH}_itemsId`, Array.from(itemsId))
    setValue(`ItemIDS`, itemsId)
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.FIS_ONSEARCH}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

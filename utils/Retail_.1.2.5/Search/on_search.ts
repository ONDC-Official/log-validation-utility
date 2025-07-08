/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
import { logger } from '../../../shared/logger'
import { setValue, getValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import {
  validateSchemaRetailV2,
  isObjectEmpty,
  checkContext,
  // timeDiff as timeDifference,
  checkGpsPrecision,
  emailRegex,
  checkBppIdOrBapId,
  checkServiceabilityType,
  validateLocations,
  isSequenceValid,
  isValidPhoneNumber,
  checkMandatoryTags,
  areTimestampsLessThanOrEqualTo,
  getStatutoryRequirement,
  checkForStatutory,
  validateBppUri,
  validateBapUri,
  validateMetaTags,
  validateFinanceTags,
} from '../..'
import _, { isEmpty } from 'lodash'
import { compareSTDwithArea } from '../../index'
import { BPCJSON, agriJSON, groceryJSON, healthJSON, homeJSON } from '../../../constants/category'
import { electronicsData } from '../../../constants/electronics'
import { applianceData } from '../../../constants/appliance'
import { fashion } from '../../../constants/fashion'
import { DOMAIN, FLOW, OFFERSFLOW, statutory_reqs } from '../../enum'
import { ret1aJSON } from '../../../constants/ret1a'
export const checkOnsearch = (data: any, flow?: string) => {
  console.log('in this on_search 1.2.5')

  if (!data || isObjectEmpty(data)) {
    return { [ApiSequence.ON_SEARCH]: 'JSON cannot be empty' }
  }

  const { message, context } = data

  if (!message || !context || !message.catalog || isObjectEmpty(message) || isObjectEmpty(message.catalog)) {
    return { missingFields: '/context, /message, /catalog or /message/catalog is missing or empty' }
  }
  const schemaValidation = validateSchemaRetailV2(context.domain.split(':')[1], constants.ON_SEARCH, data)
  let collect_payment_tags: any = {}

  setValue(`${ApiSequence.ON_SEARCH}_context`, context)
  setValue(`${ApiSequence.ON_SEARCH}_message`, message)
  const providerOffers: any[] = message?.catalog['bpp/providers']?.flatMap((provider: any) => provider?.offers || [])
  if (providerOffers && providerOffers.length > 0) {
    setValue(`${ApiSequence.ON_SEARCH}_offers`, providerOffers)
  }
  let errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  validateBapUri(context.bap_uri, context.bap_id, errorObj)
  validateBppUri(context.bpp_uri, context.bpp_id, errorObj)
  if (context.transaction_id == context.message_id) {
    errorObj['on_search_full_catalog_refresh'] =
      `Context transaction_id (${context.transaction_id}) and message_id (${context.message_id}) can't be the same.`
  }
  try {
    logger.info(`Comparing Message Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(getValue(`${ApiSequence.SEARCH}_msgId`), context.message_id)) {
      errorObj[`${ApiSequence.ON_SEARCH}_msgId`] =
        `Message Ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.error(`!!Error while checking message id for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
    errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
  }

  const checkBap = checkBppIdOrBapId(context.bap_id)
  const checkBpp = checkBppIdOrBapId(context.bpp_id)

  if (checkBap) Object.assign(errorObj, { bap_id: 'context/bap_id should not be a url' })
  if (checkBpp) Object.assign(errorObj, { bpp_id: 'context/bpp_id should not be a url' })

  try {
    logger.info(`Checking for context in /${constants.ON_SEARCH}`)
    const contextRes: any = checkContext(context, constants.ON_SEARCH)
    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
  } catch (error: any) {
    logger.error(`Error while checking for context in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  setValue(`${ApiSequence.ON_SEARCH}`, data)
  const searchContext: any = getValue(`${ApiSequence.SEARCH}_context`)

  try {
    logger.info(`Storing BAP_ID and BPP_ID in /${constants.ON_SEARCH}`)
    setValue('bapId', context.bap_id)
    setValue('bppId', context.bpp_id)
  } catch (error: any) {
    logger.error(`!!Error while storing BAP and BPP Ids in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  try {
    logger.info(`Comparing transaction Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(searchContext.transaction_id, context.transaction_id)) {
      errorObj.transaction_id = `Transaction Id for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing transaction ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  // removed timestamp difference check
  // try {
  //   logger.info(`Comparing timestamp of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
  //   const tmpstmp = searchContext?.timestamp
  //   if (_.gte(tmpstmp, context.timestamp)) {
  //     errorObj.tmpstmp = `Timestamp for /${constants.SEARCH} api cannot be greater than or equal to /${constants.ON_SEARCH} api`
  //   } else {
  //     const timeDiff = timeDifference(context.timestamp, tmpstmp)
  //     logger.info(timeDiff)
  //     if (timeDiff > 5000) {
  //       errorObj.tmpstmp = `context/timestamp difference between /${constants.ON_SEARCH} and /${constants.SEARCH} should be less than 5 sec`
  //     }
  //   }
  // } catch (error: any) {
  //   logger.info(
  //     `Error while comparing timestamp for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
  //   )
  // }

  try {
    logger.info(`Comparing Message Ids of /${constants.SEARCH} and /${constants.ON_SEARCH}`)
    if (!_.isEqual(searchContext.message_id, context.message_id)) {
      errorObj.message_id = `Message Id for /${constants.SEARCH} and /${constants.ON_SEARCH} api should be same`
    }
  } catch (error: any) {
    logger.info(
      `Error while comparing message ids for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  try {
    const providers = data.message.catalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items.forEach((item: any) => {
        console.log('item inside items', item?.['@ondc/org/available_on_cod'])
      })

      console.log('items>>', items)
      console.log('provider items', provider.items)
      const address = provider.locations[0].address

      if (address) {
        const area_code = Number.parseInt(address.area_code)
        const std = context.city.split(':')[1]

        logger.info(`Comparing area_code and STD Code for /${constants.ON_SEARCH}`)
        const areaWithSTD = compareSTDwithArea(area_code, std)
        if (!areaWithSTD) {
          logger.error(`STD code does not match with correct area_code on /${constants.ON_SEARCH}`)
          errorObj.invldAreaCode = `STD code does not match with correct area_code on /${constants.ON_SEARCH}`
        }
      }
    })
  } catch (error: any) {
    logger.error(
      `Error while matching area_code and std code for /${constants.SEARCH} and /${constants.ON_SEARCH} api, ${error.stack}`,
    )
  }

  const onSearchCatalog: any = message.catalog
  const onSearchFFIdsArray: any = []
  const prvdrsId = new Set()
  const prvdrLocId = new Set()
  const itemsId = new Set()
  const parentItemIdSet = new Set()
  const onSearchFFTypeSet = new Set()
  const itemsArray: any = []
  let itemIdList: any = []
  setValue('tmpstmp', context.timestamp)

  // Storing static fulfillment ids in onSearchFFIdsArray, OnSearchFFTypeSet
  try {
    logger.info(`Saving static fulfillment ids in /${constants.ON_SEARCH}`)

    onSearchCatalog['bpp/providers'].forEach((provider: any) => {
      const onSearchFFIds = new Set()
      const bppFF = provider.fulfillments
      const len = bppFF.length

      let i = 0
      while (i < len) {
        onSearchFFTypeSet.add(bppFF[i].type)
        onSearchFFIds.add(bppFF[i].id)
        i++
      }
      onSearchFFIdsArray.push(onSearchFFIds)
    })

    setValue('onSearchFFIdsArray', onSearchFFIdsArray)
  } catch (error: any) {
    logger.info(`Error while saving static fulfillment ids in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Storing items of bpp/providers in itemsArray and itemIdList
  try {
    logger.info(`Storing items of bpp/providers in itemsArray for  /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items
      itemsArray.push(items)
      items.forEach((item: any) => {
        itemIdList.push(item.id)
      })
    })
    setValue('ItemList', itemIdList)
    setValue('onSearchItems', itemsArray)
  } catch (error: any) {
    logger.error(
      `Error while storing items of bpp/providers in itemsArray for  /${constants.ON_SEARCH}, ${error.stack}`,
    )
  }

  // fulfillment type checking
  try {
    if(flow===FLOW.FLOW004){
    logger.info(`fulfillment type in bpp/providers in fulfillmentArray for  /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
     
      provider.fulfillments.forEach((item: any) => {
        if(item.type!== "Buyer-Delivery"){
          errorObj['missingFulfillmentType'] = `Fulfillment Type should be "Buyer-Delivery" for flow004 `
        }
        
    

      })
    })
  }
  } catch (error: any) {
    logger.error(
      `Error while storing items of bpp/providers in itemsArray for  /${constants.ON_SEARCH}, ${error.stack}`,
    )
  }

  //Checking item availability timings

  try {
    if (flow === FLOW.FLOW001) {
      logger.info(`Checking item availability timings in tags in items in bpp/providers  for  /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items
      items.forEach((it: any) => {
        const timingTags = it.tags.find((item: any) => item.code === 'timing')
        if (timingTags) {
          errorObj['missingAvailabilityTimings'] = `Item availability timings should be present in items tags with code as 'timing' /${constants.ON_SEARCH}`
        }
      })
    })}
  } catch (error: any) {
    logger.error(`Error while Checking item availability timings for  /${constants.ON_SEARCH}, ${error.stack}`)
  }
  // Checking for mandatory Items in provider IDs
  try {
    const domain = context.domain.split(':')[1]
    logger.info(`Checking for item tags in bpp/providers[0].items.tags in ${domain}`)
    const isoDurationRegex = /^P(?=\d|T\d)(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any) => {
        const replacementTerms = item.replacement_terms

        if (replacementTerms !== undefined) {
          if (!Array.isArray(replacementTerms) || replacementTerms.length === 0) {
            errorObj['on_search_full_catalog_refresh'] =
              `replacement_terms must be a non-empty array if present for item ID '${item.id}'`
            return
          }

          for (const term of replacementTerms) {
            if (!term.hasOwnProperty('replace_within')) {
              errorObj['on_search_full_catalog_refresh'] =
                `Missing 'replace_within' in replacement_terms for item ID '${item.id}'`
            }

            const duration = term.replace_within?.duration

            if (!duration || !isoDurationRegex.test(duration)) {
              errorObj['on_search_full_catalog_refresh'] =
                `Invalid or missing ISO 8601 duration in replacement_terms for item ID '${item.id}'. Found: '${duration}'`
            }
          }
        }
      })
      let errors: any
      switch (domain) {
        case DOMAIN.RET10:
          errors = checkMandatoryTags(i, items, errorObj, groceryJSON, 'Grocery')
          break
        case DOMAIN.RET12:
          errors = checkMandatoryTags(i, items, errorObj, fashion, 'Fashion')
          break
        case DOMAIN.RET13:
          errors = checkMandatoryTags(i, items, errorObj, BPCJSON, 'BPC')
          break
        case DOMAIN.RET14:
          errors = checkMandatoryTags(i, items, errorObj, electronicsData, 'Electronics')
          break
        case DOMAIN.RET15:
          errors = checkMandatoryTags(i, items, errorObj, applianceData, 'Appliances')
          break
        case DOMAIN.RET16:
          errors = checkMandatoryTags(i, items, errorObj, homeJSON, 'Home & Kitchen')
          break
        case DOMAIN.RET18:
          errors = checkMandatoryTags(i, items, errorObj, healthJSON, 'Health & Wellness')
          break
        case DOMAIN.AGR10:
          errors = checkMandatoryTags(i, items, errorObj, agriJSON, 'Agriculture')
          break
        case DOMAIN.RET1A:
          errors = checkMandatoryTags(i, items, errorObj, ret1aJSON, 'Automobile')
          break
      }
      Object.assign(errorObj, errors)
    }
  } catch (error: any) {
    logger.error(`!!Errors while checking for items in bpp/providers/items, ${error.stack}`)
  }

  // Comparing valid timestamp in context.timestamp and bpp/providers/items/time/timestamp
  try {
    logger.info(`Comparing valid timestamp in context.timestamp and bpp/providers/items/time/timestamp`)
    const timestamp = context.timestamp
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        const itemTimeStamp = item.time.timestamp
        const op = areTimestampsLessThanOrEqualTo(itemTimeStamp, timestamp)
        if (!op) {
          const key = `bpp/providers[${i}]/items/time/timestamp[${index}]`
          errorObj[key] = `Timestamp for item[${index}] can't be greater than context.timestamp`
          logger.error(`Timestamp for item[${index}] can't be greater than context.timestamp`)
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
    )
  }

  // Checking for duplicate providerID in bpp/providers
  try {
    for (let i in onSearchCatalog['bpp/providers']) {
      logger.info(`Validating uniqueness for provider id in bpp/providers[${i}]...`)
      const prvdr = onSearchCatalog['bpp/providers'][i]
      if (prvdrsId.has(prvdr.id)) {
        const key = `prvdr${i}id`
        errorObj[key] = `duplicate provider id: ${prvdr.id} in bpp/providers`
      } else {
        prvdrsId.add(prvdr.id)
      }
    }
    setValue(`${ApiSequence.ON_SEARCH}prvdrsId`, prvdrsId)
  } catch (error: any) {
    logger.error(`!!Errors while checking provider id in bpp/providers, ${error.stack}`)
  }

  // Checking for long_desc and short_desc in bpp/providers/items/descriptor/
  try {
    logger.info(`Checking for long_desc and short_desc in bpp/providers/items/descriptor/`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        if (!item.descriptor.short_desc || !item.descriptor.long_desc) {
          logger.error(
            `short_desc and long_desc should not be provided as empty string "" in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`,
          )
          const key = `bpp/providers[${i}]/items[${index}]/descriptor`
          errorObj[key] =
            `short_desc and long_desc should not be provided as empty string "" in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/time/timestamp, ${error.stack}`,
    )
  }
  // Checking for code in bpp/providers/items/descriptor/
  try {
    logger.info(`Checking for code in bpp/providers/items/descriptor/`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const items = onSearchCatalog['bpp/providers'][i].items
      items.forEach((item: any, index: number) => {
        if (!item.descriptor.code) {
          logger.error(`code should be provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`)
          const key = `bpp/providers[${i}]/items[${index}]/descriptor`
          errorObj[key] = `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor`
        } else {
          const itemCodeArr = item.descriptor.code.split(':')
          const itemDescType = itemCodeArr[0]
          const itemDescCode = itemCodeArr[1]
          const domain = getValue('domain')
          const subdomain = domain?.substring(3)
          if (domain != 'AGR10' && domain != 'RET1A') {
            switch (subdomain) {
              case '10':
              case '13':
              case '16':
              case '18':
                if (itemDescType != '1') {
                  const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                  errorObj[key] =
                    `code should have 1:EAN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
                } else {
                  const regex = /^\d{8}$|^\d{13}$/
                  if (!regex.test(itemDescCode)) {
                    const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                    errorObj[key] =
                      `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code(${itemDescCode}) should be number and with either length 8 or 13`
                  }
                }
                break
              case '12':
                if (itemDescType == '4') {
                  const regex = /^\d{4}$|^\d{6}$|^\d{8}$|^\d{10}$/
                  if (!regex.test(itemDescCode)) {
                    const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                    errorObj[key] =
                      `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code should be number and have a length 4, 6, 8 or 10.`
                  }
                } else {
                  const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                  errorObj[key] =
                    `code should have 4:HSN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
                }
                break
              case '14':
              case '15':
                if (itemDescType == '3') {
                  const regex = /^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/
                  if (!regex.test(itemDescCode)) {
                    const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                    errorObj[key] =
                      `code should provided in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code should be number and have a length 8, 12, 13 or 14}.`
                  }
                } else {
                  const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                  errorObj[key] =
                    `code should have 3:GTIN as a value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
                }
                break
              default:
                const key = `bpp/providers[${i}]/items[${index}]/descriptor/code`
                errorObj[key] =
                  `code should have a valid value in /message/catalog/bpp/providers[${i}]/items[${index}]/descriptor/code`
                break
            }
          }
        }
      })
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking timestamp in context.timestamp and bpp/providers/items/descriptor/code, ${error.stack}`,
    )
  }

  // Adding parent_item_id in a set
  try {
    logger.info(`Adding parent_item_id in a set on /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      provider.items.forEach((item: any) => {
        if (!parentItemIdSet.has(item.parent_item_id)) {
          parentItemIdSet.add(item.parent_item_id)
        }
      })
    })

    setValue('parentItemIdSet', parentItemIdSet)
  } catch (error: any) {
    logger.error(`Error while adding parent_item_id in a set on /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Checking image array for bpp/providers/[]/categories/[]/descriptor/images[]
  try {
    logger.info(`Checking image array for bpp/provider/categories/descriptor/images[]`)
    for (let i in onSearchCatalog['bpp/providers']) {
      const categories = onSearchCatalog['bpp/providers'][i].categories
      if (categories) {
        categories.forEach((item: any, index: number) => {
          if (item.descriptor.images && item.descriptor.images.length < 1) {
            const key = `bpp/providers[${i}]/categories[${index}]/descriptor`
            errorObj[key] = `Images should not be provided as empty array for categories[${index}]/descriptor`
            logger.error(`Images should not be provided as empty array for categories[${index}]/descriptor`)
          }
        })
      }
    }
  } catch (error: any) {
    logger.error(
      `!!Errors while checking image array for bpp/providers/[]/categories/[]/descriptor/images[], ${error.stack}`,
    )
  }

  try {
    logger.info(`Checking for np_type in bpp/descriptor`)
    const descriptor = onSearchCatalog['bpp/descriptor']
    descriptor?.tags.map((tag: { code: any; list: any[] }) => {
      if (tag.code === 'bpp_terms') {
        const npType = tag.list.find((item) => item.code === 'np_type')
        if (!npType) {
          errorObj['bpp/descriptor'] = `Missing np_type in bpp/descriptor`
          setValue(`${ApiSequence.ON_SEARCH}np_type`, '')
        } else {
          setValue(`${ApiSequence.ON_SEARCH}np_type`, npType.value)
        }
        const accept_bap_terms = tag.list.find((item) => item.code === 'accept_bap_terms')
        if (accept_bap_terms) {
          errorObj['bpp/descriptor/accept_bap_terms'] =
            `accept_bap_terms is not required in bpp/descriptor/tags for now `
        }
        // const collect_payment = tag.list.find((item) => item.code === 'collect_payment')
        // if (collect_payment) {
        //   errorObj['bpp/descriptor/collect_payment'] = `collect_payment is not required in bpp/descriptor/tags for now `
        // }
      }
      if (flow === FLOW.FLOW007 || flow === FLOW.FLOW0099 || flow === OFFERSFLOW.FLOW0098) {
        collect_payment_tags = tag.list.find((item) => item.code === 'collect_payment')
        if (!collect_payment_tags) {
          errorObj['bpp/descriptor/tags/collect_payment'] =
            `collect_payment is required in bpp/descriptor/tags for on_search catalogue for flow: ${flow} `
        }
        if (!['Y', 'N'].includes(collect_payment_tags.value)) {
          errorObj['bpp/descriptor/tags/collect_payment'] = `value must be "Y" or "N" for flow: ${flow}`
        }
        setValue(collect_payment_tags.value, 'collect_payment')
      }
    })
  } catch (error: any) {
    logger.error(`Error while checking np_type in bpp/descriptor for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  //Validating Offers
  try {
    logger.info(`Checking offers under bpp/providers`)

    // Iterate through bpp/providers
    for (let i in onSearchCatalog['bpp/providers']) {
      const offers = onSearchCatalog['bpp/providers'][i]?.offers ?? []
      if (!offers || !Array.isArray(offers)) {
        const key = `bpp/providers[${i}]/offers`
        errorObj[key] = `Offers must be an array in bpp/providers[${i}]`
        continue
      }

      offers.forEach((offer: any, offerIndex: number) => {
        // Validate mandatory fields
        if (!offer.id) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/id`
          errorObj[key] = `Offer ID is mandatory for offers[${offerIndex}]`
          logger.error(`Offer ID is mandatory for offers[${offerIndex}]`)
        }

        if (!offer.descriptor || !offer.descriptor.code) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/descriptor`
          errorObj[key] = `Descriptor with code is mandatory for offers[${offerIndex}]`
          logger.error(`Descriptor with code is mandatory for offers[${offerIndex}]`)
        }

        if (!offer.location_ids || !Array.isArray(offer.location_ids) || offer.location_ids.length === 0) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/location_ids`
          errorObj[key] = `Location IDs array is mandatory for offers[${offerIndex}]`
          logger.error(`Location IDs array is mandatory for offers[${offerIndex}]`)
        }

        if (!offer.item_ids || !Array.isArray(offer.item_ids) || offer.item_ids.length === 0) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/item_ids`
          errorObj[key] = `Item IDs array is mandatory for offers[${offerIndex}]`
          logger.error(`Item IDs array is mandatory for offers[${offerIndex}]`)
        }

        if (!offer.time || !offer.time.label || !offer.time.range || !offer.time.range.start || !offer.time.range.end) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/time`
          errorObj[key] = `Time object with label and range (start/end) is mandatory for offers[${offerIndex}]`
          logger.error(`Time object with label and range (start/end) is mandatory for offers[${offerIndex}]`)
        }

        const tags = offer.tags
        if (!tags || !Array.isArray(tags)) {
          const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags`
          errorObj[key] =
            `Tags must be provided for offers[${offerIndex}] with descriptor code '${offer.descriptor?.code}'`
          logger.error(
            `Tags must be provided for offers[${offerIndex}] with descriptor code '${offer.descriptor?.code}'`,
          )
          return
        }
        const metaTagsError = validateMetaTags(tags)
        if (metaTagsError) {
          let i = 0
          const len = metaTagsError.length
          while (i < len) {
            const key = `metaTagsError${i}`
            errorObj[key] = `${metaTagsError[i]}`
            i++
          }
        }

        // Validate based on offer type
        switch (offer.descriptor?.code) {
          case 'discount':
            // Validate 'qualifier'
            const qualifierDiscount = tags.find((tag: any) => tag.code === 'qualifier')
            if (!qualifierDiscount || !qualifierDiscount.list.some((item: any) => item.code === 'min_value')) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitDiscount = tags.find((tag: any) => tag.code === 'benefit')
            if (!benefitDiscount) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag is required for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'benefit' tag is required for offers[${offerIndex}]`)
            } else {
              const valueTypeItem = benefitDiscount.list.find((item: any) => item.code === 'value_type')
              const valueItem = benefitDiscount.list.find((item: any) => item.code === 'value')
              const valueCapItem = benefitDiscount.list.find((item: any) => item.code === 'value_cap')

              if (!valueTypeItem) {
                const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]/value_type`
                errorObj[key] = `'value_type' is required in benefit tag for offers[${offerIndex}]`
                logger.error(`'value_type' is required in benefit tag for offers[${offerIndex}]`)
              }

              if (!valueItem) {
                const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]/value`
                errorObj[key] = `'value' is required in benefit tag for offers[${offerIndex}]`
                logger.error(`'value' is required in benefit tag for offers[${offerIndex}]`)
              } else {
                // Validate value is a proper number
                const value = valueItem.value
                if (isNaN(parseFloat(value)) || !/^-?\d+(\.\d+)?$/.test(value)) {
                  const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]/value`
                  errorObj[key] = `'value' in benefit tag must be a valid number for offers[${offerIndex}]`
                  logger.error(`'value' in benefit tag must be a valid number for offers[${offerIndex}]`)
                } else if (parseFloat(value) >= 0) {
                  const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]/value`
                  errorObj[key] = `'value' in 'benefit' tag must be a negative amount for offers[${offerIndex}]`
                  logger.error(`'value' in 'benefit' tag must be a negative amount for offers[${offerIndex}]`)
                }
              }

              // Validate value_cap if present
              if (valueCapItem) {
                const valueCap = valueCapItem.value
                if (isNaN(parseFloat(valueCap)) || !/^-?\d+(\.\d+)?$/.test(valueCap)) {
                  const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]/value_cap`
                  errorObj[key] = `'value_cap' in benefit tag must be a valid number for offers[${offerIndex}]`
                  logger.error(`'value_cap' in benefit tag must be a valid number for offers[${offerIndex}]`)
                }
              }
            }
            break

          case 'buyXgetY':
            // Validate 'qualifier'
            const qualifierBuyXgetY = tags.find((tag: any) => tag.code === 'qualifier')
            if (
              !qualifierBuyXgetY ||
              !qualifierBuyXgetY.list.some((item: any) => item.code === 'min_value') ||
              !qualifierBuyXgetY.list.some((item: any) => item.code === 'item_count')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' and 'item_count' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' and 'item_count' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitBuyXgetY = tags.find((tag: any) => tag.code === 'benefit')
            if (!benefitBuyXgetY || !benefitBuyXgetY.list.some((item: any) => item.code === 'item_count')) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag must include 'item_count' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'benefit' tag must include 'item_count' for offers[${offerIndex}]`)
            }
            break

          case 'freebie':
            // Validate 'qualifier'
            const qualifierFreebie = tags.find((tag: any) => tag.code === 'qualifier')
            if (!qualifierFreebie || !qualifierFreebie.list.some((item: any) => item.code === 'min_value')) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitFreebie = tags.find((tag: any) => tag.code === 'benefit')
            if (
              !benefitFreebie ||
              !benefitFreebie.list.some((item: any) => item.code === 'item_count') ||
              !benefitFreebie.list.some((item: any) => item.code === 'item_id') ||
              !benefitFreebie.list.some((item: any) => item.code === 'item_value')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag must include 'item_count', 'item_id', and 'item_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(
                `'benefit' tag must include 'item_count', 'item_id', and 'item_value' for offers[${offerIndex}]`,
              )
            }
            break

          case 'slab':
            // Validate 'qualifier'
            const qualifierSlab = tags.find((tag: any) => tag.code === 'qualifier')
            if (!qualifierSlab || !qualifierSlab.list.some((item: any) => item.code === 'min_value')) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitSlab = tags.find((tag: any) => tag.code === 'benefit')
            if (
              !benefitSlab ||
              !benefitSlab.list.some((item: any) => item.code === 'value') ||
              !benefitSlab.list.some((item: any) => item.code === 'value_type') ||
              !benefitSlab.list.some((item: any) => item.code === 'value_cap')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag must include 'value', 'value_type', and 'value_cap' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(
                `'benefit' tag must include 'value', 'value_type', and 'value_cap' for offers[${offerIndex}]`,
              )
            }
            break

          case 'combo':
            // Validate 'qualifier'
            const qualifierCombo = tags.find((tag: any) => tag.code === 'qualifier')
            if (
              !qualifierCombo ||
              !qualifierCombo.list.some((item: any) => item.code === 'min_value') ||
              !qualifierCombo.list.some((item: any) => item.code === 'item_id')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' and 'item_id' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' and 'item_id' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitCombo = tags.find((tag: any) => tag.code === 'benefit')
            if (
              !benefitCombo ||
              !benefitCombo.list.some((item: any) => item.code === 'value') ||
              !benefitCombo.list.some((item: any) => item.code === 'value_type') ||
              !benefitCombo.list.some((item: any) => item.code === 'value_cap')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag must include 'value', 'value_type', and 'value_cap' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(
                `'benefit' tag must include 'value', 'value_type', and 'value_cap' for offers[${offerIndex}]`,
              )
            }
            break

          case 'delivery':
            // Validate 'qualifier'
            const qualifierDelivery = tags.find((tag: any) => tag.code === 'qualifier')
            if (!qualifierDelivery || !qualifierDelivery.list.some((item: any) => item.code === 'min_value')) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
              errorObj[key] =
                `'qualifier' tag must include 'min_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'qualifier' tag must include 'min_value' for offers[${offerIndex}]`)
            }

            // Validate 'benefit'
            const benefitDelivery = tags.find((tag: any) => tag.code === 'benefit')
            if (
              !benefitDelivery ||
              !benefitDelivery.list.some((item: any) => item.code === 'value') ||
              !benefitDelivery.list.some((item: any) => item.code === 'value_type')
            ) {
              const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
              errorObj[key] =
                `'benefit' tag must include 'value' and 'value_type' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
              logger.error(`'benefit' tag must include 'value' and 'value_type' for offers[${offerIndex}]`)
            }
            break

          case 'exchange':
            // Validate 'qualifier'
            // const qualifierExchange = tags.find((tag: any) => tag.code === 'qualifier')
            // if (!qualifierExchange || !qualifierExchange.list.some((item: any) => item.code === 'min_value')) {
            //   const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[qualifier]`
            //   errorObj[key] =
            //     `'qualifier' tag must include 'min_value' for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
            //   logger.error(`'qualifier' tag must include 'min_value' for offers[${offerIndex}]`)
            // }

            // // Validate that benefits should not exist or should be empty
            // const benefitExchange = tags.find((tag: any) => tag.code === 'benefit')
            // if (benefitExchange && benefitExchange.list.length > 0) {
            //   const key = `bpp/providers[${i}]/offers[${offerIndex}]/tags[benefit]`
            //   errorObj[key] =
            //     `'benefit' tag must not include any values for offers[${offerIndex}] when offer.descriptor.code = ${offer.descriptor.code}`
            //   logger.error(`'benefit' tag must not include any values for offers[${offerIndex}]`)
            // }
            if (context.domain !== 'ONDC:RET14' || context.domain !== 'ONDC:RET15') {
              errorObj['unsupportedDomain'] =
                `exchange is not possible for ${context.domain} as supported domains are 'ONDC:RET14','ONDC:RET15' is required for flow: ${flow}`
            }
            break
          case 'financing':
            let collect_payment_value = collect_payment_tags?.value
            if (flow === FLOW.FLOW0099 || collect_payment_value === 'no') {
              const financeTagsError = validateFinanceTags(tags)
              if (financeTagsError) {
                let i = 0
                const len = financeTagsError.length
                while (i < len) {
                  const key = `financeTagsError${i}`
                  errorObj[key] = `${financeTagsError[i]}`
                  i++
                }
              }
            }
            break
          default:
            logger.info(`No specific validation required for offer type: ${offer.descriptor?.code}`)
        }
      })
    }
  } catch (error: any) {
    logger.error(`Error while checking offers under bpp/providers: ${error.stack}`)
  }
  // Checking price of items in bpp/providers
  try {
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any, i: number) => {
      const items = provider.items
      items.forEach((item: any, j: number) => {
        if (item.price && item.price.value) {
          const priceValue = parseFloat(item.price.value)
          if (priceValue < 1) {
            const key = `prvdr${i}item${j}price`
            errorObj[key] = `item.price.value should be greater than 0`
          }
        }
      })
    })
  } catch (error: any) {
    logger.error(`Error while checking price of items in bpp/providers for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Mapping items with thier respective providers
  try {
    const itemProviderMap: any = {}
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any) => {
      const items = provider.items
      const itemArray: any = []
      items.forEach((item: any) => {
        itemArray.push(item.id)
      })
      itemProviderMap[provider.id] = itemArray
    })

    setValue('itemProviderMap', itemProviderMap)
  } catch (e: any) {
    logger.error(`Error while mapping items with thier respective providers ${e.stack}`)
  }

  // Checking for quantity of items in bpp/providers
  try {
    logger.info(`Checking for quantity of items in bpp/providers for /${constants.ON_SEARCH}`)
    const providers = onSearchCatalog['bpp/providers']
    providers.forEach((provider: any, i: number) => {
      const items = provider.items
      function getProviderCreds() {
        return providers.map((provider: any) => {
          const creds = provider?.creds
          if ((flow === FLOW.FLOW017 && creds === undefined) || creds.length === 0) {
            errorObj['MissingCreds'] = `creds must be present in order in /${constants.ON_SEARCH}`
          }

          return {
            providerId: provider.id,
            creds,
          }
        })
      }

      const result = getProviderCreds()
      setValue('credsWithProviderId', result)

      items.forEach((item: any, j: number) => {
        if (item.quantity && item.quantity.available && typeof item.quantity.available.count === 'string') {
          const availCount = parseInt(item.quantity.available.count, 10)
          const maxCount = parseInt(item.quantity.maximum.count, 10)
          const minCount = parseInt(item.quantity.minimum.count, 10)
          if (!minCount) {
            const key = `prvdr${i}item${j}minimum.count`
            errorObj[key] = `item.quantity.minimum.count must be added , if not set default as 99 `
          }
          if (item.quantity.unitized.measure.value < 1) {
            const key = `prvdr${i}item${j}unitized`
            errorObj[key] = `item.quantity.unitized.measure.value should be greater than 0`
          }
          if (availCount < 0 || maxCount < 0) {
            const key = `prvdr${i}item${j}invldCount`
            errorObj[key] =
              `item.quantity.available.count and item.quantity.maximum.count should be greater than or equal to 0`
          }
        }
      })
    })
  } catch (error: any) {
    logger.error(`Error while checking quantity of items in bpp/providers for /${constants.ON_SEARCH}, ${error.stack}`)
  }

  // Checking for items categoryId and it's mapping with statutory_reqs
  if (getValue('domain') === 'RET10') {
    try {
      logger.info(
        `Checking for items categoryId and it's mapping with statutory_reqs in bpp/providers for /${constants.ON_SEARCH}`,
      )
      const providers = onSearchCatalog['bpp/providers']
      providers.forEach((provider: any, i: number) => {
        const items = provider.items
        items.forEach((item: any, j: number) => {
          if (!_.isEmpty(item?.category_id)) {
            const statutoryRequirement: any = getStatutoryRequirement(item.category_id)
            let errors: any
            switch (statutoryRequirement) {
              case statutory_reqs.PrepackagedFood:
                errors = checkForStatutory(item, i, j, errorObj, statutory_reqs.PrepackagedFood)
                break
              case statutory_reqs.PackagedCommodities:
                errors = checkForStatutory(item, i, j, errorObj, statutory_reqs.PackagedCommodities)
                break
              case statutory_reqs.None:
                break
              default:
                const key = `prvdr${i}item${j}statutoryReq`
                errorObj[key] =
                  `The following item/category_id is not a valid one in bpp/providers for /${constants.ON_SEARCH}`
                break
            }
            Object.assign(errorObj, errors)
          }
        })
      })
    } catch (error: any) {
      logger.error(
        `Error while checking for items categoryId and it's mapping with statutory_reqs in bpp/providers for /${constants.ON_SEARCH}, ${error.stack}`,
      )
    }
  }

  // Checking for duplicate varient in bpp/providers/items for on_search
  // try {
  //   logger.info(`Checking for duplicate varient in bpp/providers/items for on_search`)
  //   for (let i in onSearchCatalog['bpp/providers']) {
  //     const varientPath: any = findVariantPath(onSearchCatalog['bpp/providers'][i].categories)
  //     const items = onSearchCatalog['bpp/providers'][i].items
  //     const map = checkDuplicateParentIdItems(items)
  //     for (let key in map) {
  //       if (map[key].length > 1) {
  //         const item = varientPath.find((item: any) => {
  //           return item.item_id === key
  //         })
  //         const pathForVarient = item.paths
  //         let valueArray = []
  //         if (pathForVarient.length) {
  //           for (let j = 0; j < map[key].length; j++) {
  //             let itemValues: any = {}
  //             for (let path of pathForVarient) {
  //               if (path === 'item.quantity.unitized.measure') {
  //                 const unit = map[key][j].quantity.unitized.measure.unit
  //                 const value = map[key][j].quantity.unitized.measure.value
  //                 itemValues['unit'] = unit
  //                 itemValues['value'] = value
  //               } else {
  //                 const val = findValueAtPath(path, map[key][j])
  //                 itemValues[path.split('.').pop()] = val
  //               }
  //             }
  //             valueArray.push(itemValues)
  //           }
  //           checkForDuplicates(valueArray, errorObj)
  //         }
  //       }
  //     }
  //   }
  // } catch (error: any) {
  //   logger.error(`!!Errors while checking parent_item_id in bpp/providers/[]/items/[]/parent_item_id/, ${error.stack}`)
  // }

  try {
    logger.info(`Checking Providers info (bpp/providers) in /${constants.ON_SEARCH}`)
    let i = 0
    const bppPrvdrs = onSearchCatalog['bpp/providers']
    const len = bppPrvdrs.length
    const tmpstmp = context.timestamp

    while (i < len) {
      const categoriesId = new Set()
      const customGrpId = new Set()
      const seqSet = new Set()
      const itemCategory_id = new Set()
      const categoryRankSet = new Set()
      const prvdrLocationIds = new Set()
      const prvdr = bppPrvdrs[i]

      logger.info(`Checking store enable/disable timestamp in bpp/providers[${i}]`)
      try {
        if (prvdr.time) {
          const providerTime = new Date(prvdr.time.timestamp).getTime()
          const contextTimestamp = new Date(tmpstmp).getTime()
          if (providerTime > contextTimestamp) {
            errorObj.StoreEnableDisable = `store enable/disable timestamp (/bpp/providers/time/timestamp) should be less then or equal to context.timestamp`
          }
        }
      } catch (error: any) {
        logger.error(`Error while checking store enable/disable timestamp in bpp/providers[${i}]`, error)
      }

      logger.info(`Checking store timings in bpp/providers[${i}]`)

      prvdr.locations.forEach((loc: any, iter: any) => {
        try {
          logger.info(`Checking gps precision of store location in /bpp/providers[${i}]/locations[${iter}]`)
          const has = Object.prototype.hasOwnProperty
          if (has.call(loc, 'gps')) {
            if (!checkGpsPrecision(loc.gps)) {
              errorObj.gpsPrecision = `/bpp/providers[${i}]/locations[${iter}]/gps coordinates must be specified with at least 4 decimal places of precision.`
            }
          }
        } catch (error) {
          logger.error(
            `!!Error while checking gps precision of store location in /bpp/providers[${i}]/locations[${iter}]`,
            error,
          )
        }

        try {
          if (prvdrLocId.has(loc?.id)) {
            const key = `prvdr${i}${loc.id}${iter}`
            errorObj[key] = `duplicate location id: ${loc.id} in /bpp/providers[${i}]/locations[${iter}]`
          } else {
            prvdrLocId.add(loc.id)
          }
          prvdrLocationIds.add(loc?.id)
          logger.info('Checking store days...')
          const days = loc?.time?.days?.split(',')
          days.forEach((day: any) => {
            day = parseInt(day)
            if (isNaN(day) || day < 1 || day > 7) {
              const key = `prvdr${i}locdays${iter}`
              errorObj[key] =
                `store days (bpp/providers[${i}]/locations[${iter}]/time/days) should be in the format ("1,2,3,4,5,6,7") where 1- Monday and 7- Sunday`
            }
          })

          logger.info('Checking fixed or split timings')

          //scenario 1: range =1 freq/times =1
          if (loc?.time?.range && (loc.time?.schedule?.frequency || loc.time?.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed (range) or split (frequency and times) timings should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          // scenario 2: range=0 freq || times =1
          if (!loc?.time?.range && (!loc?.time?.schedule?.frequency || !loc?.time?.schedule?.times)) {
            const key = `prvdr${i}loctime${iter}`
            errorObj[key] =
              `Either one of fixed timings (range) or split timings (both frequency and times) should be provided in /bpp/providers[${i}]/locations[${iter}]/time`
          }

          //scenario 3: range=1 (start and end not compliant) frequency=0;
          if ('range' in loc.time) {
            logger.info('checking range (fixed timings) start and end')
            const startTime: any = 'start' in loc?.time?.range ? parseInt(loc?.time?.range?.start) : ''
            const endTime: any = 'end' in loc?.time?.range ? parseInt(loc?.time?.range?.end) : ''
            if (isNaN(startTime) || isNaN(endTime) || startTime > endTime || endTime > 2359) {
              errorObj.startEndTime = `end time must be greater than start time in fixed timings /locations/time/range (fixed store timings)`
            }
          }
        } catch (error: any) {
          logger.error(`Validation error for frequency: ${error.stack}`)
        }
      })

      try {
        logger.info(`Checking for upcoming holidays`)
        const location = onSearchCatalog['bpp/providers'][i]['locations']
        if (!location) {
          logger.error('No location detected ')
        }

        const scheduleObject = location[i].time.schedule.holidays
        const timestamp = context.timestamp
        const [currentDate] = timestamp.split('T')

        scheduleObject.map((date: string) => {
          const dateObj = new Date(date)
          const currentDateObj = new Date(currentDate)
          if (dateObj.getTime() < currentDateObj.getTime()) {
            const key = `/message/catalog/bpp/providers/loc${i}/time/schedule/holidays`
            errorObj[key] = `Holidays cannot be past ${currentDate}`
          }
        })
      } catch (e) {
        logger.error('No Holiday', e)
      }

      try {
        logger.info(`Checking categories for provider (${prvdr.id}) in bpp/providers[${i}]`)
        let j = 0
        const categories = onSearchCatalog['bpp/providers'][i]['categories']
        if (!categories || !categories.length) {
          const key = `prvdr${i}categories`
          errorObj[key] = `Support for variants is mandatory, categories must be present in bpp/providers[${i}]`
        }
        const iLen = categories?.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for categories id in bpp/providers[${i}].items[${j}]...`)
          const category = categories[j]

          const fulfillments = onSearchCatalog['bpp/providers'][i]['fulfillments']
          const phoneNumber = fulfillments[i].contact.phone

          if (!isValidPhoneNumber(phoneNumber)) {
            const key = `bpp/providers${i}fulfillments${i}`
            errorObj[key] =
              `Please enter a valid phone number consisting of  10 or  11 digits without any spaces or special characters. `
          }

          if (categoriesId.has(category.id)) {
            const key = `prvdr${i}category${j}`
            errorObj[key] = `duplicate category id: ${category.id} in bpp/providers[${i}]`
          } else {
            categoriesId.add(category.id)
          }

          try {
            category.tags.map((tag: { code: any; list: any[] }, index: number) => {
              switch (tag.code) {
                case 'attr':
                  const attrList = tag.list.find((item) => item.code === 'name')
                  if (attrList) {
                    const isValid =
                      attrList.value === 'item.quantity.unitized.measure' ||
                      attrList.value.startsWith('item.tags.attribute')

                    if (!isValid) {
                      const key = `prvdr${i}category${j}tags${index}`
                      errorObj[key] =
                        `list.code == attr then name should be 'item.quantity.unitized.measure' or 'item.tags.attribute.{object.keys}' in bpp/providers[${i}]`
                    }
                  }
                  break
                case 'type':
                  const codeList = tag.list.find((item) => item.code === 'type')
                  if (
                    !(
                      codeList.value === 'custom_menu' ||
                      codeList.value === 'custom_group' ||
                      codeList.value === 'variant_group'
                    )
                  ) {
                    const key = `prvdr${i}category${j}tags${index}`
                    errorObj[key] =
                      `list.code == type then value should be one of 'custom_menu','custom_group' and 'variant_group' in bpp/providers[${i}]`
                  }

                  if (codeList.value === 'custom_group') {
                    customGrpId.add(category.id)
                  }

                  break
                case 'timing':
                  for (const item of tag.list) {
                    switch (item.code) {
                      case 'day_from':
                      case 'day_to':
                        const dayValue = parseInt(item.value)
                        if (isNaN(dayValue) || dayValue < 1 || dayValue > 7 || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                          errorObj.custom_menu_timing_tag = `Invalid value for '${item.code}': ${item.value}`
                        }

                        break
                      case 'time_from':
                      case 'time_to':
                        if (!/^([01]\d|2[0-3])[0-5]\d$/.test(item.value)) {
                          errorObj.time_to = `Invalid time format for '${item.code}': ${item.value}`
                        }

                        break
                      default:
                        errorObj.Tagtiming = `Invalid list.code for 'timing': ${item.code}`
                    }
                  }

                  const dayFromItem = tag.list.find((item: any) => item.code === 'day_from')
                  const dayToItem = tag.list.find((item: any) => item.code === 'day_to')
                  const timeFromItem = tag.list.find((item: any) => item.code === 'time_from')
                  const timeToItem = tag.list.find((item: any) => item.code === 'time_to')

                  if (dayFromItem && dayToItem && timeFromItem && timeToItem) {
                    const dayFrom = parseInt(dayFromItem.value, 10)
                    const dayTo = parseInt(dayToItem.value, 10)
                    const timeFrom = parseInt(timeFromItem.value, 10)
                    const timeTo = parseInt(timeToItem.value, 10)

                    if (dayTo < dayFrom) {
                      errorObj.day_from = "'day_to' must be greater than or equal to 'day_from'"
                    }

                    if (timeTo <= timeFrom) {
                      errorObj.time_from = "'time_to' must be greater than 'time_from'"
                    }
                  }

                  break
                case 'display':
                  for (const item of tag.list) {
                    if (item.code !== 'rank' || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                      errorObj.rank = `Invalid value for 'display': ${item.value}`
                    } else {
                      if (categoryRankSet.has(category.id)) {
                        const key = `prvdr${i}category${j}rank`
                        errorObj[key] = `duplicate rank in category id: ${category.id} in bpp/providers[${i}]`
                      } else {
                        categoryRankSet.add(category.id)
                      }
                    }
                  }

                  break
                case 'config':
                  const minItem: any = tag.list.find((item: { code: string }) => item.code === 'min')
                  const maxItem: any = tag.list.find((item: { code: string }) => item.code === 'max')
                  const inputItem: any = tag.list.find((item: { code: string }) => item.code === 'input')
                  const seqItem: any = tag.list.find((item: { code: string }) => item.code === 'seq')

                  if (!minItem || !maxItem) {
                    errorObj[`customization_config_${j}`] =
                      `Both 'min' and 'max' values are required in 'config' at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(minItem.value)) {
                    errorObj[`customization_config_min_${j}`] =
                      `Invalid value for ${minItem.code}: ${minItem.value} at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(maxItem.value)) {
                    errorObj[`customization_config_max_${j}`] =
                      `Invalid value for ${maxItem.code}: ${maxItem.value}at index: ${j}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(seqItem.value)) {
                    errorObj[`config_seq_${j}`] = `Invalid value for ${seqItem.code}: ${seqItem.value} at index: ${j}`
                  }

                  const inputEnum = ['select', 'text']
                  if (!inputEnum.includes(inputItem.value)) {
                    errorObj[`config_input_${j}`] =
                      `Invalid value for 'input': ${inputItem.value}, it should be one of ${inputEnum} at index: ${j}`
                  }

                  break
              }
            })
            logger.info(`Category '${category.descriptor.name}' is valid.`)
          } catch (error: any) {
            logger.error(`Validation error for category '${category.descriptor.name}': ${error.message}`)
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking categories in bpp/providers[${i}], ${error.stack}`)
      }
      try {
        const fulfillments:any = onSearchCatalog['bpp/providers'][i]['fulfillments']
        fulfillments.forEach((fulfillment:any) => {

          const hasSelfPickupFulfillment = fulfillments.some((f:any) => f.type === 'Self-Pickup')

          const selfPickupTag = fulfillment.tags?.find(
            (tag:any) =>
              tag.code === 'timing' && tag.list?.some((item:any) => item.code === 'type' && item.value === 'Self-Pickup'),
          )

          if (flow === '002') {
            // Flow is 002 => Self-Pickup fulfillment is required
            if (!hasSelfPickupFulfillment) {
              const key = `prvdr${i}fulfillment_self_pickup_required`
              errorObj[key] = `Provider[${i}] with flow=002 must have at least one fulfillment of type 'Self-Pickup'`
            }
          } else {
            // For all other flows => Self-Pickup timing tag is required and must be valid
            if (!selfPickupTag) {
              const key = `prvdr${i}tag_self_pickup_required`
              errorObj[key] = `Provider[${i}] with flow≠002 must have a 'timing' tag with list.type='Self-Pickup'`
            } else {
              // const timingKeys = ['day_from', 'day_to', 'time_from', 'time_to']
              const tagListMap = Object.fromEntries(selfPickupTag.list.map((t: any) => [t.code, t.value]))
              const locationId = tagListMap['location']

              if (locationId) {

                if (!prvdrLocId.has(locationId)) {
                  const key = `prvdr${i}tag_timing_invalid_location`
                  errorObj[key] =
                    `'location' in Self-Pickup timing tag must match one of the provider[${i}]'s location ids`
                }
              } else {
                const key = `prvdr${i}tag_timing_missing_location`
                errorObj[key] = `'location' is missing in Self-Pickup timing tag for provider[${i}]`
              }

              // Validate day_from/to are between 1 and 7
              ;['day_from', 'day_to'].forEach((code) => {
                const val = parseInt(tagListMap[code])
                if (isNaN(val) || val < 1 || val > 7) {
                  const key = `prvdr${i}tag_timing_invalid_${code}`
                  errorObj[key] = `Invalid value for ${code}: ${tagListMap[code]} in Self-Pickup timing tag`
                }
              })

              // Validate time_from/to format
              ;['time_from', 'time_to'].forEach((code) => {
                const val = tagListMap[code]
                if (!/^([01]\d|2[0-3])[0-5]\d$/.test(val)) {
                  const key = `prvdr${i}tag_timing_invalid_${code}`
                  errorObj[key] = `Invalid format for ${code}: ${val} in Self-Pickup timing tag (expected HHMM)`
                }
              })

              // Additional validation: time_to > time_from
              const tFrom = parseInt(tagListMap['time_from'])
              const tTo = parseInt(tagListMap['time_to'])
              if (!isNaN(tFrom) && !isNaN(tTo) && tTo <= tFrom) {
                const key = `prvdr${i}tag_timing_time_order`
                errorObj[key] = `'time_to' (${tTo}) must be greater than 'time_from' (${tFrom}) for Self-Pickup`
              }
            }
          }
        })
      } catch (error:any) {
        logger.error(`!!Errors while checking fulfillments in bpp/providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`Checking items for provider (${prvdr.id}) in bpp/providers[${i}]`)
        let j = 0
        const items = onSearchCatalog['bpp/providers'][i]['items']

        const iLen = items.length
        while (j < iLen) {
          logger.info(`Validating uniqueness for item id in bpp/providers[${i}].items[${j}]...`)
          const item = items[j]

          if (itemsId.has(item.id)) {
            const key = `prvdr${i}item${j}`
            errorObj[key] = `duplicate item id: ${item.id} in bpp/providers[${i}]`
          } else {
            itemsId.add(item.id)
          }

          if ('category_id' in item) {
            itemCategory_id.add(item.category_id)
          }
          try {
            if ('category_ids' in item) {
              item[`category_ids`].map((category: string, index: number) => {
                const categoryId = category.split(':')[0]
                const seq = category.split(':')[1]

                if (seqSet.has(seq)) {
                  const key = `prvdr${i}item${j}ctgryseq${index}`
                  errorObj[key] = `duplicate seq : ${seq} in category_ids in prvdr${i}item${j}`
                } else {
                  seqSet.add(seq)
                }

                if (!categoriesId.has(categoryId)) {
                  const key = `prvdr${i}item${j}ctgryId${index}`
                  errorObj[key] = `item${j} should have category_ids one of the Catalog/categories/id`
                }
              })
            }
          } catch (error: any) {
            logger.error(`Error while checking category_ids for item id: ${item.id}, ${error.stack}`)
          }

          try {
            logger.info(`Checking selling price and maximum price for item id: ${item.id}`)

            const statutory_reqs_prepackaged_food =
              onSearchCatalog['bpp/providers'][i]['items'][j]['@ondc/org/statutory_reqs_prepackaged_food']

            if (context.domain === 'ONDC:RET18') {
              if (!statutory_reqs_prepackaged_food.ingredients_info) {
                const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
                errorObj[key] =
                  `In ONDC:RET18 for @ondc/org/statutory_reqs_prepackaged_food  ingredients_info is a valid field `
              }
            } else if (context.domain === 'ONDC:RET10') {
              const mandatoryFields = [
                'nutritional_info',
                'additives_info',
                'brand_owner_FSSAI_license_no',
                'other_FSSAI_license_no',
                'importer_FSSAI_license_no',
              ]
              mandatoryFields.forEach((field) => {
                if (statutory_reqs_prepackaged_food && !statutory_reqs_prepackaged_food[field]) {
                  const key = `prvdr${i}items${j}@ondc/org/statutory_reqs_prepackaged_food`
                  errorObj[key] =
                    `In ONDC:RET10 @ondc/org/statutory_reqs_prepackaged_food following fields are valid and required 'nutritional_info', 'additives_info','other_FSSAI_license_no',
                    'brand_owner_FSSAI_license_no','importer_FSSAI_license_no'`
                }
              })
            }
          } catch (error: any) {
            logger.error(`Error while checking selling price and maximum price for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if (item.quantity && item.quantity.maximum && typeof item.quantity.maximum.count === 'string') {
              const maxCount = parseInt(item.quantity.maximum.count, 10)
              const availCount = parseInt(item.quantity.available.count, 10)
              if (availCount == 99 && maxCount <= 0) {
                const key = `prvdr${i}item${j}maxCount`
                errorObj[key] =
                  `item.quantity.maximum.count should be either default value 99 (no cap per order) or any other positive value (cap per order) in /bpp/providers[${i}]/items[${j}]`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking available and max quantity for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if (item.quantity && item.quantity.maximum && typeof item.quantity.maximum.count === 'string') {
              const maxCount = parseInt(item.quantity.maximum.count, 10)
              const availCount = parseInt(item.quantity.available.count, 10)
              if (availCount == 99 && maxCount == 0) {
                const key = `prvdr${i}item${j}maxCount`
                errorObj[key] = `item.quantity.maximum.count cant be 0 if item is in stock `
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking available and max quantity for item id: ${item.id}, ${error.stack}`)
          }

          try {
            if ('price' in item) {
              const sPrice = parseFloat(item.price.value)
              const maxPrice = parseFloat(item.price.maximum_value)

              if (sPrice > maxPrice) {
                const key = `prvdr${i}item${j}Price`
                errorObj[key] =
                  `selling price of item /price/value with id: (${item.id}) can't be greater than the maximum price /price/maximum_value in /bpp/providers[${i}]/items[${j}]/`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking selling price and maximum price for item id: ${item.id}, ${error.stack}`)
          }

          try {
            logger.info(`Checking fulfillment_id for item id: ${item.id}`)

            if ('price' in item) {
              const upper = parseFloat(item.price?.tags?.[0].list[1].value)
              const lower = parseFloat(item.price?.tags?.[0].list[0].value)

              if (upper > lower) {
                const key = `prvdr${i}item${j}Price/tags/list`
                errorObj[key] =
                  `selling lower range of item /price/range/value with id: (${item.id}) can't be greater than the upper in /bpp/providers[${i}]/items[${j}]/`
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking price range for item id: ${item.id}, error: ${error.stack}`)
          }

          try {
            if (item.fulfillment_id && !onSearchFFIdsArray[i].has(item.fulfillment_id)) {
              const key = `prvdr${i}item${j}ff`
              errorObj[key] =
                `fulfillment_id in /bpp/providers[${i}]/items[${j}] should map to one of the fulfillments id in bpp/prvdr${i}/fulfillments`
            }
          } catch (error: any) {
            logger.error(`Error while checking fulfillment_id for item id: ${item.id}, error: ${error.stack}`)
          }

          try {
            logger.info(`Checking location_id for item id: ${item.id}`)

            if (item.location_id && !prvdrLocId.has(item.location_id)) {
              const key = `prvdr${i}item${j}loc`
              errorObj[key] =
                `location_id in /bpp/providers[${i}]/items[${j}] should be one of the locations id in /bpp/providers[${i}]/locations`
            }
          } catch (error: any) {
            logger.error(`Error while checking location_id for item id: ${item.id}, error: ${error.stack}`)
          }
          try {
            logger.info(`Checking default_selection for F&B RET11 customizations...`)

            const items = getValue('items')

            _.filter(items, (item) => {
              // Check if the item has customizations (tags) and a price range
              if (item.customizations && item.price) {
                const customTags = item.customizations.tags
                const defaultSelection = customTags?.default_selection

                const itemSellingPrice = parseFloat(item.price.value) // Selling price of the item

                // Retrieve the customization selling price and MRP
                const customizationSellingPrice = parseFloat(defaultSelection.value)
                const customizationMRP = parseFloat(defaultSelection.maximum_value)

                // Calculate the expected selling price and MRP for the customization + item
                const expectedSellingPrice = customizationSellingPrice + itemSellingPrice
                const expectedMRP = customizationMRP + itemSellingPrice

                // Validation: Ensure that default_selection.value matches selling price of customization + item
                if (defaultSelection.value !== expectedSellingPrice) {
                  const key = `item${item.id}CustomTags/default_selection/value`
                  errorObj[key] =
                    `The selling price of customization + item for id: ${item.id} does not match the expected value (${expectedSellingPrice}).`
                }

                // Validation: Ensure that default_selection.maximum_value matches MRP of customization + item
                if (defaultSelection.maximum_value !== expectedMRP) {
                  const key = `item${item.id}CustomTags/default_selection/maximum_value`
                  errorObj[key] =
                    `The MRP of customization + item for id: ${item.id} does not match the expected MRP (${expectedMRP}).`
                }

                logger.info(`Checked default_selection for item id: ${item.id}`)
              }
            })
          } catch (error: any) {
            logger.error(`Error while checking default_selection for items, ${error.stack}`)
          }

          try {
            logger.info(`Checking consumer care details for item id: ${item.id}`)
            if ('@ondc/org/contact_details_consumer_care' in item) {
              let consCare = item['@ondc/org/contact_details_consumer_care']

              consCare = consCare.split(',')

              if (!isValidPhoneNumber(consCare[2])) {
                const key = `prvdr${i}consCare`
                errorObj[key] =
                  `@ondc/org/contact_details_consumer_care contactno should consist of  10 or  11 digits without any spaces or special characters in /bpp/providers[${i}]/items`
              }

              if (consCare.length < 3) {
                const key = `prvdr${i}consCare`
                errorObj[key] =
                  `@ondc/org/contact_details_consumer_care should be in the format "name,email,contactno" in /bpp/providers[${i}]/items`
              } else {
                const checkEmail: boolean = emailRegex(consCare[1].trim())
                if (isNaN(consCare[2].trim()) || !checkEmail) {
                  const key = `prvdr${i}consCare`
                  errorObj[key] =
                    `@ondc/org/contact_details_consumer_care email should be in /bpp/providers[${i}]/items`
                }
              }
            }
          } catch (error: any) {
            logger.error(`Error while checking consumer care details for item id: ${item.id}, ${error.stack}`)
          }

          try {
            item.tags.map((tag: { code: any; list: any[] }, index: number) => {
              switch (tag.code) {
                case 'type':
                  if (
                    tag.list &&
                    Array.isArray(tag.list) &&
                    tag.list.some(
                      (listItem: { code: string; value: string }) =>
                        listItem.code === 'type' && listItem.value === 'item',
                    )
                  ) {
                    if (!item.time) {
                      const key = `prvdr${i}item${j}time`
                      errorObj[key] = `item_id: ${item.id} should contain time object in bpp/providers[${i}]`
                    }
                  }

                  break

                case 'custom_group':
                  tag.list.map((it: { code: string; value: string }, index: number) => {
                    if (!customGrpId.has(it.value)) {
                      const key = `prvdr${i}item${j}tag${index}cstmgrp_id`
                      errorObj[key] =
                        `item_id: ${item.id} should have custom_group_id one of the ids passed in categories bpp/providers[${i}]`
                    }
                  })

                  break

                case 'config':
                  const idList: any = tag.list.find((item: { code: string }) => item.code === 'id')
                  const minList: any = tag.list.find((item: { code: string }) => item.code === 'min')
                  const maxList: any = tag.list.find((item: { code: string }) => item.code === 'max')
                  const seqList: any = tag.list.find((item: { code: string }) => item.code === 'seq')

                  if (!categoriesId.has(idList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_list`
                    errorObj[key] =
                      `value in catalog/items${j}/tags${index}/config/list/ should be one of the catalog/category/ids`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(minList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_min`
                    errorObj[key] = `Invalid value for ${minList.code}: ${minList.value}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(maxList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_max`
                    errorObj[key] = `Invalid value for ${maxList.code}: ${maxList.value}`
                  }

                  if (!/^-?\d+(\.\d+)?$/.test(seqList.value)) {
                    const key = `prvdr${i}item${j}tags${index}config_seq`
                    errorObj[key] = `Invalid value for ${seqList.code}: ${seqList.value}`
                  }

                  break

                case 'timing':
                  for (const item of tag.list) {
                    switch (item.code) {
                      case 'day_from':
                      case 'day_to':
                        const dayValue = parseInt(item.value)
                        if (isNaN(dayValue) || dayValue < 1 || dayValue > 5 || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                          const key = `prvdr${i}item${j}tags${index}timing_day`
                          errorObj[key] = `Invalid value for '${item.code}': ${item.value}`
                        }

                        break
                      case 'time_from':
                      case 'time_to':
                        if (!/^([01]\d|2[0-3])[0-5]\d$/.test(item.value)) {
                          const key = `prvdr${i}item${j}tags${index}timing_time`
                          errorObj[key] = `Invalid time format for '${item.code}': ${item.value}`
                        }

                        break
                      default:
                        errorObj.Tagtiming = `Invalid list.code for 'timing': ${item.code}`
                    }
                  }

                  const dayFromItem = tag.list.find((item: any) => item.code === 'day_from')
                  const dayToItem = tag.list.find((item: any) => item.code === 'day_to')
                  const timeFromItem = tag.list.find((item: any) => item.code === 'time_from')
                  const timeToItem = tag.list.find((item: any) => item.code === 'time_to')

                  if (dayFromItem && dayToItem && timeFromItem && timeToItem) {
                    const dayFrom = parseInt(dayFromItem.value, 10)
                    const dayTo = parseInt(dayToItem.value, 10)
                    const timeFrom = parseInt(timeFromItem.value, 10)
                    const timeTo = parseInt(timeToItem.value, 10)

                    if (dayTo < dayFrom) {
                      const key = `prvdr${i}item${j}tags${index}timing_dayfrom`
                      errorObj[key] = "'day_to' must be greater than or equal to 'day_from'"
                    }

                    if (timeTo <= timeFrom) {
                      const key = `prvdr${i}item${j}tags${index}timing_timefrom`
                      errorObj[key] = "'time_to' must be greater than 'time_from'"
                    }
                  }

                  break

                case 'veg_nonveg':
                  const allowedCodes = ['veg', 'non_veg', 'egg']

                  for (const it of tag.list) {
                    if (it.code && !allowedCodes.includes(it.code)) {
                      const key = `prvdr${i}item${j}tag${index}veg_nonveg`
                      errorObj[key] =
                        `item_id: ${item.id} should have veg_nonveg one of the 'veg', 'non_veg' in bpp/providers[${i}]`
                    }
                  }

                  break
              }
            })
          } catch (error: any) {
            logger.error(`Error while checking tags for item id: ${item.id}`, error)
          }

          j++
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking items in bpp/providers[${i}], ${error.stack}`)
      }

      try {
        logger.info(`checking rank in bpp/providers[${i}].category.tags`)
        const rankSeq = isSequenceValid(seqSet)
        if (rankSeq === false) {
          const key = `prvdr${i}ctgry_tags`
          errorObj[key] = `rank should be in sequence provided in bpp/providers[${i}]/categories/tags/display`
        }
      } catch (error: any) {
        logger.error(`!!Errors while checking rank in bpp/providers[${i}].category.tags, ${error.stack}`)
      }

      // servicability Construct
      try {
        logger.info(`Checking serviceability construct for bpp/providers[${i}]`)
        const tags = onSearchCatalog['bpp/providers'][i]['tags']
        if (!tags || !tags.length) {
          const key = `prvdr${i}tags`
          errorObj[key] = `tags must be present in bpp/providers[${i}]`
        }

        if (tags) {
          const circleRequired = checkServiceabilityType(tags)
          if (circleRequired) {
            const errors = validateLocations(message.catalog['bpp/providers'][i].locations, tags)
            errorObj = { ...errorObj, ...errors }
          }
        }

        //checking for each serviceability construct and matching serviceability constructs with the previous ones
        const serviceabilitySet = new Set()
        const timingSet = new Set()
        tags.forEach((sc: any, t: any) => {
          if (sc.code === 'serviceability') {
            if (serviceabilitySet.has(JSON.stringify(sc))) {
              const key = `prvdr${i}tags${t}`
              errorObj[key] =
                `serviceability construct /bpp/providers[${i}]/tags[${t}] should not be same with the previous serviceability constructs`
            }

            serviceabilitySet.add(JSON.stringify(sc))
            if ('list' in sc) {
              if (sc.list.length < 5) {
                const key = `prvdr${i}tags${t}`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract`
              }

              //checking location
              const loc = sc.list.find((elem: any) => elem && elem.code === 'location')
              if (!loc) {
                const key = `prvdr${i}tags${t}loc`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (location is missing)`
              } else if (typeof loc === 'object' && 'value' in loc) {
                if (!prvdrLocId.has(loc.value)) {
                  const key = `prvdr${i}tags${t}loc`
                  errorObj[key] =
                    `location in serviceability construct should be one of the location ids bpp/providers[${i}]/locations`
                }
              } else {
                const key = `prvdr${i}tags${t}loc`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (location is missing)`
              }

              //checking category
              const ctgry = sc.list.find((elem: any) => elem && elem.code === 'category')
              if (!ctgry) {
                const key = `prvdr${i}tags${t}ctgry`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (category is missing)`
              } else if (typeof ctgry === 'object' && 'value' in ctgry) {
                if (!itemCategory_id.has(ctgry.value)) {
                  const key = `prvdr${i}tags${t}ctgry`
                  errorObj[key] =
                    `category in serviceability construct should be one of the category ids bpp/providers[${i}]/items/category_id`
                }
              } else {
                const key = `prvdr${i}tags${t}ctgry`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (category is missing)`
              }

              //checking type (hyperlocal, intercity or PAN India)
              const type = sc.list.find((elem: any) => elem && elem.code === 'type')
              if (!type) {
                const key = `prvdr${i}tags${t}type`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (type is missing)`
              } else if (typeof type === 'object' && 'value' in type) {
                switch (type.value) {
                  case '10':
                    {
                      //For hyperlocal

                      //checking value
                      const val = sc.list.find((elem: any) => elem && elem.code === 'val')
                      if (!val) {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      } else if (typeof val === 'object' && 'value' in val) {
                        if (isNaN(val.value)) {
                          const key = `prvdr${i}tags${t}valvalue`
                          errorObj[key] =
                            `value should be a number (code:"val") for type 10 (hyperlocal) in /bpp/providers[${i}]/tags[${t}]`
                        }
                      } else {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      }

                      //checking unit
                      const unit = sc.list.find((elem: any) => elem && elem.code === 'unit')
                      if (!unit) {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      } else if (typeof unit === 'object' && 'value' in unit) {
                        if (unit.value != 'km') {
                          const key = `prvdr${i}tags${t}unitvalue`
                          errorObj[key] =
                            `value should be "km" (code:"unit") for type 10 (hyperlocal) in /bpp/providers[${i}]/tags[${t}]`
                        }
                      } else {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      }
                    }

                    break
                  case '11':
                    {
                      //intercity

                      //checking value
                      const val = sc.list.find((elem: any) => elem && elem.code === 'val')
                      if (!val) {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      } else if (typeof val === 'object' && 'value' in val) {
                        const pincodes = val.value.split(/,|-/)
                        pincodes.forEach((pincode: any) => {
                          if (isNaN(pincode) || pincode.length != 6) {
                            const key = `prvdr${i}tags${t}valvalue`
                            errorObj[key] =
                              `value should be a valid range of pincodes (code:"val") for type 11 (intercity) in /bpp/providers[${i}]/tags[${t}]`
                          }
                        })
                      } else {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      }

                      //checking unit
                      const unit = sc.list.find((elem: any) => elem && elem.code === 'unit')
                      if (!unit) {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      } else if (typeof unit === 'object' && 'value' in unit) {
                        if (unit.value != 'pincode') {
                          const key = `prvdr${i}tags${t}unitvalue`
                          errorObj[key] =
                            `value should be "pincode" (code:"unit") for type 11 (intercity) in /bpp/providers[${i}]/tags[${t}]`
                        }
                      } else {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      }
                    }

                    break
                  case '12':
                    {
                      //PAN India

                      //checking value
                      const val = sc.list.find((elem: any) => elem && elem.code === 'val')
                      if (!val) {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      } else if (typeof val === 'object' && 'value' in val) {
                        if (val.value != 'IND') {
                          const key = `prvdr${i}tags${t}valvalue`
                          errorObj[key] =
                            `value should be "IND" (code:"val") for type 12 (PAN India) in /bpp/providers[${i}]tags[${t}]`
                        }
                      } else {
                        const key = `prvdr${i}tags${t}val`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "val")`
                      }

                      //checking unit
                      const unit = sc.list.find((elem: any) => elem && elem.code === 'unit')
                      if (!unit) {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      } else if (typeof unit === 'object' && 'value' in unit) {
                        if (unit.value != 'country') {
                          const key = `prvdr${i}tags${t}unitvalue`
                          errorObj[key] =
                            `value should be "country" (code:"unit") for type 12 (PAN India) in /bpp/providers[${i}]tags[${t}]`
                        }
                      } else {
                        const key = `prvdr${i}tags${t}unit`
                        errorObj[key] =
                          `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (value is missing for code "unit")`
                      }
                    }

                    break
                  default: {
                    const key = `prvdr${i}tags${t}type`
                    errorObj[key] =
                      `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (invalid type "${type.value}")`
                  }
                }
              } else {
                const key = `prvdr${i}tags${t}type`
                errorObj[key] =
                  `serviceability construct /bpp/providers[${i}]/tags[${t}] should be defined as per the API contract (type is missing)`
              }
            }
          }
          if (sc.code === 'timing') {
            if (timingSet.has(JSON.stringify(sc))) {
              const key = `prvdr${i}tags${t}`
              errorObj[key] =
                `timing construct /bpp/providers[${i}]/tags[${t}] should not be same with the previous timing constructs`
            }

            timingSet.add(JSON.stringify(sc))
            const fulfillments = prvdr['fulfillments']
            const fulfillmentTypes = fulfillments.map((fulfillment: any) => fulfillment.type)

            let isOrderPresent = false
            const typeCode = sc?.list.find((item: any) => item.code === 'type')
            if (typeCode) {
              const timingType = typeCode.value
              if (
                timingType === 'Order' ||
                timingType === 'Delivery' ||
                timingType === 'Self-Pickup' ||
                timingType === 'All'
              ) {
                isOrderPresent = true
              } else if (!fulfillmentTypes.includes(timingType)) {
                errorObj[`provider[${i}].timing`] =
                  `The type '${timingType}' in timing tags should match with types in fulfillments array, along with 'Order'`
              }
            }

            if (!isOrderPresent) {
              errorObj[`provider[${i}].tags.timing`] = `'Order' type must be present in timing tags`
            }
          }
        })
        if (isEmpty(serviceabilitySet)) {
          const key = `prvdr${i}tags/serviceability`
          errorObj[key] = `serviceability construct is mandatory in /bpp/providers[${i}]/tags`
        } else if (serviceabilitySet.size != itemCategory_id.size) {
          const key = `prvdr${i}/serviceability`
          errorObj[key] =
            `The number of unique category_id should be equal to count of serviceability in /bpp/providers[${i}]`
        }
        if (isEmpty(timingSet)) {
          const key = `prvdr${i}tags/timing`
          errorObj[key] = `timing construct is mandatory in /bpp/providers[${i}]/tags`
        } else {
          const timingsPayloadArr = new Array(...timingSet).map((item: any) => JSON.parse(item))
          const timingsAll = _.chain(timingsPayloadArr)
            .filter((payload) => _.some(payload.list, { code: 'type', value: 'All' }))
            .value()

          // Getting timings object for 'Delivery', 'Self-Pickup' and 'Order'
          const timingsOther = _.chain(timingsPayloadArr)
            .filter(
              (payload) =>
                _.some(payload.list, { code: 'type', value: 'Order' }) ||
                _.some(payload.list, { code: 'type', value: 'Delivery' }) ||
                _.some(payload.list, { code: 'type', value: 'Self-Pickup' }),
            )
            .value()

          if (timingsAll.length > 0 && timingsOther.length > 0) {
            errorObj[`prvdr${i}tags/timing`] =
              `If the timings of type 'All' is provided then timings construct for 'Order'/'Delivery'/'Self-Pickup' is not required`
          }

          const arrTimingTypes = new Set()

          function checkTimingTag(tag: any) {
            const typeObject = tag.list.find((item: { code: string }) => item.code === 'type')
            const typeValue = typeObject ? typeObject.value : null
            arrTimingTypes.add(typeValue)
            for (const item of tag.list) {
              switch (item.code) {
                case 'day_from':
                case 'day_to':
                  const dayValue = parseInt(item.value)
                  if (isNaN(dayValue) || dayValue < 1 || dayValue > 7 || !/^-?\d+(\.\d+)?$/.test(item.value)) {
                    errorObj[`prvdr${i}/day_to$/${typeValue}`] = `Invalid value for '${item.code}': ${item.value}`
                  }

                  break
                case 'time_from':
                case 'time_to':
                  if (!/^([01]\d|2[0-3])[0-5]\d$/.test(item.value)) {
                    errorObj[`prvdr${i}/tags/time_to/${typeValue}`] =
                      `Invalid time format for '${item.code}': ${item.value}`
                  }
                  break
                case 'location':
                  if (!prvdrLocationIds.has(item.value)) {
                    errorObj[`prvdr${i}/tags/location/${typeValue}`] =
                      `Invalid location value as it's unavailable in location/ids`
                  }
                  break
                case 'type':
                  break
                default:
                  errorObj[`prvdr${i}/tags/tag_timings/${typeValue}`] = `Invalid list.code for 'timing': ${item.code}`
              }
            }

            const dayFromItem = tag.list.find((item: any) => item.code === 'day_from')
            const dayToItem = tag.list.find((item: any) => item.code === 'day_to')
            const timeFromItem = tag.list.find((item: any) => item.code === 'time_from')
            const timeToItem = tag.list.find((item: any) => item.code === 'time_to')

            if (dayFromItem && dayToItem && timeFromItem && timeToItem) {
              const dayFrom = parseInt(dayFromItem.value, 10)
              const dayTo = parseInt(dayToItem.value, 10)
              const timeFrom = parseInt(timeFromItem.value, 10)
              const timeTo = parseInt(timeToItem.value, 10)

              if (dayTo < dayFrom) {
                errorObj[`prvdr${i}/tags/day_from/${typeValue}`] =
                  "'day_to' must be greater than or equal to 'day_from'"
              }

              if (timeTo <= timeFrom) {
                errorObj[`prvdr${i}/tags/time_from/${typeValue}`] = "'time_to' must be greater than 'time_from'"
              }
            }
          }

          if (timingsAll.length > 0) {
            if (timingsAll.length > 1) {
              errorObj[`prvdr${i}tags/timing/All`] = `The timings object for 'All' should be provided once!`
            }
            checkTimingTag(timingsAll[0])
          }

          if (timingsOther.length > 0) {
            timingsOther.forEach((tagTimings: any) => {
              checkTimingTag(tagTimings)
            })
            onSearchFFTypeSet.forEach((type: any) => {
              if (!arrTimingTypes.has(type)) {
                errorObj[`prvdr${i}/tags/timing/${type}`] = `The timings object must be present for ${type} in the tags`
              }
            })
            arrTimingTypes.forEach((type: any) => {
              if (type != 'Order' && type != 'All' && !onSearchFFTypeSet.has(type)) {
                errorObj[`prvdr${i}/tags/timing/${type}`] =
                  `The timings object ${type} is not present in the onSearch fulfillments`
              }
            })
            if (!arrTimingTypes.has('Order')) {
              errorObj[`prvdr${i}/tags/timing/order`] = `The timings object must be present for Order in the tags`
            }
          }
        }
      } catch (error: any) {
        logger.error(`!!Error while checking serviceability construct for bpp / providers[${i}], ${error.stack} `)
      }

      try {
        logger.info(
          `Checking if catalog_link type in message / catalog / bpp / providers[${i}]/tags[1]/list[0] is link or inline`,
        )
        const tags = bppPrvdrs[i].tags

        let list: any = []
        tags.map((data: any) => {
          if (data.code == 'catalog_link') {
            list = data.list
          }
        })

        list.map((data: any) => {
          if (data.code === 'type') {
            if (data.value === 'link') {
              if (bppPrvdrs[0].items) {
                errorObj[`message / catalog / bpp / providers[0]`] =
                  `Items arrays should not be present in message / catalog / bpp / providers[${i}]`
              }
            }
          }
        })
      } catch (error: any) {
        logger.error(`Error while checking the type of catalog_link`)
      }

      i++
    }

    setValue(`${ApiSequence.ON_SEARCH}prvdrLocId`, prvdrLocId)
    setValue(`${ApiSequence.ON_SEARCH}itemsId`, itemsId)

    if (flow === FLOW.FLOW012) {
      const providers = data.message.catalog['bpp/providers']

      providers.forEach((provider: any) => {
        const codItems = provider.items.filter((item: any) => item?.['@ondc/org/available_on_cod'] === true)
        setValue('coditems', codItems)
      })
    }
    if (flow === FLOW.FLOW01F) {
      const descriptor = data.message.catalog['bpp/descriptor']?.tags
      const termsObj = descriptor.find((ele: { code: string }): any => ele.code === 'bpp_terms')
      setValue('bppTerms', termsObj.list)
    }
    if (flow === FLOW.FLOW016) {
      // Flow 016 specific validation - check for custom group in categories
      try {
        logger.info(`Checking for custom group categories in /${constants.ON_SEARCH} for flow 016`)
        const providers = message.catalog['bpp/providers']
        const customGroups: any[] = []

        if (!providers || !Array.isArray(providers) || providers.length === 0) {
          errorObj.missingProviders = `No providers found in /${constants.ON_SEARCH} for flow 016`
        } else {
          let customGroupFound = false

          for (const provider of providers) {
            if (provider.categories && Array.isArray(provider.categories)) {
              for (const category of provider.categories) {
                // Check if the category has the required structure for custom_group
                const isTypeCustomGroup = category.tags?.some(
                  (tag: any) =>
                    tag.code === 'type' &&
                    tag.list?.some((item: any) => item.code === 'type' && item.value === 'custom_group'),
                )

                const hasConfigInput = category.tags?.some(
                  (tag: any) =>
                    tag.code === 'config' &&
                    tag.list?.some((item: any) => item.code === 'input' && item.value === 'text'),
                )

                if (isTypeCustomGroup && hasConfigInput) {
                  customGroupFound = true
                  // Save the custom group for later validation
                  customGroups.push({
                    id: category.id,
                    descriptor: category.descriptor,
                    tags: category.tags,
                  })
                  logger.info(`Found valid custom group category: ${category.id}`)
                }
              }
            }
          }

          if (!customGroupFound) {
            errorObj.missingCustomGroup = `No custom_group category with input type 'text' found in /${constants.ON_SEARCH} for flow 016`
          } else {
            // Save custom groups to DAO for later validation in SELECT
            setValue('flow016_custom_groups', customGroups)
            logger.info(`Saved ${customGroups.length} custom groups for flow 016`)
          }
        }
      } catch (error: any) {
        logger.error(
          `Error while checking custom group categories in /${constants.ON_SEARCH} for flow 016, ${error.stack}`,
        )
        errorObj.customGroupCheckError = `Error validating custom group categories: ${error.message}`
      }
    }
  } catch (error: any) {
    logger.error(`!!Error while checking Providers info in /${constants.ON_SEARCH}, ${error.stack}`)
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

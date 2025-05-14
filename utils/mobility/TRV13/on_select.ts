import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkOnSelect = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.ON_SELECT]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.ON_SELECT, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.SELECT, TRV13ApiSequence.ON_SELECT)
  setValue(`${TRV13ApiSequence.ON_SELECT}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const onSelectOrder: any = message.order

  try {
    // Provider validation
    if (!onSelectOrder?.provider) {
      errorObj.provider = 'provider is missing in order'
    } else {
      const provider = onSelectOrder.provider
      if (!provider?.id) {
        errorObj.provider_id = 'provider.id is missing'
      }
    }

    // Items validation
    if (!onSelectOrder?.items || !Array.isArray(onSelectOrder.items) || onSelectOrder.items.length === 0) {
      errorObj.items = 'items array is missing or empty'
    } else {
      onSelectOrder.items.forEach((item: any, index: number) => {
        // Item ID validation
        if (!item?.id) {
          errorObj[`item_${index}_id`] = `item.id is missing at index ${index}`
        }

        // Add-ons validation (if present)
        if (item?.add_ons) {
          if (!Array.isArray(item.add_ons)) {
            errorObj[`item_${index}_add_ons`] = `item.add_ons should be an array at index ${index}`
          } else {
            item.add_ons.forEach((addon: any, addonIndex: number) => {
              if (!addon?.id) {
                errorObj[`item_${index}_addon_${addonIndex}_id`] = `addon.id is missing at item index ${index}, addon index ${addonIndex}`
              }
            })
          }
        }

        // Payment IDs validation (if present)
        if (item?.payment_ids) {
          if (!Array.isArray(item.payment_ids)) {
            errorObj[`item_${index}_payment_ids`] = `item.payment_ids should be an array at index ${index}`
          } else {
            item.payment_ids.forEach((paymentId: string, paymentIndex: number) => {
              if (!paymentId) {
                errorObj[`item_${index}_payment_id_${paymentIndex}`] = `payment_id is missing at item index ${index}, payment index ${paymentIndex}`
              }
            })
          }
        }
      })
    }

    // Quote validation
    if (!onSelectOrder?.quote) {
      errorObj.quote = 'quote is missing in order'
    } else {
      const quote = onSelectOrder.quote

      // Price validation
      if (!quote?.price) {
        errorObj.quote_price = 'quote.price is missing'
      } else {
        if (!quote.price?.currency) {
          errorObj.quote_price_currency = 'quote.price.currency is missing'
        }
        if (!quote.price?.value) {
          errorObj.quote_price_value = 'quote.price.value is missing'
        } else {
          const priceValue = parseFloat(quote.price.value)
          if (isNaN(priceValue) || priceValue < 0) {
            errorObj.quote_price_value = 'quote.price.value should be a valid non-negative number'
          }
        }
      }

      // Breakup validation
      if (!quote?.breakup || !Array.isArray(quote.breakup) || quote.breakup.length === 0) {
        errorObj.quote_breakup = 'quote.breakup array is missing or empty'
      } else {
        quote.breakup.forEach((breakup: any, index: number) => {
          // Title validation
          if (!breakup?.title) {
            errorObj[`quote_breakup_${index}_title`] = `breakup.title is missing at index ${index}`
          }

          // Price validation
          if (!breakup?.price) {
            errorObj[`quote_breakup_${index}_price`] = `breakup.price is missing at index ${index}`
          } else {
            if (!breakup.price?.currency) {
              errorObj[`quote_breakup_${index}_price_currency`] = `breakup.price.currency is missing at index ${index}`
            }
            if (!breakup.price?.value) {
              errorObj[`quote_breakup_${index}_price_value`] = `breakup.price.value is missing at index ${index}`
            } else {
              const priceValue = parseFloat(breakup.price.value)
              if (isNaN(priceValue) || priceValue < 0) {
                errorObj[`quote_breakup_${index}_price_value`] = `breakup.price.value should be a valid non-negative number at index ${index}`
              }
            }
          }

          // Item validation (if present)
          if (breakup?.item) {
            const item = breakup.item
            if (!item?.id) {
              errorObj[`quote_breakup_${index}_item_id`] = `breakup.item.id is missing at index ${index}`
            }

            // Quantity validation (if present)
            if (item?.quantity) {
              if (!item.quantity?.selected) {
                errorObj[`quote_breakup_${index}_item_quantity_selected`] = `breakup.item.quantity.selected is missing at index ${index}`
              } else {
                if (!item.quantity.selected?.count) {
                  errorObj[`quote_breakup_${index}_item_quantity_selected_count`] = `breakup.item.quantity.selected.count is missing at index ${index}`
                } else {
                  const count = parseInt(item.quantity.selected.count)
                  if (isNaN(count) || count <= 0) {
                    errorObj[`quote_breakup_${index}_item_quantity_selected_count`] = `breakup.item.quantity.selected.count should be a positive number at index ${index}`
                  }
                }
              }
            }

            // Price validation (if present)
            if (item?.price) {
              if (!item.price?.currency) {
                errorObj[`quote_breakup_${index}_item_price_currency`] = `breakup.item.price.currency is missing at index ${index}`
              }
              if (!item.price?.value) {
                errorObj[`quote_breakup_${index}_item_price_value`] = `breakup.item.price.value is missing at index ${index}`
              } else {
                const priceValue = parseFloat(item.price.value)
                if (isNaN(priceValue) || priceValue < 0) {
                  errorObj[`quote_breakup_${index}_item_price_value`] = `breakup.item.price.value should be a valid non-negative number at index ${index}`
                }
              }
            }

            // Add-ons validation (if present)
            if (item?.add_ons) {
              if (!Array.isArray(item.add_ons)) {
                errorObj[`quote_breakup_${index}_item_add_ons`] = `breakup.item.add_ons should be an array at index ${index}`
              } else {
                item.add_ons.forEach((addon: any, addonIndex: number) => {
                  if (!addon?.id) {
                    errorObj[`quote_breakup_${index}_item_addon_${addonIndex}_id`] = `breakup.item.addon.id is missing at index ${index}, addon index ${addonIndex}`
                  }
                  if (!addon?.price) {
                    errorObj[`quote_breakup_${index}_item_addon_${addonIndex}_price`] = `breakup.item.addon.price is missing at index ${index}, addon index ${addonIndex}`
                  } else {
                    if (!addon.price?.currency) {
                      errorObj[`quote_breakup_${index}_item_addon_${addonIndex}_price_currency`] = `breakup.item.addon.price.currency is missing at index ${index}, addon index ${addonIndex}`
                    }
                    if (!addon.price?.value) {
                      errorObj[`quote_breakup_${index}_item_addon_${addonIndex}_price_value`] = `breakup.item.addon.price.value is missing at index ${index}, addon index ${addonIndex}`
                    } else {
                      const priceValue = parseFloat(addon.price.value)
                      if (isNaN(priceValue) || priceValue < 0) {
                        errorObj[`quote_breakup_${index}_item_addon_${addonIndex}_price_value`] = `breakup.item.addon.price.value should be a valid non-negative number at index ${index}, addon index ${addonIndex}`
                      }
                    }
                  }
                })
              }
            }
          }
        })
      }

      // TTL validation
      if (!quote?.ttl) {
        errorObj.quote_ttl = 'quote.ttl is missing'
      } else {
        if (!quote.ttl.match(/^P\d+[D]$/)) {
          errorObj.quote_ttl = 'quote.ttl should be in ISO 8601 duration format (e.g., P1D)'
        }
      }
    }

    // Payments validation
    if (!onSelectOrder?.payments || !Array.isArray(onSelectOrder.payments) || onSelectOrder.payments.length === 0) {
      errorObj.payments = 'payments array is missing or empty'
    } else {
      onSelectOrder.payments.forEach((payment: any, index: number) => {
        // Payment ID validation
        if (!payment?.id) {
          errorObj[`payment_${index}_id`] = `payment.id is missing at index ${index}`
        }

        // Payment type validation
        if (!payment?.type) {
          errorObj[`payment_${index}_type`] = `payment.type is missing at index ${index}`
        } else {
          const validTypes = ['PRE-ORDER', 'ON-FULFILLMENT', 'PART-PAYMENT']
          if (!validTypes.includes(payment.type)) {
            errorObj[`payment_${index}_type`] = `payment.type should be one of ${validTypes.join(', ')} at index ${index}`
          }
        }

        // Tags validation
        if (!payment?.tags || !Array.isArray(payment.tags) || payment.tags.length === 0) {
          errorObj[`payment_${index}_tags`] = `payment.tags array is missing or empty at index ${index}`
        } else {
          payment.tags.forEach((tag: any, tagIndex: number) => {
            if (!tag?.descriptor) {
              errorObj[`payment_${index}_tag_${tagIndex}_descriptor`] = `tag.descriptor is missing at payment index ${index}, tag index ${tagIndex}`
            } else {
              if (!tag.descriptor?.code) {
                errorObj[`payment_${index}_tag_${tagIndex}_descriptor_code`] = `tag.descriptor.code is missing at payment index ${index}, tag index ${tagIndex}`
              } else {
                const validCodes = ['FULL-PAYMENT', 'LINKED-PAYMENTS', 'ADV-DEPOSIT', 'FINAL-PAYMENT']
                if (!validCodes.includes(tag.descriptor.code)) {
                  errorObj[`payment_${index}_tag_${tagIndex}_descriptor_code`] = `tag.descriptor.code should be one of ${validCodes.join(', ')} at payment index ${index}, tag index ${tagIndex}`
                }
              }
            }

            // List validation (if present)
            if (tag?.list) {
              if (!Array.isArray(tag.list)) {
                errorObj[`payment_${index}_tag_${tagIndex}_list`] = `tag.list should be an array at payment index ${index}, tag index ${tagIndex}`
              } else {
                tag.list.forEach((listItem: any, listIndex: number) => {
                  if (!listItem?.descriptor) {
                    errorObj[`payment_${index}_tag_${tagIndex}_list_${listIndex}_descriptor`] = `listItem.descriptor is missing at payment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                  } else {
                    if (!listItem.descriptor?.code) {
                      errorObj[`payment_${index}_tag_${tagIndex}_list_${listIndex}_descriptor_code`] = `listItem.descriptor.code is missing at payment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                    }
                  }
                  if (!listItem?.value) {
                    errorObj[`payment_${index}_tag_${tagIndex}_list_${listIndex}_value`] = `listItem.value is missing at payment index ${index}, tag index ${tagIndex}, list index ${listIndex}`
                  }
                })
              }
            }
          })
        }

        // Params validation (if present)
        if (payment?.params) {
          if (!payment.params?.currency) {
            errorObj[`payment_${index}_params_currency`] = `payment.params.currency is missing at index ${index}`
          }
          if (!payment.params?.amount) {
            errorObj[`payment_${index}_params_amount`] = `payment.params.amount is missing at index ${index}`
          } else {
            const amount = parseFloat(payment.params.amount)
            if (isNaN(amount) || amount < 0) {
              errorObj[`payment_${index}_params_amount`] = `payment.params.amount should be a valid non-negative number at index ${index}`
            }
          }
        }
      })
    }
  } catch (error: any) {
    logger.error(`!!Error while checking on_select info in /${TRV13ApiSequence.ON_SELECT}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

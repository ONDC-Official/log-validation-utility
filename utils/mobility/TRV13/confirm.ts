import { logger } from '../../../shared/logger'
import { setValue } from '../../../shared/dao'
import { TRV13ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty } from '../../../utils'
import { validateContext } from '../mobilityChecks'

export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
  console.log("Version", version)
  if (!data || isObjectEmpty(data)) {
    return { [TRV13ApiSequence.CONFIRM]: 'JSON cannot be empty' }
  }

  const { message, context } = data
  if (!message || !context || !message.order || isObjectEmpty(message) || isObjectEmpty(message.order)) {
    return { missingFields: '/context, /message, /order or /message/order is missing or empty' }
  }

  const schemaValidation = validateSchema('TRV13', TRV13ApiSequence.CONFIRM, data)
  const contextRes: any = validateContext(context, msgIdSet, TRV13ApiSequence.ON_INIT, TRV13ApiSequence.CONFIRM)
  setValue(`${TRV13ApiSequence.CONFIRM}_message`, message)
  const errorObj: any = {}

  if (schemaValidation !== 'error') {
    Object.assign(errorObj, schemaValidation)
  }

  if (!contextRes?.valid) {
    Object.assign(errorObj, contextRes.ERRORS)
  }

  const confirmOrder: any = message.order

  try {
    // Provider validation
    if (!confirmOrder?.provider) {
      errorObj.provider = 'provider is missing in order'
    } else {
      const provider = confirmOrder.provider
      if (!provider?.id) {
        errorObj.provider_id = 'provider.id is missing'
      }
    }

    // Items validation
    if (!confirmOrder?.items || !Array.isArray(confirmOrder.items) || confirmOrder.items.length === 0) {
      errorObj.items = 'items array is missing or empty'
    } else {
      confirmOrder.items.forEach((item: any, index: number) => {
        // Item ID validation
        if (!item?.id) {
          errorObj[`item_${index}_id`] = `item.id is missing at index ${index}`
        }

        // Location IDs validation
        if (!item?.location_ids || !Array.isArray(item.location_ids) || item.location_ids.length === 0) {
          errorObj[`item_${index}_location_ids`] = `item.location_ids array is missing or empty at index ${index}`
        }

        // Quantity validation
        if (!item?.quantity) {
          errorObj[`item_${index}_quantity`] = `item.quantity is missing at index ${index}`
        } else {
          if (!item.quantity?.selected) {
            errorObj[`item_${index}_quantity_selected`] = `item.quantity.selected is missing at index ${index}`
          } else {
            if (!item.quantity.selected?.count) {
              errorObj[`item_${index}_quantity_selected_count`] = `item.quantity.selected.count is missing at index ${index}`
            } else {
              const count = parseInt(item.quantity.selected.count)
              if (isNaN(count) || count <= 0) {
                errorObj[`item_${index}_quantity_selected_count`] = `item.quantity.selected.count should be a positive number at index ${index}`
              }
            }
          }
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
      })
    }

    // Quote validation
    if (!confirmOrder?.quote) {
      errorObj.quote = 'quote is missing in order'
    } else {
      const quote = confirmOrder.quote

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
    if (!confirmOrder?.payments || !Array.isArray(confirmOrder.payments) || confirmOrder.payments.length === 0) {
      errorObj.payments = 'payments array is missing or empty'
    } else {
      confirmOrder.payments.forEach((payment: any, index: number) => {
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

        // Payment status validation
        if (!payment?.status) {
          errorObj[`payment_${index}_status`] = `payment.status is missing at index ${index}`
        } else {
          const validStatuses = ['NOT-PAID', 'PAID']
          if (!validStatuses.includes(payment.status)) {
            errorObj[`payment_${index}_status`] = `payment.status should be one of ${validStatuses.join(', ')} at index ${index}`
          }
        }

        // Collected by validation (if present)
        if (payment?.collected_by) {
          const validCollectors = ['BAP', 'BPP']
          if (!validCollectors.includes(payment.collected_by)) {
            errorObj[`payment_${index}_collected_by`] = `payment.collected_by should be one of ${validCollectors.join(', ')} at index ${index}`
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

          // Additional payment params validation for ON-FULFILLMENT type
          if (payment.type === 'ON-FULFILLMENT') {
            if (!payment.params?.bank_code) {
              errorObj[`payment_${index}_params_bank_code`] = `payment.params.bank_code is missing for ON-FULFILLMENT payment at index ${index}`
            }
            if (!payment.params?.bank_account_number) {
              errorObj[`payment_${index}_params_bank_account_number`] = `payment.params.bank_account_number is missing for ON-FULFILLMENT payment at index ${index}`
            }
            if (!payment.params?.virtual_payment_address) {
              errorObj[`payment_${index}_params_virtual_payment_address`] = `payment.params.virtual_payment_address is missing for ON-FULFILLMENT payment at index ${index}`
            }
          }

          // Transaction ID validation (if present)
          if (payment.params?.transaction_id) {
            if (typeof payment.params.transaction_id !== 'string') {
              errorObj[`payment_${index}_params_transaction_id`] = `payment.params.transaction_id should be a string at index ${index}`
            }
          }
        }
      })
    }

    // Billing validation
    if (!confirmOrder?.billing) {
      errorObj.billing = 'billing is missing in order'
    } else {
      const billing = confirmOrder.billing

      // Required billing fields validation
      if (!billing?.name) {
        errorObj.billing_name = 'billing.name is missing'
      }
      if (!billing?.address) {
        errorObj.billing_address = 'billing.address is missing'
      }
      if (!billing?.state?.name) {
        errorObj.billing_state_name = 'billing.state.name is missing'
      }
      if (!billing?.city?.name) {
        errorObj.billing_city_name = 'billing.city.name is missing'
      }
      if (!billing?.organization?.descriptor?.name) {
        errorObj.billing_organization_name = 'billing.organization.descriptor.name is missing'
      }
      if (!billing?.organization?.address) {
        errorObj.billing_organization_address = 'billing.organization.address is missing'
      }
      if (!billing?.email) {
        errorObj.billing_email = 'billing.email is missing'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(billing.email)) {
          errorObj.billing_email = 'billing.email should be a valid email address'
        }
      }
      if (!billing?.phone) {
        errorObj.billing_phone = 'billing.phone is missing'
      } else {
        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(billing.phone)) {
          errorObj.billing_phone = 'billing.phone should be a valid 10-digit phone number'
        }
      }
      if (!billing?.tax_id) {
        errorObj.billing_tax_id = 'billing.tax_id is missing'
      }
    }

    // Fulfillments validation
    if (!confirmOrder?.fulfillments || !Array.isArray(confirmOrder.fulfillments) || confirmOrder.fulfillments.length === 0) {
      errorObj.fulfillments = 'fulfillments array is missing or empty'
    } else {
      confirmOrder.fulfillments.forEach((fulfillment: any, index: number) => {
        // Fulfillment ID validation
        if (!fulfillment?.id) {
          errorObj[`fulfillment_${index}_id`] = `fulfillment.id is missing at index ${index}`
        }

        // Customer validation
        if (!fulfillment?.customer) {
          errorObj[`fulfillment_${index}_customer`] = `fulfillment.customer is missing at index ${index}`
        } else {
          const customer = fulfillment.customer

          // Person validation
          if (!customer?.person) {
            errorObj[`fulfillment_${index}_customer_person`] = `fulfillment.customer.person is missing at index ${index}`
          } else {
            const person = customer.person

            // Required person fields validation
            if (!person?.name) {
              errorObj[`fulfillment_${index}_customer_person_name`] = `fulfillment.customer.person.name is missing at index ${index}`
            }
            if (!person?.age) {
              errorObj[`fulfillment_${index}_customer_person_age`] = `fulfillment.customer.person.age is missing at index ${index}`
            } else {
              const age = parseInt(person.age)
              if (isNaN(age) || age < 0 || age > 120) {
                errorObj[`fulfillment_${index}_customer_person_age`] = `fulfillment.customer.person.age should be a valid number between 0 and 120 at index ${index}`
              }
            }
            if (!person?.dob) {
              errorObj[`fulfillment_${index}_customer_person_dob`] = `fulfillment.customer.person.dob is missing at index ${index}`
            } else {
              const dob = new Date(person.dob)
              if (isNaN(dob.getTime())) {
                errorObj[`fulfillment_${index}_customer_person_dob`] = `fulfillment.customer.person.dob should be a valid date at index ${index}`
              }
            }
            if (!person?.gender) {
              errorObj[`fulfillment_${index}_customer_person_gender`] = `fulfillment.customer.person.gender is missing at index ${index}`
            } else {
              const validGenders = ['M', 'F', 'O']
              if (!validGenders.includes(person.gender)) {
                errorObj[`fulfillment_${index}_customer_person_gender`] = `fulfillment.customer.person.gender should be one of ${validGenders.join(', ')} at index ${index}`
              }
            }

            // Credentials validation (if present)
            if (person?.creds) {
              if (!Array.isArray(person.creds)) {
                errorObj[`fulfillment_${index}_customer_person_creds`] = `fulfillment.customer.person.creds should be an array at index ${index}`
              } else {
                person.creds.forEach((cred: any, credIndex: number) => {
                  if (!cred?.id) {
                    errorObj[`fulfillment_${index}_customer_person_cred_${credIndex}_id`] = `cred.id is missing at fulfillment index ${index}, cred index ${credIndex}`
                  }
                  if (!cred?.type) {
                    errorObj[`fulfillment_${index}_customer_person_cred_${credIndex}_type`] = `cred.type is missing at fulfillment index ${index}, cred index ${credIndex}`
                  }
                })
              }
            }
          }

          // Contact validation
          if (!customer?.contact) {
            errorObj[`fulfillment_${index}_customer_contact`] = `fulfillment.customer.contact is missing at index ${index}`
          } else {
            const contact = customer.contact

            if (!contact?.phone) {
              errorObj[`fulfillment_${index}_customer_contact_phone`] = `fulfillment.customer.contact.phone is missing at index ${index}`
            } else {
              const phoneRegex = /^[0-9]{10}$/
              if (!phoneRegex.test(contact.phone)) {
                errorObj[`fulfillment_${index}_customer_contact_phone`] = `fulfillment.customer.contact.phone should be a valid 10-digit phone number at index ${index}`
              }
            }

            if (!contact?.email) {
              errorObj[`fulfillment_${index}_customer_contact_email`] = `fulfillment.customer.contact.email is missing at index ${index}`
            } else {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (!emailRegex.test(contact.email)) {
                errorObj[`fulfillment_${index}_customer_contact_email`] = `fulfillment.customer.contact.email should be a valid email address at index ${index}`
              }
            }
          }
        }
      })
    }

    // Tags validation
    if (confirmOrder?.tags) {
      if (!Array.isArray(confirmOrder.tags)) {
        errorObj.tags = 'order.tags should be an array'
      } else {
        confirmOrder.tags.forEach((tag: any, index: number) => {
          if (!tag?.descriptor) {
            errorObj[`tag_${index}_descriptor`] = `tag.descriptor is missing at index ${index}`
          } else {
            if (!tag.descriptor?.code) {
              errorObj[`tag_${index}_descriptor_code`] = `tag.descriptor.code is missing at index ${index}`
            } else {
              const validCodes = ['BAP_TERMS', 'BUYER_FINDER_FEES', 'BPP_TERMS']
              if (!validCodes.includes(tag.descriptor.code)) {
                errorObj[`tag_${index}_descriptor_code`] = `tag.descriptor.code should be one of ${validCodes.join(', ')} at index ${index}`
              }
            }
          }

          // List validation (if present)
          if (tag?.list) {
            if (!Array.isArray(tag.list)) {
              errorObj[`tag_${index}_list`] = `tag.list should be an array at index ${index}`
            } else {
              tag.list.forEach((listItem: any, listIndex: number) => {
                if (!listItem?.descriptor) {
                  errorObj[`tag_${index}_list_${listIndex}_descriptor`] = `listItem.descriptor is missing at tag index ${index}, list index ${listIndex}`
                } else {
                  if (!listItem.descriptor?.code) {
                    errorObj[`tag_${index}_list_${listIndex}_descriptor_code`] = `listItem.descriptor.code is missing at tag index ${index}, list index ${listIndex}`
                  }
                }
                if (!listItem?.value) {
                  errorObj[`tag_${index}_list_${listIndex}_value`] = `listItem.value is missing at tag index ${index}, list index ${listIndex}`
                } else {
                  // Validate specific tag values
                  if (tag.descriptor.code === 'BAP_TERMS') {
                    if (listItem.descriptor.code === 'EFFECTIVE_DATE') {
                      const date = new Date(listItem.value)
                      if (isNaN(date.getTime())) {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `EFFECTIVE_DATE should be a valid ISO date string at tag index ${index}, list index ${listIndex}`
                      }
                    } else if (listItem.descriptor.code === 'STATIC_TERMS_NEW') {
                      const urlRegex = /^https?:\/\/.+/
                      if (!urlRegex.test(listItem.value)) {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `STATIC_TERMS_NEW should be a valid URL at tag index ${index}, list index ${listIndex}`
                      }
                    }
                  } else if (tag.descriptor.code === 'BUYER_FINDER_FEES') {
                    if (listItem.descriptor.code === 'BUYER_FINDER_FEES_PERCENTAGE') {
                      const percentage = parseFloat(listItem.value)
                      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `BUYER_FINDER_FEES_PERCENTAGE should be a valid number between 0 and 100 at tag index ${index}, list index ${listIndex}`
                      }
                    }
                  } else if (tag.descriptor.code === 'BPP_TERMS') {
                    if (listItem.descriptor.code === 'MAX_LIABILITY') {
                      const liability = parseFloat(listItem.value)
                      if (isNaN(liability) || liability < 0) {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `MAX_LIABILITY should be a valid non-negative number at tag index ${index}, list index ${listIndex}`
                      }
                    } else if (listItem.descriptor.code === 'MAX_LIABILITY_CAP') {
                      const cap = parseFloat(listItem.value)
                      if (isNaN(cap) || cap < 0) {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `MAX_LIABILITY_CAP should be a valid non-negative number at tag index ${index}, list index ${listIndex}`
                      }
                    } else if (listItem.descriptor.code === 'MANDATORY_ARBITRATION') {
                      if (listItem.value !== 'true' && listItem.value !== 'false') {
                        errorObj[`tag_${index}_list_${listIndex}_value`] = `MANDATORY_ARBITRATION should be either 'true' or 'false' at tag index ${index}, list index ${listIndex}`
                      }
                    }
                  }
                }
              })
            }
          }
        })
      }
    }

    // Timestamps validation
    if (!confirmOrder?.created_at) {
      errorObj.created_at = 'created_at is missing'
    } else {
      const createdDate = new Date(confirmOrder.created_at)
      if (isNaN(createdDate.getTime())) {
        errorObj.created_at = 'created_at should be a valid ISO date string'
      }
    }

    if (!confirmOrder?.updated_at) {
      errorObj.updated_at = 'updated_at is missing'
    } else {
      const updatedDate = new Date(confirmOrder.updated_at)
      if (isNaN(updatedDate.getTime())) {
        errorObj.updated_at = 'updated_at should be a valid ISO date string'
      }
    }

  } catch (error: any) {
    logger.error(`!!Error while checking confirm info in /${TRV13ApiSequence.CONFIRM}, ${error.stack}`)
    return { error: error.message }
  }

  return Object.keys(errorObj).length > 0 && errorObj
}

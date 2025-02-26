import { SRV19APISequence } from "../../../constants"
import { getValue, setValue } from "../../../shared/dao"
import { logger } from "../../../shared/logger"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkOnSelect = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
        
            const { message, context }: any = data
          
          
            if (!data || isObjectEmpty(data)) {
              return { [SRV19APISequence.ON_SELECT]: 'JSON cannot be empty' }
            }
          
            try {
              logger.info(`Validating Schema for ${SRV19APISequence.ON_SELECT} API`)
              const vs = validateSchema('srv19', SRV19APISequence.ON_SELECT, data)
          
              if (vs != 'error') {
                Object.assign(rsfObj, vs)
              }
              let errors: any = {}

              // Validate context fields
              const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_SELECT, context.action)
              if (!contextRes?.valid) {
                  Object.assign(errors, contextRes.ERRORS)
              }
      
              // Retrieve stored SELECT values
              const prevMessage = getValue('select_message')
      
              if (prevMessage) {
                  // Validate Provider ID
                  if (prevMessage.order?.provider?.id !== message.order?.provider?.id) {
                      errors.provider_id = "Provider ID mismatch between SELECT and ON_SELECT"
                  }
      
                  // Validate Location IDs
                  const prevLocationIds = prevMessage.order?.provider?.locations?.map((loc: any) => loc.id) || []
                  const onSelectLocationIds = message.order?.provider?.locations?.map((loc: any) => loc.id) || []
      
                  if (JSON.stringify(prevLocationIds.sort()) !== JSON.stringify(onSelectLocationIds.sort())) {
                      errors.location_ids = "Provider location IDs changed between SELECT and ON_SELECT"
                  }
      
                  // Validate Item IDs
                  const prevItemIds = prevMessage.order?.items?.map((item: any) => item.id) || []
                  const onSelectItemIds = message.order?.items?.map((item: any) => item.id) || []
      
                  if (JSON.stringify(prevItemIds.sort()) !== JSON.stringify(onSelectItemIds.sort())) {
                      errors.item_ids = "Selected items mismatch between SELECT and ON_SELECT"
                  }
      
                  // Validate Fulfillment Type
                  const prevFulfillmentType = prevMessage.order?.fulfillments?.[0]?.type
                  const onSelectFulfillmentType = message.order?.fulfillments?.[0]?.type
      
                  if (prevFulfillmentType !== onSelectFulfillmentType) {
                      errors.fulfillment_type = "Fulfillment type changed between SELECT and ON_SELECT"
                  }
      
                  // Validate Payment Type
                  const prevPaymentType = prevMessage.order?.payments?.[0]?.type
                  const onSelectPaymentType = message.order?.payments?.[0]?.type
      
                  if (prevPaymentType !== onSelectPaymentType) {
                      errors.payment_type = "Payment type changed between SELECT and ON_SELECT"
                  }
              }
      
              if (Object.keys(errors).length > 0) {
                  return { validation_errors: errors }
              }
      
          
              setValue('on_select_context', context)
              setValue('on_select_message', message)
          
              return rsfObj
            } catch (err: any) {
              if (err.code === 'ENOENT') {
                logger.info(`!!File not found for /${SRV19APISequence.ON_SELECT} API!`)
              } else {
                console.log("Error occurred while checking /API:", err)
                logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_SELECT} API`, err)
              }
            }
}
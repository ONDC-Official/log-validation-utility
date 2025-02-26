import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkOnInit = (data: any, msgIdSet: any, version: any) => {
     const rsfObj: any = {}
        
            const { message, context }: any = data
            
          
            if (!data || isObjectEmpty(data)) {
              return { [SRV19APISequence.ON_INIT]: 'JSON cannot be empty' }
            }
          
            try {
              logger.info(`Validating Schema for ${SRV19APISequence.ON_INIT} API`)
              const vs = validateSchema('srv19', SRV19APISequence.ON_INIT, data)
          
              if (vs != 'error') {
                Object.assign(rsfObj, vs)
              }
          
              setValue('on_init_context', context)
              setValue('on_init_message', message)
              let errors: any = {}
              const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.INIT, context.action)
              if (!contextRes?.valid) {
                  Object.assign(errors, contextRes.ERRORS)
              }
      
              // Retrieve stored INIT values
              const prevMessage = getValue('init_message')
      
              if (prevMessage) {
                  // Validate Provider ID
                  if (prevMessage.order?.provider?.id !== message.order?.provider?.id) {
                      errors.provider_id = "Provider ID mismatch between INIT and ON_INIT"
                  }
      
                  // Validate Location IDs
                  const prevLocationIds = prevMessage.order?.provider?.locations?.map((loc: any) => loc.id) || []
                  const onInitLocationIds = message.order?.provider?.locations?.map((loc: any) => loc.id) || []
      
                  if (JSON.stringify(prevLocationIds.sort()) !== JSON.stringify(onInitLocationIds.sort())) {
                      errors.location_ids = "Provider location IDs changed between INIT and ON_INIT"
                  }
      
                  // Validate Item IDs
                  const prevItemIds = prevMessage.order?.items?.map((item: any) => item.id) || []
                  const onInitItemIds = message.order?.items?.map((item: any) => item.id) || []
      
                  if (JSON.stringify(prevItemIds.sort()) !== JSON.stringify(onInitItemIds.sort())) {
                      errors.item_ids = "Selected items mismatch between INIT and ON_INIT"
                  }
      
                  // Validate Fulfillment Type
                  const prevFulfillmentType = prevMessage.order?.fulfillments?.[0]?.type
                  const onInitFulfillmentType = message.order?.fulfillments?.[0]?.type
      
                  if (prevFulfillmentType !== onInitFulfillmentType) {
                      errors.fulfillment_type = "Fulfillment type changed between INIT and ON_INIT"
                  }
      
                  // Validate Billing Information
                  const prevBilling = prevMessage.order?.billing
                  const onInitBilling = message.order?.billing
      
                  if (JSON.stringify(prevBilling) !== JSON.stringify(onInitBilling)) {
                      errors.billing = "Billing details changed between INIT and ON_INIT"
                  }
      
                  // Validate Payment Type
                  const prevPaymentType = prevMessage.order?.payments?.[0]?.type
                  const onInitPaymentType = message.order?.payments?.[0]?.type
      
                  if (prevPaymentType !== onInitPaymentType) {
                      errors.payment_type = "Payment type changed between INIT and ON_INIT"
                  }
      
                  // Validate Quote Presence in ON_INIT
                  if (!message.order?.quote) {
                      errors.quote = "Quote is missing in ON_INIT"
                  }
              }
      
              if (Object.keys(errors).length > 0) {
                  return { validation_errors: errors }
              }
      

          
              return rsfObj
            } catch (err: any) {
              if (err.code === 'ENOENT') {
                logger.info(`!!File not found for /${SRV19APISequence.ON_INIT} API!`)
              } else {
                console.log("Error occurred while checking /API:", err)
                logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_INIT} API`, err)
              }
            }
}
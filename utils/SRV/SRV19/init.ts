import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import { validateContext } from "./srvChecks"

// @ts-ignore
export const checkInit = (data: any, msgIdSet: any, version: any) => {
      const rsfObj: any = {}
    
        const { message, context }: any = data
    
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.INIT]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.INIT} API`)
          const vs = validateSchema('srv19', SRV19APISequence.INIT, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('init_context', context)
          setValue('init_message', message)

          let errors: any = {};

          // Validate context fields
          const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_SELECT, context.action);
          if (!contextRes?.valid) {
              Object.assign(errors, contextRes.ERRORS);
          }
  
          // Retrieve stored ON_SELECT values
          const prevMessage = getValue('on_select_message');
  
          if (prevMessage) {
              // Validate Provider ID
              if (prevMessage.order?.provider?.id !== message.order?.provider?.id) {
                  errors.provider_id = "Provider ID mismatch between ON_SELECT and INIT";
              }
  
              // Validate Location IDs
              const prevLocationIds = prevMessage.order?.provider?.locations?.map((loc: any) => loc.id) || [];
              const initLocationIds = message.order?.provider?.locations?.map((loc: any) => loc.id) || [];
  
              if (JSON.stringify(prevLocationIds.sort()) !== JSON.stringify(initLocationIds.sort())) {
                  errors.location_ids = "Provider location IDs changed between ON_SELECT and INIT";
              }
  
              // Validate Item IDs
              const prevItemIds = prevMessage.order?.items?.map((item: any) => item.id) || [];
              const initItemIds = message.order?.items?.map((item: any) => item.id) || [];
  
              if (JSON.stringify(prevItemIds.sort()) !== JSON.stringify(initItemIds.sort())) {
                  errors.item_ids = "Selected items mismatch between ON_SELECT and INIT";
              }
  
              // Validate Fulfillment Type
              const prevFulfillmentType = prevMessage.order?.fulfillments?.[0]?.type;
              const initFulfillmentType = message.order?.fulfillments?.[0]?.type;
  
              if (prevFulfillmentType !== initFulfillmentType) {
                  errors.fulfillment_type = "Fulfillment type changed between ON_SELECT and INIT";
              }
  
              // Validate Payment Type
              const prevPaymentType = prevMessage.order?.payments?.[0]?.type;
              const initPaymentType = message.order?.payments?.[0]?.type;
  
              if (prevPaymentType !== initPaymentType) {
                  errors.payment_type = "Payment type changed between ON_SELECT and INIT";
              }
          }
  
          if (Object.keys(errors).length > 0) {
              return { validation_errors: errors };
          }
  
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.INIT} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.INIT} API`, err)
          }
        }
}
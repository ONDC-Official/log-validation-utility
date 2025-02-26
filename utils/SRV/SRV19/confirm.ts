import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import { isSubset, validateContext } from "./srvChecks"

// @ts-ignore
export const checkConfirm = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
    
    const { message, context }: any = data

  
    if (!data || isObjectEmpty(data)) {
      return { [SRV19APISequence.CONFIRM]: 'JSON cannot be empty' }
    }
  
    try {
      logger.info(`Validating Schema for ${SRV19APISequence.CONFIRM} API`)
      const vs = validateSchema('srv19', SRV19APISequence.CONFIRM, data)
  
      if (vs != 'error') {
        Object.assign(rsfObj, vs)
      }
  
      setValue('confirm_context', context)
      setValue('confirm_message', message)
      
      let errors: any = {};

        // Validate context fields
        const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_INIT, context.action);
        if (!contextRes?.valid) {
            Object.assign(errors, contextRes.ERRORS);
        }

        // Retrieve stored ON_INIT values
        const prevMessage = getValue('on_init_message');
       

        if (prevMessage) {
            // Validate Provider ID
           
            const prevProviderId = prevMessage.order?.provider?.id;
            const confirmProviderId = message.order?.provider?.id;
            if (prevProviderId != confirmProviderId) {
            
              console.log(prevProviderId, confirmProviderId)
                errors.provider_id = "Provider ID mismatch between ON_INIT and CONFIRM";
            }

            // Validate Location IDs
            const prevLocationIds = prevMessage.order?.provider?.locations?.map((loc: any) => loc.id) || [];
            const confirmLocationIds = message.order?.provider?.locations?.map((loc: any) => loc.id) || [];
            
            if (prevLocationIds.length > 0 && !isSubset(prevLocationIds, confirmLocationIds)) {
                errors.location_ids = "Provider location IDs changed between ON_INIT and CONFIRM";
            }

            // Validate Item IDs
            const prevItemIds = prevMessage.order?.items?.map((item: any) => item.id) || [];
            const confirmItemIds = message.order?.items?.map((item: any) => item.id) || [];
            
            if (prevItemIds.length > 0 && !isSubset(prevItemIds, confirmItemIds)) {
                errors.item_ids = "Selected items mismatch between ON_INIT and CONFIRM";
            }

            // Validate Fulfillment Type
            const prevFulfillmentType = prevMessage.order?.fulfillments?.[0]?.type;
            const confirmFulfillmentType = message.order?.fulfillments?.[0]?.type;
            
            if (prevFulfillmentType !== confirmFulfillmentType) {
                errors.fulfillment_type = "Fulfillment type changed between ON_INIT and CONFIRM";
            }

            // Validate Billing Information
            const prevBilling = prevMessage.order?.billing;
            const confirmBilling = message.order?.billing;
            
            if (JSON.stringify(prevBilling) !== JSON.stringify(confirmBilling)) {
                errors.billing = "Billing details changed between ON_INIT and CONFIRM";
            }

            // Validate Payment Type
            const prevPaymentType = prevMessage.order?.payments?.[0]?.type;
            const confirmPaymentType = message.order?.payments?.[0]?.type;
            
            if (prevPaymentType !== confirmPaymentType) {
                errors.payment_type = "Payment type changed between ON_INIT and CONFIRM";
            }

            // Validate Quote Consistency
            const prevQuote = prevMessage.order?.quote;
            const confirmQuote = message.order?.quote;
            
            if (JSON.stringify(prevQuote) !== JSON.stringify(confirmQuote)) {
             
                errors.quote = "Quote details changed between ON_INIT and CONFIRM";
            }
        }

        if (Object.keys(errors).length > 0) {
            return { validation_errors: errors };
        }

  
      return rsfObj
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        logger.info(`!!File not found for /${SRV19APISequence.CONFIRM} API!`)
      } else {
        console.log("Error occurred while checking /API:", err)
        logger.error(`!!Some error occurred while checking /${SRV19APISequence.CONFIRM} API`, err)
      }
    }
    
}
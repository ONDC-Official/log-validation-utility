import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import {  isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import { isJsonASubsequence, validateContext } from "./srvChecks"


// @ts-ignore
export const checkOnConfirm = (data: any, msgIdSet: any, version: any) => {
    const rsfObj: any = {}
        
        const { message, context }: any = data
    
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.ON_CONFIRM]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.ON_CONFIRM} API`)
          const vs = validateSchema('srv19', SRV19APISequence.ON_CONFIRM, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
          let errors: any = {}
           
            const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.CONFIRM, context.action);
                   if (!contextRes?.valid) {
                       Object.assign(errors, contextRes.ERRORS);
                   }  
       // Retrieve stored CONFIRM values
        const prevMessage = getValue('confirm_message');
        
        if (prevMessage) {
            // Validate Order ID
            if (prevMessage.order?.id !== message.order?.id) {
                errors.order_id = "Order ID mismatch between CONFIRM and ON_CONFIRM";
            }

            // Validate Provider ID
            if (prevMessage.order?.provider?.id !== message.order?.provider?.id) {
                errors.provider_id = "Provider ID mismatch between CONFIRM and ON_CONFIRM";
            }

            // Validate Provider Locations
            const prevLocations = prevMessage.order?.provider?.locations || [];
            const onConfirmLocations = message.order?.provider?.locations || [];
            if (JSON.stringify(prevLocations) !== JSON.stringify(onConfirmLocations)) {
                errors.locations = "Provider locations changed between CONFIRM and ON_CONFIRM";
            }

            // Validate Items
            const prevItems = prevMessage.order?.items || [];
            const onConfirmItems = message.order?.items || [];
            if (JSON.stringify(prevItems) !== JSON.stringify(onConfirmItems)) {
                errors.items = "Items mismatch between CONFIRM and ON_CONFIRM";
            }

            // Validate Billing Details
            if (JSON.stringify(prevMessage.order?.billing) !== JSON.stringify(message.order?.billing)) {
                errors.billing = "Billing details changed between CONFIRM and ON_CONFIRM";
            }

            // // Validate Fulfillments
            const prevFulfillments = prevMessage.order?.fulfillments || [];
            const onConfirmFulfillments = message.order?.fulfillments || [];
            if (!isJsonASubsequence(prevFulfillments, onConfirmFulfillments)) {
                errors.fulfillments = "Fulfillments changed between CONFIRM and ON_CONFIRM";
            }

            // Validate Quote
            if (JSON.stringify(prevMessage.order?.quote) !== JSON.stringify(message.order?.quote)) {
                errors.quote = "Quote mismatch between CONFIRM and ON_CONFIRM";
            }

            // Validate Payments
            if (JSON.stringify(prevMessage.order?.payments) !== JSON.stringify(message.order?.payments)) {
                errors.payments = "Payment details changed between CONFIRM and ON_CONFIRM";
            }
        }

        if (Object.keys(errors).length > 0) {
            return { validation_errors: errors };
        }

          setValue('on_confirm_context', context)
          setValue('on_confirm_message', message)
      
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.ON_CONFIRM} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.ON_CONFIRM} API`, err)
          }
        }
}
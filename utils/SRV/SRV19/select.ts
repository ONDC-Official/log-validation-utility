import { logger } from "../../../shared/logger"
import { SRV19APISequence } from "../../../constants"
import { isObjectEmpty, validateSchema } from "../../../utils"
import { getValue, setValue } from "../../../shared/dao"
import {  isSubset, validateContext } from "./srvChecks"

// @ts-ignore
export const checkSelect = (data: any, msgIdSet: any) => {
     const rsfObj: any = {}
    
        const { message, context }: any = data
       
      
        if (!data || isObjectEmpty(data)) {
          return { [SRV19APISequence.SELECT]: 'JSON cannot be empty' }
        }
      
        try {
          logger.info(`Validating Schema for ${SRV19APISequence.SELECT} API`)
          const vs = validateSchema('srv19', SRV19APISequence.SELECT, data)
      
          if (vs != 'error') {
            Object.assign(rsfObj, vs)
          }
      
          setValue('select_context', context)
          setValue('select_message', message)
          let errors: any = {}

          const contextRes: any = validateContext(context, msgIdSet, SRV19APISequence.ON_SEARCH, context.action)
          if (!contextRes?.valid) {
            Object.assign(errors, contextRes.ERRORS)
          }
          setValue('select_context', context)
          setValue('select_message', message)
          // Validate message fields
          const prevMessage = getValue('on_search_message')
         
          if (prevMessage) {
            const prevProvider = prevMessage.catalog?.providers?.[0] || {}
            const selectProvider = message?.order?.provider || {}
      
            
            if (prevProvider.id && prevProvider.id !== selectProvider.id) {
        
                errors.provider_id = "Provider ID changed between ON_SEARCH and SELECT"
            }
      
            const prevLocationIds = prevProvider.locations?.map((loc: any) => loc.id) || []
            const selectLocationIds = selectProvider.locations?.map((loc: any) => loc.id) || []
      
            if (prevLocationIds.length > 0 && JSON.stringify(prevLocationIds.sort()) !== JSON.stringify(selectLocationIds.sort())) {
                errors.location_ids = "Provider location IDs changed between ON_SEARCH and SELECT"
            }
      
            const prevItems = prevProvider.items || []
            const prevItemIds = prevItems.map((item: any) => item.id)
      
            const selectItems = message?.order?.items || []
            const selectItemIds = selectItems.map((item: any) => item.id)
      
            if (prevItemIds.length > 0 && !isSubset(prevItemIds, selectItemIds)) {
              
                errors.item_ids = "Selected items do not match items offered in ON_SEARCH"
            }
      
            const prevFulfillmentType = prevMessage.catalog?.fulfillments?.[0]?.type
            const selectFulfillmentType = message?.order?.fulfillments?.[0]?.type
      
            if (prevFulfillmentType && prevFulfillmentType !== selectFulfillmentType) {
                errors.fulfillment_type = "Fulfillment type changed between ON_SEARCH and SELECT"
            }
      
            const prevPaymentTypes = prevMessage.catalog?.payments?.map((p: any) => p.type) || []
            const selectPaymentTypes = message?.order?.payments?.map((p: any) => p.type) || []
      
            if (prevPaymentTypes.length > 0 && !isSubset(selectPaymentTypes, prevPaymentTypes)) {
              
                errors.payment_types = "Payment options changed between ON_SEARCH and SELECT"
            }
        }
      
          if (Object.keys(errors).length > 0) {
            return { validation_errors: errors }
          }
          return rsfObj
        } catch (err: any) {
          if (err.code === 'ENOENT') {
            logger.info(`!!File not found for /${SRV19APISequence.SELECT} API!`)
          } else {
            console.log("Error occurred while checking /API:", err)
            logger.error(`!!Some error occurred while checking /${SRV19APISequence.SELECT} API`, err)
          }
        }
}
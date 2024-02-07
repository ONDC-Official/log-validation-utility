import { logger } from '../../../shared/logger'
export const checkFulfillmentID = (items: any, errObj: any, flow: string) => {
    logger.info(`Inside Fullfillment ID function for flow ${flow}`)
  items.reduce((acc: any, item: any) => {
    if (item.fulfillment_id !== acc) {
      logger.error(`Fullfillment IDs can't be different for items on flow ${flow}`)
      errObj.flflmntID = `Fulfillment ID can't be different for items on flow ${flow}`
    }
    return item.fulfillment_id
  }, items[0].fulfillment_id)
  return errObj
}

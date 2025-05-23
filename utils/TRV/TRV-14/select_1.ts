import { logger } from '../../../shared/logger'
import { TRV14ApiSequence } from '../../../constants'
import { isObjectEmpty, validateSchema } from '../../../utils'
import { setValue } from '../../../shared/dao'

// @ts-ignore
export const checkSelect1 = (data: any, msgIdSet: any) => {
  const rsfObj: any = {}
  const fulfillmentIdsSet = new Set()
  const ItemMap = new Map()
  const itemAddOn = new Map()
  const { context, message }: any = data

  if (!data || isObjectEmpty(data)) {
    return { [TRV14ApiSequence.SELECT_1]: 'JSON cannot be empty' }
  }

  try {
    logger.info(`Validating Schema for ${TRV14ApiSequence.SELECT_1} API`)
    const vs = validateSchema('trv14', TRV14ApiSequence.SELECT_1, data)

    if (vs != 'error') {
      Object.assign(rsfObj, vs)
    }

    const select = message.order
    //checking provider
    setValue('prvdrId', select.provider.id)

    //checking items
    try {
      select.items.forEach((itm: any) => {
        if (itm.parent_item_id === '') {
          rsfObj[itm.id] = `parent_item_id can't have empty values for item with id:${itm.id} `
        }
        ItemMap.set(itm.id, itm.quantity.selected.count)
        if (itm.add_ons) {
          itemAddOn.set(itm.id, itm.add_ons[0].id)
        }
      })
      setValue(`items`, ItemMap)
      setValue(`addOnItems`, itemAddOn)

    } catch (error) {
      logger.error(error)
    }

    //fulfillment
    try {
      select.fulfillments.forEach((itm: any) => {
        fulfillmentIdsSet.add(itm.id)
      })
      setValue(`fulfillmentids`, fulfillmentIdsSet)
    } catch (error) {
      logger.error(error)
    }

    setValue('select1items', select.items)
    setValue('select1fulfillments', select.fulfillments)
    setValue('select1prvdrid', select.provider.id)
    setValue('select1msgId', context.message_id)

    return rsfObj
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.info(`!!File not found for /${TRV14ApiSequence.SELECT_1} API!`)
    } else {
      console.log('Error occurred while checking /API:', err)
      logger.error(`!!Some error occurred while checking /${TRV14ApiSequence.SELECT_1} API`, err)
    }
  }
}

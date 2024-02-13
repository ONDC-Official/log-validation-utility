import Joi from 'joi'
import { idCheck } from './settle'

const { string } = Joi.types()

export const onReceiverRecon = Joi.object({
  context: Joi.object({
    domain: Joi.valid('ONDC:NTS10'),
    action: Joi.valid('on_receiver_recon'),
    country: Joi.valid('IND'),
    core_version: Joi.valid('1.0.0'),
    bap_id: idCheck,
    bap_uri: string.uri(),
    bpp_id: idCheck,
    bpp_uri: string.uri(),
    transaction_id: string,
    message_id: string,
    timestamp: Joi.date().iso(),
    ttl: string.isoDuration(),
    city: string.regex(/^std:\d+$|^\*$/).message('Invalid City String'),
  }),
  message: Joi.object({
    orderbook: Joi.object({
      orders: Joi.array().items(
        Joi.object({
          id: string,
          invoice_no: string,
          collector_app_id: idCheck,
          receiver_app_id: idCheck,
          recon_status: Joi.valid('01', '02', '03', '04'),
          order_recon_status: Joi.valid('02'),
          transaction_id: string.equal(Joi.ref('/receiver_recon.message.orderbook.orders.0.transaction_id')),
          settlement_id: string.equal(Joi.ref('/receiver_recon.message.settlement.settlements.0.settlement_id')),
          settlement_reference_no: string.equal(Joi.ref('/on_settle.message.settlement.settlements.settlement_timestamp')),
          counterparty_recon_status: Joi.valid('01', '02', '03', '04'),
          counterparty_diff_amount: {
            currency: Joi.valid('INR'),
            value: Joi.number().integer(),
          },
          message: {
            name: string.regex(/^[a-zA-Z ]*$/).allow(''),
            code: string.regex(/^[a-zA-Z ]*$/).allow(''),
          },
        }),
      ),
    }),
  }),
}).options({ presence: 'required' })

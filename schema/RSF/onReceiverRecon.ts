import Joi from 'joi'
import { idCheck } from './settle'

export const onReceiverRecon = Joi.object({
  context: Joi.object({
    domain: Joi.valid('ONDC:NTS10'),
    action: Joi.valid('on_receiver_recon'),
    country: Joi.valid('IND'),
    core_version: Joi.valid('1.0.0'),
    bap_id: idCheck,
    bap_uri: Joi.string().uri(),
    bpp_id: idCheck,
    bpp_uri: Joi.string().uri(),
    transaction_id: Joi.string(),
    message_id: Joi.string(),
    timestamp: Joi.date().iso(),
    ttl: Joi.string().isoDuration(),
    city: Joi.string()
      .regex(/^std:\d+$|^\*$/)
      .message('Invalid City String'),
  }),
  message: Joi.object({
    orderbook: Joi.object({
      orders: Joi.array().items(
        Joi.object({
          id: Joi.string(),
          invoice_no: Joi.string(),
          collector_app_id: idCheck,
          receiver_app_id: idCheck,
          recon_status: Joi.valid('01', '02', '03', '04'),
          order_recon_status: Joi.valid('01', '02', '03'),
          transaction_id: Joi.string(),
          settlement_id: Joi.string(),
          settlement_reference_no: Joi.string(),
          counterparty_recon_status: Joi.valid('01', '02', '03', '04'),
          counterparty_diff_amount: {
            currency: Joi.valid('INR'),
            value: Joi.number().integer(),
          },
          message: {
            name: Joi.string()
              .regex(/^[a-zA-Z ]*$/)
              .allow(''),
            code: Joi.string()
              .regex(/^[a-zA-Z ]*$/)
              .allow(''),
          },
        }),
      ),
    }),
  }),
}).options({ presence: 'required' })

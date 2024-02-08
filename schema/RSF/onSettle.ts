import Joi from 'joi'
import { idCheck } from './settle'

export const onSettle = Joi.object({
  context: Joi.object({
    domain: Joi.valid('ONDC:NTS10'),
    action: Joi.valid('on_settle'),
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
    settlement: Joi.object({
      settlements: Joi.array().items(
        Joi.object({
          curr_type: Joi.valid('INR'),
          amount: Joi.object({
            currency: Joi.valid('INR'),
            value: Joi.number().min(0).precision(2),
          }),
          settlement_id: Joi.string(),
          state: Joi.valid('01', '02', '03'),
          settlement_reference_no: Joi.string(),
          error_code: Joi.when('state', {
            is: '03',
            then: Joi.valid('01'),
            otherwise: Joi.forbidden(),
          }),
          error_message: Joi.when('state', {
            is: '03',
            then: Joi.string()
              .pattern(/^[a-zA-Z -,]+$/)
              .messages({
                'string.pattern.base': '{{#label}} must contain characters and space',
              }),
            otherwise: Joi.forbidden(),
          }),
        }),
      ),
    }),
  }),
}).options({ presence: 'required' })

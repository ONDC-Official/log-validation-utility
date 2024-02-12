import Joi from 'joi'

const { string } = Joi.types()

export const idCheck = string.pattern(/^[a-z1-9-]+[.][a-z1-9-]+[.][a-z]+$/).messages({
  'string.pattern.base': '{{#label}} is invalid subscriber id',
})

export const settle: Joi.ObjectSchema = Joi.object({
  context: Joi.object({
    domain: Joi.valid('ONDC:NTS10'),
    action: Joi.valid('settle'),
    country: Joi.valid('IND'),
    core_version: Joi.valid('1.0.0'),
    bap_id: idCheck,
    bap_uri: string.uri(),
    bpp_id: idCheck,
    bpp_uri: string.uri(),
    transaction_id: string.equal(Joi.ref('/on_settle.context.transaction_id')),
    message_id: string.equal(Joi.ref('/on_settle.context.message_id')),
    timestamp: Joi.date().iso(),
    ttl: string.isoDuration(),
    city: string.regex(/^std:\d+$|^\*$/).message('Invalid City String'),
  }),
  message: Joi.object({
    settlement: Joi.object({
      settlements: Joi.array()
        .items(
          Joi.object({
            collector_app_id: idCheck,
            receiver_app_id: idCheck,
            payer_name: string.regex(/^[a-zA-Z ]+$/).messages({
              'string.pattern.base': '{{#label}} must contain characters and space',
            }),
            payer_address: string.regex(/^[a-zA-Z0-9 ,-]+$/).messages({
              'string.pattern.base': "{{#label}} must contain characters, space, ',', '-'",
            }),
            payer_account_no: string
              .min(9)
              .max(18)
              .pattern(/^[0-9]+$/)
              .messages({
                'string.pattern.base': '{{#label}} must be valid bank account number',
              }),

            payer_bank_code: string.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).messages({
              'string.pattern.base': '{{#label}} must be valid ifsc code',
            }),
            curr_type: Joi.valid('INR'),
            amount: {
              currency: Joi.valid('INR'),
              value: Joi.number().min(0).precision(2),
            },
            timestamp: Joi.date().iso(),
            payee_name: string.regex(/^[a-zA-Z ]+$/).messages({
              'string.pattern.base': '{{#label}} must contain characters and space',
            }),
            payee_address: string.regex(/^[a-zA-Z0-9 ,-]*$/).messages({
              'string.pattern.base': "{{#label}} must contain characters, space, ',', '-'",
            }),
            payee_account_no: string
              .min(9)
              .max(18)
              .pattern(/^[0-9]+$/),
            payee_bank_code: string.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).messages({
              'string.pattern.base': '{{#label}} must be valid ifsc code',
            }),
            payment_type: string.valid('01', '02', '03', '04'),
            purpose_code: Joi.valid('01', '02'),
            payee_account_type: Joi.valid('01', '02', '03'),
            remarks: {
              name: string,
            },
            settlement_id: string.equal(Joi.ref('/on_settle.message.settlement.settlements.settlement_id')),
          }),
        )
        .custom((array, helpers) => {
          const collectorAppId = array[0].collector_app_id
          const receiverAppId = array[0].receiver_app_id
          for (const key in array) {
            if (array[key].receiver_app_id !== receiverAppId) {
              return helpers.message({
                custom: `settle.message.settlement.settlements[${key}].receiver_app_id : values must be the same with all the 'receiver_app_id' `,
              })
            }
            if (array[key].collector_app_id !== collectorAppId) {
              return helpers.message({
                custom: `settle.message.settlement.settlements[${key}].collector_app_id : values must be the same with all the 'collector_app_id'`,
              })
            }
          }

          return array
        })
        .length(5),
    }),
  }),
}).options({ presence: 'required' })

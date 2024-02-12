import Joi from 'joi'
import { idCheck } from './settle'

const { string } = Joi.types()

export const receiverRecon = Joi.object({
  context: Joi.object({
    domain: string.valid('ONDC:NTS10'),
    action: Joi.valid('receiver_recon'),
    country: Joi.valid('IND'),
    core_version: Joi.valid('1.0.0'),
    bap_id: idCheck,
    bap_uri: string.trim().uri(),
    bpp_id: idCheck,
    bpp_uri: string.trim().uri(),
    transaction_id: string.equal(Joi.ref('/on_receiver_recon.context.transaction_id')),
    message_id: string.equal(Joi.ref('/on_receiver_recon.context.message_id')),
    timestamp: Joi.date().iso(),
    ttl: string.trim().isoDuration(),
    city: string
      .trim()
      .lowercase()
      .regex(/^std:\d+$|^\*$/)
      .message('Invalid City String'),
  }),
  message: Joi.object({
    orderbook: Joi.object({
      orders: Joi.array()
        .items(
          Joi.object({
            id: string.trim().trim(),
            invoice_no: string.trim().optional().trim(),
            collector_app_id: idCheck,
            receiver_app_id: idCheck,
            state: Joi.valid('Completed'),
            provider: Joi.object({
              name: Joi.object({
                name: string
                  .trim()
                  .regex(/^[a-zA-Z -]+$/)
                  .messages({
                    'string.pattern.base': "{{#label}} must contain characters, space and '-'",
                  }),
                code: string.trim(),
              }),
              address: string
                .trim()
                .regex(/^[a-zA-Z0-9 ,-]*$/)
                .messages({
                  'string.pattern.base': "{{#label}} must contain characters, space, ',', '-'",
                }),
            }),
            payment: Joi.object({
              uri: string.trim().uri(),
              tl_method: Joi.valid('http/get'),
              params: Joi.object({
                transaction_id: string.trim(),
                transaction_status: Joi.valid('PAID'),
                amount: Joi.number().min(0).positive().precision(2),
                currency: Joi.valid('INR'),
              }),
              type: Joi.valid('ON-ORDER'),
              status: Joi.valid('PAID'),
              collected_by: Joi.valid('BAP', 'BPP'),
              '@ondc/org/collected_by_status': Joi.valid('Assert').optional(),
              '@ondc/org/buyer_app_finder_fee_type': string.trim().insensitive().valid('percent', 'amount'),
              '@ondc/org/buyer_app_finder_fee_amount': string
                .insensitive()
                .when('@ondc/org/buyer_app_finder_fee_type', {
                  is: 'percent',
                  then: Joi.number().integer().max(100),
                  otherwise: Joi.number().min(0).precision(2),
                }),
              '@ondc/org/withholding_amount': Joi.number().min(0).precision(2).allow(''),
              '@ondc/org/withholding_amount_status': string.insensitive().valid('Assert').optional(),
              '@ondc/org/return_window': string.trim().isoDuration().allow(''),
              '@ondc/org/return_window_status': string.insensitive().valid('Assert').optional(),
              '@ondc/org/settlement_basis': Joi.when('@ondc/org/return_window', {
                is: '',
                then: '',
                otherwise: Joi.valid('Collection'),
              }),
              '@ondc/org/settlement_basis_status': Joi.valid('Assert'),
              '@ondc/org/settlement_window': Joi.when('@ondc/org/return_window', {
                is: '',
                then: '',
                otherwise: string.trim().isoDuration(),
              }),
              '@ondc/org/settlement_window_status': Joi.valid('Assert').optional(),
              '@ondc/org/settlement_details': Joi.array()
                .items(
                  Joi.object({
                    settlement_counterparty: Joi.when(Joi.ref('.collected_by'), {
                      is: 'BAP',
                      then: 'buyer-app',
                      otherwise: 'seller-app',
                    }),
                    settlement_phase: string.insensitive().valid('sale-amount', 'withholding-amount', 'refund'),
                    settlement_amount: Joi.number().min(0).precision(2),
                    settlement_type: string.insensitive().valid('upi', 'neft', 'rtgs'),
                    settlement_bank_account_no: Joi.when('upi', {
                      then: Joi.forbidden(),
                      otherwise: string
                        .trim()
                        .min(9)
                        .max(18)
                        .pattern(/^[0-9]+$/)
                        .messages({
                          'string.pattern.base': '{{#label}} must be valid bank account number',
                        }),
                    }),
                    settlement_ifsc_code: Joi.when('upi', {
                      then: Joi.forbidden(),
                      otherwise: string
                        .trim()
                        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
                        .messages({
                          'string.pattern.base': '{{#label}} must be valid bank account number',
                        }),
                    }),
                    upi_address: Joi.when('settlement_type', {
                      is: 'upi',
                      then: string.trim(),
                      otherwise: string.trim().allow('').optional(),
                    }),
                    bank_name: string
                      .trim()
                      .regex(/^[a-zA-Z ]*$/)
                      .messages({
                        'string.pattern.base': '{{#label}} must be only characters and space',
                      }),
                    branch_name: string
                      .trim()
                      .regex(/^[a-zA-Z ]*$/)
                      .messages({
                        'string.pattern.base': '{{#label}} must be only characters and space',
                      }),
                    beneficiary_address: string
                      .trim()
                      .regex(/^[a-zA-Z0-9 ,]*$/)
                      .messages({
                        'string.pattern.base': "{{#label}} must be only characters, space , 0-9 and ','",
                      }),
                    beneficiary_name: string
                      .trim()
                      .regex(/^[a-zA-Z .]*$/)
                      .messages({
                        'string.pattern.base': "{{#label}} must be only characters, space and ','",
                      }),
                    settlement_status: Joi.valid('PAID'),
                    settlement_reference: string
                      .trim()
                      .equal('/on_settle.message.settlement.settlements.settlement_reference'),
                    settlement_timestamp: Joi.date()
                      .iso()
                      .max(Joi.ref('/receiver_recon.context.timestamp'))
                      .equal('/on_settle.message.settlement.settlements.settlement_timestamp'),
                  }),
                )
                .min(1),
            }),

            withholding_tax_gst: Joi.object({
              currency: Joi.valid('INR'),
              value: Joi.number().min(0).precision(2),
            }),
            withholding_tax_tds: Joi.object({
              currency: Joi.valid('INR'),
              value: Joi.number().min(0).precision(2),
            }),
            deduction_by_collector: Joi.object({
              currency: Joi.valid('INR'),
              value: Joi.number().min(0).precision(2),
            }),
            payerdetails: Joi.object({
              payer_name: string
                .trim()
                .regex(/^[a-zA-Z -]+$/)
                .messages({
                  'string.pattern.base': "{{#label}} must contain characters, space and '-'",
                }),
              payer_address: string.trim(),
              payer_account_no: string
                .trim()
                .min(9)
                .max(18)
                .pattern(/^[0-9]+$/)
                .messages({
                  'string.pattern.base': '{{#label}} must be valid bank account number',
                }),
              payer_bank_code: string
                .trim()
                .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
                .messages({
                  'string.pattern.base': '{{#label}} must be valid ifsc code',
                }),
              payer_virtual_payment_address: string.trim(),
            }),

            settlement_reason_code: Joi.valid('01', '02', '03', '04', '05', '06'),
            settlement_id: string.trim().equal('/on_settle.message.settlement.settlements.settlement_id'),
            settlement_reference_no: string
              .trim()
              .equal('/on_settle.message.settlement.settlements.settlement_timestamp'),
            transaction_id: string.trim(),
            recon_status: Joi.valid('01', '02', '03', '04'),
            order_recon_status: Joi.valid('01'),
            created_at: Joi.date().iso().max(Joi.ref('/receiver_recon.context.timestamp')),
            updated_at: Joi.date().iso().min(Joi.ref('created_at')).max(Joi.ref('/receiver_recon.context.timestamp')),
          }),
        )
        .length(5),
    }),
  }),
}).options({ presence: 'required' })

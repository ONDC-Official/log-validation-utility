const receiverReconSchema = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain',
        'action',
        'country',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'timestamp',
        'ttl',
        'city',
      ],
      properties: {
        domain: {
          type: 'string',
          enum: ['ONDC:NTS10'],
        },
        action: {
          type: 'string',
          enum: ['receiver_recon'],
        },
        country: {
          type: 'string',
        },
        core_version: {
          type: 'string',
          enum: ['1.0.0'],
        },
        bap_id: { type: 'string' }, // Example for idCheck
        bap_uri: {
          type: 'string',
          format: 'uri',
        },
        bpp_id: { type: 'string' }, // Example for idCheck
        bpp_uri: {
          type: 'string',
          format: 'uri',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        ttl: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
      },
    },
    message: {
      type: 'object',
      required: ['orderbook'],
      properties: {
        orderbook: {
          type: 'object',
          required: ['orders'],
          properties: {
            orders: {
              type: 'array',
              items: {
                type: 'object',
                required: [
                  'id',
                  'collector_app_id',
                  'receiver_app_id',
                  'state',
                  'provider',
                  'payment',
                  'transaction_id',
                  'updated_at',
                  'created_at',
                  'order_recon_status',
                  'recon_status',
                  'settlement_reference_no',
                  'settlement_id',
                  'settlement_reason_code',
                  'withholding_tax_gst',
                  'withholding_tax_tds',
                  'deduction_by_collector',
                  'payerdetails',
                ],
                properties: {
                  id: {
                    type: 'string',
                  },
                  invoice_no: {
                    type: 'string',
                  },
                  collector_app_id: { type: 'string' }, // Example for idCheck
                  receiver_app_id: { type: 'string' }, // Example for idCheck
                  state: {
                    type: 'string',
                    enum: ['Completed'],
                  },
                  provider: {
                    type: 'object',
                    required: ['name', 'address'],
                    properties: {
                      name: {
                        type: 'object',
                        required: ['name', 'code'],
                        properties: {
                          name: {
                            type: 'string',
                          },
                          code: {
                            type: 'string',
                          },
                        },
                      },
                      address: {
                        type: 'string',
                      },
                    },
                  },
                  payment: {
                    type: 'object',
                    required: [
                      'params',
                      'type',
                      'status',
                      'collected_by',
                      '@ondc/org/buyer_app_finder_fee_type',
                      '@ondc/org/buyer_app_finder_fee_amount',
                      '@ondc/org/settlement_details',
                      '@ondc/org/settlement_basis',
                    ],
                    properties: {
                      uri: {
                        type: 'string',
                        format: 'uri',
                      },
                      tl_method: {
                        type: 'string',
                        enum: ['http/get'],
                      },
                      params: {
                        type: 'object',
                        required: ['transaction_id', 'transaction_status', 'amount', 'currency'],
                        properties: {
                          transaction_id: {
                            type: 'string',
                          },
                          transaction_status: {
                            type: 'string',
                            enum: ['PAID'],
                          },
                          amount: {
                            type: 'string',
                          },
                          currency: {
                            type: 'string',
                            enum: ['INR'],
                          },
                        },
                      },
                      type: {
                        type: 'string',
                        enum: ['ON-ORDER'],
                      },
                      status: {
                        type: 'string',
                        enum: ['PAID'],
                      },
                      collected_by: {
                        type: 'string',
                        enum: ['BAP', 'BPP'],
                      },
                      '@ondc/org/collected_by_status': {
                        type: 'string',
                        enum: ['Assert'],
                        nullable: true,
                      },
                      '@ondc/org/buyer_app_finder_fee_type': {
                        type: 'string',
                        enum: ['percent', 'amount'],
                      },
                      '@ondc/org/buyer_app_finder_fee_amount': {
                        oneOf: [
                          {
                            type: 'string',
                            when: {
                              properties: {
                                '@ondc/org/buyer_app_finder_fee_type': {
                                  const: 'percent',
                                },
                              },
                              required: ['@ondc/org/buyer_app_finder_fee_type'],
                            },
                          },
                          {
                            type: 'string',
                            minimum: 0,
                          },
                        ],
                      },
                      '@ondc/org/withholding_amount': {
                        type: ['number', 'string'],
                        minimum: 0,
                      },
                      '@ondc/org/withholding_amount_status': {
                        type: 'string',
                        enum: ['Assert'],
                        nullable: true,
                      },
                      '@ondc/org/return_window': {
                        type: ['string', 'null'],
                        format: 'duration',
                      },
                      '@ondc/org/return_window_status': {
                        type: 'string',
                        enum: ['Assert'],
                        nullable: true,
                      },
                      '@ondc/org/settlement_basis': {
                        type: 'string',
                        enum: ['Collection'],
                        nullable: true,
                      },
                      '@ondc/org/settlement_basis_status': {
                        type: 'string',
                        enum: ['Assert'],
                        nullable: true,
                      },
                      '@ondc/org/settlement_window': {
                        type: ['string', 'null'],
                        format: 'duration',
                        nullable: true,
                      },
                      '@ondc/org/settlement_window_status': {
                        type: 'string',
                        enum: ['Assert'],
                        nullable: true,
                      },
                      '@ondc/org/settlement_details': {
                        type: 'array',

                        items: {
                          type: 'object',
                          required: [
                            'settlement_counterparty',
                            'settlement_amount',
                            'settlement_type',
                            'settlement_status',
                            'settlement_timestamp',
                            'settlement_ifsc_code',
                            'settlement_reference',
                            'settlement_bank_account_no',
                          ],

                          properties: {
                            settlement_counterparty: {
                              type: 'string',
                              enum: ['buyer-app', 'seller-app'],
                            },
                            if: {
                              properties: {
                                collected_by: { const: 'BAP' },
                              },
                            },
                            then: {
                              properties: {
                                settlement_counterparty: { const: 'seller-app' },
                              },
                            },
                            else: {
                              properties: {
                                settlement_counterparty: { const: 'buyer-app' },
                              },
                            },
                            settlement_phase: {
                              type: 'string',
                              enum: ['sale-amount', 'withholding-amount', 'refund'],
                            },
                            settlement_amount: {
                              type: 'string',
                            },
                            settlement_type: {
                              type: 'string',
                              enum: ['upi', 'neft', 'rtgs'],
                            },
                            settlement_bank_account_no: {
                              type: 'string',
                              minLength: 9,
                              maxLength: 18,
                              pattern: '^[0-9]+$',
                            },
                            settlement_ifsc_code: {
                              type: 'string',
                              pattern: '^[A-Z]{4}0[A-Z0-9]{6}$',
                            },
                            upi_address: {
                              type: ['string', 'null'],
                            },
                            bank_name: {
                              type: 'string',
                            },
                            branch_name: {
                              type: 'string',
                            },
                            beneficiary_address: {
                              type: 'string',
                            },
                            beneficiary_name: {
                              type: 'string',
                            },
                            settlement_status: {
                              type: 'string',
                              enum: ['PAID'],
                            },
                            settlement_reference: {
                              type: 'string',
                            },
                            settlement_timestamp: {
                              type: 'string',
                              format: 'date-time',
                            },
                          },
                        },
                        minItems: 1,
                      },
                      withholding_tax_gst: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: {
                            type: 'string',
                            enum: ['INR'],
                          },
                          value: {
                            type: 'string',
                          },
                        },
                      },
                      withholding_tax_tds: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: {
                            type: 'string',
                            enum: ['INR'],
                          },
                          value: {
                            type: 'number',
                            minimum: 0,
                          },
                        },
                      },
                      deduction_by_collector: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: {
                            type: 'string',
                            enum: ['INR'],
                          },
                          value: {
                            type: 'number',
                            minimum: 0,
                          },
                        },
                      },
                      payerdetails: {
                        type: 'object',
                        required: [
                          'payer_name',
                          'payer_address',
                          'payer_account_no',
                          'payer_bank_code',
                          'payer_virtual_payment_address',
                        ],
                        properties: {
                          payer_name: {
                            type: 'string',
                            pattern: '^[a-zA-Z -]+$',
                          },
                          payer_address: {
                            type: 'string',
                          },
                          payer_account_no: {
                            type: 'string',
                            minLength: 9,
                            maxLength: 18,
                            pattern: '^[0-9]+$',
                          },
                          payer_bank_code: {
                            type: 'string',
                          },
                          payer_virtual_payment_address: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                  settlement_reason_code: {
                    type: 'string',
                    enum: ['01', '02', '03', '04', '05', '06'],
                  },
                  settlement_id: {
                    type: 'string',
                  },
                  settlement_reference_no: {
                    type: 'string',
                  },
                  transaction_id: {
                    type: 'string',
                  },
                  recon_status: {
                    type: 'string',
                    enum: ['01', '02', '03', '04'],
                  },
                  order_recon_status: {
                    type: 'string',
                    enum: ['01'],
                  },
                  created_at: {
                    type: 'string',
                    format: 'date-time',
                    // exclusiveMaximum: { $data: '1/context/timestamp' },
                  },
                  updated_at: {
                    type: 'string',
                    format: 'date-time',
                    // minimum: { $data: '1/created_at' },
                    // maximum: { $data: '1/receiver_recon/context/timestamp' },
                  },
                  withholding_tax_gst: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: {
                        type: 'string',
                        enum: ['INR'],
                      },
                      value: {
                        type: 'string'
                      },
                    },
                  },
                  withholding_tax_tds: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: {
                        type: 'string',
                        enum: ['INR'],
                      },
                      value: {
                        type: 'string'
                      },
                    },
                  },
                  deduction_by_collector: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: {
                        type: 'string',
                        enum: ['INR'],
                      },
                      value: {
                        type: 'string',
                      },
                    },
                  },
                  payerdetails: {
                    type: 'object',
                    required: [
                      'payer_name',
                      'payer_address',
                      'payer_account_no',
                      'payer_bank_code',
                      'payer_virtual_payment_address',
                    ],
                    properties: {
                      payer_name: {
                        type: 'string',
                      },
                      payer_address: {
                        type: 'string',
                      },
                      payer_account_no: {
                        type: 'string',
                        minLength: 9,
                        maxLength: 18,
                      },
                      payer_bank_code: {
                        type: 'string',
                      },
                      payer_virtual_payment_address: {
                        type: 'string',
                      },
                    },
                  },
                  // Additional properties for each order need to be defined here
                },
              },
              minItems: 5,
            },
          },
        },
      },
    },
  },
}

export default receiverReconSchema

const onReceiverReconSchema = {
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
          enum: ['on_receiver_recon'],
        },
        country: {
          type: 'string',
        },
        core_version: {
          type: 'string',
          enum: ['1.0.0'],
        },
        bap_id: { type: 'string' }, // Example for idCheck
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' }, // Example for idCheck
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string' },
        city: { type: 'string' },
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
                  'invoice_no',
                  'collector_app_id',
                  'receiver_app_id',
                  'order_recon_status',
                  'transaction_id',
                  'settlement_id',
                  'settlement_reference_no',
                  'counterparty_recon_status',
                ],
                properties: {
                  id: { type: 'string' },
                  invoice_no: { type: 'string' },
                  collector_app_id: { type: 'string' },
                  receiver_app_id: { type: 'string' },
                  order_recon_status: { type: 'string', enum: ['02'] },
                  transaction_id: { type: 'string' },
                  settlement_id: { type: 'string' },
                  settlement_reference_no: { type: 'string' },
                  counterparty_recon_status: {
                    type: 'string',
                    enum: ['01', '02', '03', '04'],
                  },
                  counterparty_diff_amount: {
                    oneOf: [
                      {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'number', multipleOf: 1 },
                        },
                      },
                      {
                        type: 'null',
                      },
                    ],
                  },
                  message: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', pattern: '^[a-zA-Z ]*$' },
                      code: { type: 'string', pattern: '^[a-zA-Z ]*$' },
                    },
                    required: [],
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              minItems: 5,
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

export default onReceiverReconSchema

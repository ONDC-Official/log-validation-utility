export const updateSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'update',
        },
        core_version: {
          type: 'string',
          const: '1.2.0',
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
        },
      },
      required: [
        'domain',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'city',
        'country',
        'timestamp',
      ],
    },
    message: {
      type: 'object',
      properties: {
        update_target: {
          type: 'string',
          enum: ['payment', 'item'],
        },
        order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: { type: 'string' },
                              value: { type: ['array', 'string'], items: { type: 'string' } },
                            },
                            required: ['code', 'value'],
                          },
                        },
                      },
                      required: ['code', 'list'],
                    },
                  },
                },
              },
            },
            payment: {
              type: 'object',
              properties: {
                '@ondc/org/settlement_details': {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      settlement_counterparty: { type: 'string' },
                      settlement_phase: { type: 'string' },
                      settlement_type: { type: 'string' },
                      settlement_amount: { type: 'string' },
                      settlement_timestamp: { type: 'string', format: 'rfc3339-date-time' },
                    },
                    required: [
                      'settlement_counterparty',
                      'settlement_phase',
                      'settlement_type',
                      'settlement_amount',
                      'settlement_timestamp',
                    ],
                  },
                },
              },
            },
          },
          required: ['id', 'fulfillments'],
        },
      },
      required: ['update_target', 'order'],
    },
  },
  required: ['context', 'message'],
}

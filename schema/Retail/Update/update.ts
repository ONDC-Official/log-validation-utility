export const updateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: { type: 'string', minLength: 1 },
        action: { type: 'string', const: 'update' },
        core_version: { type: 'string', const: '1.2.0' },
        bap_id: { type: 'string', minLength: 1 },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string', minLength: 1 },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string', minLength: 1 },
        message_id: { type: 'string', minLength: 1 },
        city: { type: 'string', minLength: 1 },
        country: { type: 'string', const: 'IND' },
        timestamp: { type: 'string', format: 'date-time' },
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
        update_target: { type: 'string', const: 'payment' },
        order: {
          type: 'object',
          properties: {
            id: { type: 'string', minLength: 1 },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', minLength: 1 },
                  type: { type: 'string', const: 'Cancel' },
                },
                required: ['id', 'type'],
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
                      settlement_timestamp: { type: 'string', format: 'date-time' },
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
              required: ['@ondc/org/settlement_details'],
            },
          },
          required: ['id', 'fulfillments', 'payment'],
        },
      },
      required: ['update_target', 'order'],
    },
  },
  required: ['context', 'message'],
}

const settleSchema = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain',
        'location',
        'version',
        'action',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'timestamp',
        'ttl'
      ],
      properties: {
        domain: { type: 'string' },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string' }
              },
              additionalProperties: false
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string' }
              },
              additionalProperties: false
            }
          },
          additionalProperties: false
        },
        version: { type: 'string' },
        action: { type: 'string' },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string' }
      },
      additionalProperties: false
    },
    message: {
      type: 'object',
      required: ['collector_app_id', 'receiver_app_id', 'settlement'],
      properties: {
        collector_app_id: { type: 'string' },
        receiver_app_id: { type: 'string' },
        settlement: {
          type: 'object',
          required: ['type', 'id', 'orders'],
          properties: {
            type: { type: 'string', enum: ['NP-NP','MISC', 'NIL'] },
            id: { type: 'string' },
            orders: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'inter_participant', 'collector', 'self'],
                properties: {
                  id: { type: 'string' },
                  inter_participant: {
                    type: 'object',
                    required: ['amount'],
                    properties: {
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^\\d+(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  },
                  collector: {
                    type: 'object',
                    required: ['amount'],
                    properties: {
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^\\d+(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  },
                  provider: {
                    type: 'object',
                    required: ['id', 'name', 'bank_details', 'amount'],
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      bank_details: {
                        type: 'object',
                        required: ['account_no', 'ifsc_code'],
                        properties: {
                          account_no: { type: 'string', pattern: '^\\d+$' },
                          ifsc_code: { type: 'string' }
                        },
                        additionalProperties: false
                      },
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^\\d+(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  },
                  self: {
                    type: 'object',
                    required: ['amount'],
                    properties: {
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^\\d+(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              }
            }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};

export default settleSchema;
const onSettleSchema = {
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
        action: { type: 'string', enum: ['on_settle'] },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string' ,format: 'duration'}
      },
      additionalProperties: false
    },
    message: {
      type: 'object',
      required: ['settlement'],
      properties: {
        collector_app_id: { type: 'string' },
        receiver_app_id: { type: 'string' },
        settlement: {
          type: 'object',
          required: ['type'],
          properties: {
            type: { type: 'string', enum: ['NP-NP','MISC', 'NIL'] },
            id: { type: 'string' },
            orders: {
              type: 'array',
              items: {
                type: 'object',
                required: ['self'],
                properties: {
                  id: { type: 'string' },
                  inter_participant: {
                    type: 'object',
                    required: ['settled_amount', 'amount', 'status', 'reference_no'],
                    properties: {
                      settled_amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' , pattern: '^(0|[1-9]\\d*)(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      },
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^(0|[1-9]\\d*)(\\.\\d{1,2})?$'
 }
                        },
                        additionalProperties: false
                      },
                      status: { type: 'string', enum: ['SETTLED', 'NOT_SETTLED'] },
                      reference_no: { type: 'string' }
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
                          value: { type: 'string', pattern: '^(0|[1-9]\\d*)(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  },
                  provider: {
                    type: 'object',
                    required: ['id', 'amount', 'status', 'reference_no'],
                    properties: {
                      id: { type: 'string' },
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' }
                        },
                        additionalProperties: false
                      },
                      status: { type: 'string', enum: ['SETTLED', 'NOT_SETTLED'] },
                      error: {
                        type: 'object',
                        required: ['code', 'message'],
                        properties: {
                          code: { type: 'string' },
                          message: { type: 'string' }
                        },
                        additionalProperties: false
                      },
                      reference_no: { type: 'string' }
                    },
                    additionalProperties: false
                  },
                  self: {
                    type: 'object',
                    required: ['amount', 'status', 'reference_no'],
                    properties: {
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string', pattern: '^(0|[1-9]\\d*)(\\.\\d{1,2})?$' }
                        },
                        additionalProperties: false
                      },
                      status: { type: 'string', enum: ['SETTLED', 'NOT_SETTLED'] },
                      reference_no: { type: 'string' },
                      error: {
                        type: 'object',
                        required: ['code', 'message'],
                        properties: {
                          code: { type: 'string' },
                          message: { type: 'string' }
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

export default onSettleSchema;
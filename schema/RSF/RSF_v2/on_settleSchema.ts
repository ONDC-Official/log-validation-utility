const onSettleSchema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
      context: {
        type: 'object',
        required: [
          'action',
          'bap_id',
          'bap_uri',
          'bpp_id',
          'bpp_uri',
          'domain',
          'location',
          'message_id',
          'timestamp',
          'transaction_id',
          'ttl',
          'version'
        ],
        properties: {
          action: { type: 'string', enum: ['on_settle'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string', format: 'uri' },
          domain: { type: 'string', enum: ['ONDC:NTS10'] },
          location: {
            type: 'object',
            required: ['city', 'country'],
            properties: {
              city: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' },
                },
              },
              country: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' },
                },
              },
            },
          },
          message_id: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          transaction_id: { type: 'string' },
          ttl: { type: 'string' },
          version: { type: 'string', enum: ['2.0.0'] },
        },
      },
      message: {
        type: 'object',
        required: ['collector_app_id', 'receiver_app_id', 'settlement'],
        properties: {
          collector_app_id: { type: 'string' },
          receiver_app_id: { type: 'string' },
          settlement: {
            type: 'object',
            required: ['id', 'orders', 'type'],
            properties: {
              id: { type: 'string' },
              orders: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'collector',
                    'id',
                    'inter_participant',
                    'provider',
                    'self'
                  ],
                  properties: {
                    collector: {
                      type: 'object',
                      required: ['amount'],
                      properties: {
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                      },
                    },
                    id: { type: 'string' },
                    inter_participant: {
                      type: 'object',
                      required: ['amount', 'reference_no', 'settled_amount', 'status'],
                      properties: {
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        reference_no: { type: 'string' },
                        settled_amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        status: { type: 'string', enum: ['SETTLED', 'NOT-SETTLED'] },
                      },
                    },
                    provider: {
                      type: 'object',
                      required: ['amount', 'id', 'reference_no', 'status'],
                      properties: {
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        error: {
                          type: 'object',
                          required: ['code', 'message'],
                          properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                          },
                        },
                        id: { type: 'string' },
                        reference_no: { type: 'string' },
                        status: { type: 'string', enum: ['SETTLED', 'NOT-SETTLED'] },
                      },
                    },
                    self: {
                      type: 'object',
                      required: ['amount', 'reference_no', 'status'],
                      properties: {
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        error: {
                          type: 'object',
                          required: ['code', 'message'],
                          properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                          },
                        },
                        reference_no: { type: 'string' },
                        status: { type: 'string', enum: ['SETTLED', 'NOT-SETTLED'] },
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              type: { type: 'string', enum: ['NP-NP'] },
            },
          },
        },
      },
    },
    additionalProperties: false,
  };
  
  export default onSettleSchema;
  
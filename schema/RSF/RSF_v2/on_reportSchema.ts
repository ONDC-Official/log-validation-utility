const onReportSchema = {
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
          domain: { type: 'string', enum: ['ONDC:NTS10'] },
          location: {
            type: 'object',
            required: ['country', 'city'],
            properties: {
              country: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string', enum: ['IND'] },
                },
              },
              city: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' },
                },
              },
            },
          },
          version: { type: 'string', enum: ['2.0.0'] },
          action: { type: 'string', enum: ['on_report'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string', format: 'uri' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          ttl: { type: 'string' },
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
            required: ['type', 'id', 'orders'],
            properties: {
              type: { type: 'string', enum: ['NP-NP'] },
              id: { type: 'string' },
              orders: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'inter_participant', 'collector', 'provider', 'self'],
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
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        status: { type: 'string', enum: ['SETTLED', 'NOT_SETTLED'] },
                        reference_no: { type: 'string' },
                      },
                    },
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
                    provider: {
                      type: 'object',
                      required: ['id', 'amount', 'status'],
                      properties: {
                        id: { type: 'string' },
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        status: { type: 'string', enum: ['SETTLED', 'NOT_SETTLED'] },
                        error: {
                          type: 'object',
                          required: ['code', 'message'],
                          properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                          },
                        },
                      },
                    },
                    self: {
                      type: 'object',
                      required: ['amount', 'status'],
                      properties: {
                        amount: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string' },
                          },
                        },
                        status: { type: 'string', enum: ['NOT_SETTLED', 'SETTLED'] },
                        error: {
                          type: 'object',
                          required: ['code', 'message'],
                          properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    additionalProperties: false,
  };
  
  export default onReportSchema;
  
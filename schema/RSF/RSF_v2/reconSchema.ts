const reconSchema = {
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
          action: { type: 'string', enum: ['recon'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string', format: 'uri' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          timestamp: { type: 'string', format: 'rfc3339-date-time' },
          ttl: { type: 'string' },
        },
      },
      message: {
        type: 'object',
        required: ['orders'],
        properties: {
          orders: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'amount', 'settlements'],
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
                settlements: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [
                      'id',
                      'payment_id',
                      'status',
                      'amount',
                      'commission',
                      'withholding_amount',
                      'tcs',
                      'tds',
                      'updated_at'
                    ],
                    properties: {
                      id: { type: 'string' },
                      payment_id: { type: 'string' },
                      status: {
                        type: 'string',
                        enum: ['PENDING', 'SETTLED', 'TO-BE-INITIATED'],
                      },
                      amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string' },
                        },
                      },
                      commission: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string' },
                        },
                      },
                      withholding_amount: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string' },
                        },
                      },
                      tcs: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string' },
                        },
                      },
                      tds: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string' },
                        },
                      },
                      settlement_ref_no: { type: 'string' },
                      updated_at: { type: 'string', format: 'date-time' },
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
  
  export default reconSchema;
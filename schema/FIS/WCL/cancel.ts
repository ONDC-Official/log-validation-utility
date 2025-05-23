export const cancelFISWCLSchema = {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              },
              city: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              }
            },
            required: ['country', 'city']
          },
          version: { type: 'string' },
          action: { type: 'string', enum: ['cancel'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          ttl: { type: 'string' },
          timestamp: { type: 'string' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string' }
        },
        required: [
          'domain',
          'location',
          'version',
          'action',
          'bap_id',
          'bap_uri',
          'transaction_id',
          'message_id',
          'ttl',
          'timestamp',
          'bpp_id',
          'bpp_uri'
        ]
      },
      message: {
        type: 'object',
        properties: {
          cancellation_reason_id: { type: 'string' },
          descriptor: {
            type: 'object',
            properties: {
              short_desc: { type: 'string' }
            },
            required: ['short_desc']
          },
          order_id: { type: 'string' }
        },
        required: ['cancellation_reason_id', 'descriptor', 'order_id']
      }
    },
    required: ['context', 'message']
  }
const reportSchema = {
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
          action: { type: 'string', enum: ['report'] },
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
        required: ['ref_transaction_id', 'ref_message_id'],
        properties: {
          ref_transaction_id: { type: 'string' },
          ref_message_id: { type: 'string' },
        },
      },
    },
    additionalProperties: false,
  }
  
  export default reportSchema;
  
const statusSchemaTRV14 = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'location',
        'domain',
        'timestamp',
        'bap_id',
        'transaction_id',
        'message_id',
        'version',
        'action',
        'bap_uri',
        'ttl',
        'bpp_id',
        'bpp_uri',
      ],
      properties: {
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
        domain: { type: 'string', enum: ['ONDC:TRV14'] },
        timestamp: { type: 'string', format: 'date-time' },
        bap_id: { type: 'string' },
        transaction_id: { type: 'string', format: 'uuid' },
        message_id: { type: 'string', format: 'uuid' },
        version: { type: 'string', enum: ['2.0.0'] },
        action: { type: 'string', enum: ['status'] },
        bap_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
      },
    },
    message: {
      type: 'object',
      required: ['ref_id'],
      properties: {
        ref_id: { type: 'string' },
      },
    },
  },
}

export default statusSchemaTRV14

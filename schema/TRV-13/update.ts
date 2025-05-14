const updateSchemaTRV13 = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain',
        'location',
        'transaction_id',
        'message_id',
        'action',
        'timestamp',
        'version',
        'bap_uri',
        'bap_id',
        'bpp_uri',
        'bpp_id',
        'ttl'
      ],
      properties: {
        domain: { type: 'string', enum: ['ONDC:TRV13'] },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', enum: ['IND'] }
              }
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string' }
              }
            }
          }
        },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        action: { type: 'string', enum: ['update'] },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', enum: ['2.0.0'] },
        bap_uri: { type: 'string', format: 'uri' },
        bap_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' }
      }
    },
    message: {
      type: 'object',
      required: ['update_target', 'order'],
      properties: {
        update_target: { type: 'string' },
        order: {
          type: 'object',
          required: ['id', 'fulfillments'],
          properties: {
            id: { type: 'string' },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'tags'],
                properties: {
                  id: { type: 'string' },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['descriptor', 'list'],
                      properties: {
                        descriptor: {
                          type: 'object',
                          required: ['code'],
                          properties: {
                            code: { type: 'string' }
                          }
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['descriptor', 'value'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['code'],
                                properties: {
                                  code: { type: 'string' }
                                }
                              },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  additionalProperties: false
}

export default updateSchemaTRV13 
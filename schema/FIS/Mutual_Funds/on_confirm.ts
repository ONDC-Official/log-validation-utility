export const onConfirmFIS14Schema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
      context: {
        type: 'object',
        required: [
          'domain', 'location', 'version', 'action', 'bap_id', 'bap_uri',
          'bpp_id', 'bpp_uri', 'transaction_id', 'message_id', 'timestamp', 'ttl'
        ],
        properties: {
          domain: { type: 'string' },
          location: {
            type: 'object',
            required: ['country', 'city'],
            properties: {
              country: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } },
              city: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } }
            }
          },
          version: { type: 'string' },
          action: { type: 'string', enum: ['on_confirm'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string', format: 'uri' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          ttl: { type: 'string' }
        }
      },
      message: {
        type: 'object',
        required: ['order'],
        properties: {
          order: {
            type: 'object',
            required: ['id', 'status', 'provider', 'items', 'fulfillments', 'payments', 'quote'],
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              provider: {
                type: 'object',
                required: ['id', 'descriptor'],
                properties: {
                  id: { type: 'string' },
                  descriptor: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } }
                }
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'descriptor', 'quantity', 'fulfillment_ids', 'payment_ids', 'tags'],
                  properties: {
                    id: { type: 'string' },
                    descriptor: { type: 'object', required: ['name', 'code'], properties: { name: { type: 'string' }, code: { type: 'string' } } },
                    quantity: {
                      type: 'object',
                      required: ['selected'],
                      properties: {
                        selected: {
                          type: 'object',
                          required: ['measure'],
                          properties: {
                            measure: { type: 'object', required: ['value', 'unit'], properties: { value: { type: 'string' }, unit: { type: 'string' } } }
                          }
                        }
                      }
                    },
                    fulfillment_ids: { type: 'array', items: { type: 'string' } },
                    payment_ids: { type: 'array', items: { type: 'string' } },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['display', 'descriptor', 'list'],
                        properties: {
                          display: { type: 'boolean' },
                          descriptor: { type: 'object', required: ['name', 'code'], properties: { name: { type: 'string' }, code: { type: 'string' } } },
                          list: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['descriptor', 'value'],
                              properties: {
                                descriptor: { type: 'object', required: ['name', 'code'], properties: { name: { type: 'string' }, code: { type: 'string' } } },
                                value: { type: 'string' }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              fulfillments: { type: 'array', items: { type: 'object' } },
              payments: { type: 'array', items: { type: 'object' } },
              quote: { type: 'object' }
            }
          }
        }
      }
    }
  };

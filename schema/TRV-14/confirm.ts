const confirmSchemaTRV14 = {
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
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        version: { type: 'string', enum: ['2.0.0'] },
        action: { type: 'string', enum: ['confirm'] },
        bap_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
      },
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['items', 'fulfillments', 'provider', 'billing', 'payments', 'tags'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'parent_item_id', 'quantity'],
                properties: {
                  id: { type: 'string' },
                  parent_item_id: { type: 'string' },
                  quantity: {
                    type: 'object',
                    properties: {
                      selected: {
                        type: 'object',
                        properties: {
                          count: { type: 'integer' },
                        },
                      },
                    },
                  },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        quantity: {
                          type: 'object',
                          properties: {
                            selected: {
                              type: 'object',
                              properties: {
                                count: { type: 'integer' },
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
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        time: {
                          type: 'object',
                          properties: {
                            timestamp: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            billing: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' },
              },
            },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  collected_by: { type: 'string' },
                  status: { type: 'string' },
                  type: { type: 'string' },
                  params: {
                    type: 'object',
                    properties: {
                      transaction_id: { type: 'string' },
                      currency: { type: 'string' },
                      amount: { type: 'string' },
                    },
                  },
                },
              },
            },
            tags: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
    },
  },
}

export default confirmSchemaTRV14

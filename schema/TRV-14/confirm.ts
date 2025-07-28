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
                  id: { type: 'string' ,minLength:1 },
                  parent_item_id: { type: 'string' ,minLength:1 },
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
                        id: { type: 'string' ,minLength:1 },
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
                required: ['id', 'stops'],
                additionalProperties: false,
                properties: {
                  id: { type: 'string' ,minLength:1 },
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['type', 'time'],
                      additionalProperties: false,
                      properties: {
                        type: { type: 'string', enum: ['START'] },
                        time: {
                          type: 'object',
                          properties: {
                            timestamp: { type: 'string', format: 'date-time' },
                            range: {
                              type: 'object',
                              required: ['start', 'end'],
                              properties: {
                                start: { type: 'string', format: 'date-time' },
                                end: { type: 'string', format: 'date-time' },
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
            billing: {
              type: 'object',
              properties: {
                name: { type: 'string' ,minLength:1 },
                email: { type: 'string', format: 'email' ,minLength:1 },
                phone: { type: 'string' ,minLength:1 },
              },
            },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string' ,minLength:1 },
              },
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'status', 'collected_by', 'type', 'params'],
                properties: {
                  id: { type: 'string' ,minLength:1 },
                  collected_by: { type: 'string' },
                  status: { type: 'string' },
                  type: { type: 'string' },
                  params: {
                    type: 'object',
                    required: ['transaction_id', 'currency', 'amount'],
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

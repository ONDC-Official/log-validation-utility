export const initSchemaTRV_12 = {
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
        'bpp_id',
        'bpp_uri',
        'ttl',
      ],
      properties: {
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } },
            city: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } },
          },
        },
        domain: { type: 'string', enum: ['ONDC:TRV12'] },
        timestamp: { type: 'string', format: 'date-time' },
        bap_id: { type: 'string' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        version: { type: 'string' },
        action: { type: 'string', enum: ['init'] },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
      },
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['provider', 'items', 'fulfillments', 'billing', 'payments'],
          properties: {
            provider: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
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
                    required: ['selected'],
                    properties: {
                      selected: { type: 'object', required: ['count'], properties: { count: { type: 'integer' } } },
                    },
                  },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'quantity'],
                      properties: {
                        id: { type: 'string' },
                        quantity: {
                          type: 'object',
                          required: ['selected'],
                          properties: {
                            selected: {
                              type: 'object',
                              required: ['count'],
                              properties: { count: { type: 'integer' } },
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
                    items: { type: 'object', properties: { id: { type: 'string' } } },
                  },
                  vehicle: {
                    type: 'object',
                    properties: {
                      category: { type: 'string', enum: ['AIRLINE'] },
                      code: { type: 'string' },
                    },
                  },
                  customer: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        required: ['name', 'age', 'gender', 'dob'],
                        properties: {
                          name: { type: 'string' },
                          age: { type: 'string' },
                          gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                          dob: { type: 'string', format: 'date' },
                        },
                      },
                      contact: {
                        type: 'object',
                        required: ['phone', 'email'],
                        properties: {
                          phone: { type: 'string' },
                          email: { type: 'string', format: 'email' },
                        },
                      },
                    },
                  },
                },
              },
            },
            billing: {
              type: 'object',
              required: ['name', 'phone', 'tax_id'],
              properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                tax_id: { type: 'string' },
              },
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['collected_by', 'status', 'type', 'tags'],
                properties: {
                  collected_by: { type: 'string', enum: ['BAP', 'BPP'] },
                  status: { type: 'string', enum: ['NOT-PAID', 'PAID'] },
                  type: { type: 'string', enum: ['PRE-ORDER', 'POST-ORDER'] },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['descriptor', 'display', 'list'],
                      properties: {
                        descriptor: {
                          type: 'object',
                          required: ['code'],
                          properties: {
                            code: { type: 'string', enum: ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS'] },
                          },
                        },
                        display: { type: 'boolean' },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['descriptor', 'value'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['code'],
                                properties: { code: { type: 'string' } },
                              },
                              value: { type: 'string' },
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
    },
  },
}

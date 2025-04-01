export const confirmSchemaTRV_12 = {
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
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', pattern: '^[A-Z]{3}$' },
              },
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', pattern: '^std:\\d{3}$' },
              },
            },
          },
        },
        domain: { type: 'string', enum: ['ONDC:TRV12'] },
        timestamp: { type: 'string', format: 'date-time' },
        bap_id: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' },
        message_id: { type: 'string', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' },
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        action: { type: 'string', enum: ['confirm'] },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string', format: 'uri' },
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
          required: ['id', 'provider', 'items', 'fulfillments', 'billing', 'payments'],
          properties: {
            id: { type: 'string' },
            provider: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' },
              },
            },
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
                      selected: {
                        type: 'object',
                        required: ['count'],
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
                required: ['id', 'type'],
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['TRIP', 'TICKET'] },
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'string' },
                      },
                    },
                  },
                  vehicle: {
                    type: 'object',
                    required: ['category', 'code'],
                    properties: {
                      category: { type: 'string', enum: ['AIRLINE'] },
                      code: { type: 'string' },
                    },
                  },
                  customer: {
                    type: 'object',
                    required: ['person', 'contact'],
                    properties: {
                      person: {
                        type: 'object',
                        required: ['name', 'age', 'gender', 'dob'],
                        properties: {
                          name: { type: 'string' },
                          age: { type: 'string' },
                          gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                          dob: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
                        },
                      },
                      contact: {
                        type: 'object',
                        required: ['phone', 'email'],
                        properties: {
                          phone: { type: 'string', pattern: '^\\+91\\d{10}$' },
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
                phone: { type: 'string', pattern: '^\\+91\\d{10}$' },
                tax_id: { type: 'string', pattern: '^GSTIN:\\d{10}$' },
              },
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['collected_by', 'status', 'type', 'params'],
                properties: {
                  collected_by: { type: 'string', enum: ['BAP'] },
                  status: { type: 'string', enum: ['PAID'] },
                  type: { type: 'string', enum: ['PRE-ORDER'] },
                  params: {
                    type: 'object',
                    required: ['transaction_id', 'currency', 'amount'],
                    properties: {
                      transaction_id: {
                        type: 'string',
                        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                      },
                      currency: { type: 'string', enum: ['INR'] },
                      amount: { type: 'string', pattern: '^\\d+$' },
                    },
                  },
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
                                properties: {
                                  code: { type: 'string' },
                                },
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

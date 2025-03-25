export const searchSchemaTRV_12 = {
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
                code: { type: 'string' },
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
        domain: { type: 'string', enum: ['ONDC:TRV12'] },
        timestamp: { type: 'string', format: 'date-time' },
        bap_id: { type: 'string' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        version: { type: 'string' },
        action: { type: 'string', enum: ['search'] },
        bap_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
      },
    },
    message: {
      type: 'object',
      required: ['intent'],
      properties: {
        intent: {
          type: 'object',
          required: ['category', 'fulfillment', 'provider', 'payment'],
          properties: {
            category: {
              type: 'object',
              required: ['descriptor'],
              properties: {
                descriptor: {
                  type: 'object',
                  required: ['code'],
                  properties: {
                    code: { type: 'string', enum: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'] },
                  },
                },
              },
            },
            fulfillment: {
              type: 'object',
              required: ['stops', 'vehicle'],
              properties: {
                stops: {
                  type: 'array',
                  minItems: 2,
                  items: [
                    {
                      type: 'object',
                      required: ['type', 'location'],
                      properties: {
                        type: { type: 'string' },
                        location: {
                          type: 'object',
                          required: ['descriptor'],
                          properties: {
                            descriptor: {
                              type: 'object',
                              required: ['code'],
                              properties: {
                                code: { type: 'string' },
                              },
                            },
                          },
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: { type: 'string' },
                            timestamp: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  ],
                  additionalItems: {
                    type: 'object',
                    required: ['type', 'location'],
                    properties: {
                      type: { type: 'string' },
                      location: {
                        type: 'object',
                        required: ['descriptor'],
                        properties: {
                          descriptor: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                              code: { type: 'string' },
                            },
                          },
                        },
                      },
                      time: {
                        type: 'object',
                        required: ['label', 'timestamp'],
                        properties: {
                          label: { type: 'string' },
                          timestamp: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
                vehicle: {
                  type: 'object',
                  required: ['category'],
                  properties: {
                    category: { type: 'string', enum: ['AIRLINE'] },
                  },
                },
              },
            },
            provider: {
              type: 'object',
              required: ['items'],
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['descriptor', 'quantity'],
                    properties: {
                      descriptor: {
                        type: 'object',
                        required: ['name', 'code'],
                        properties: {
                          name: { type: 'string' },
                          code: { type: 'string', enum: ['ADULT_TICKET', 'CHILD_TICKET'] },
                        },
                      },
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
            payment: {
              type: 'object',
              required: ['tags'],
              properties: {
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
}

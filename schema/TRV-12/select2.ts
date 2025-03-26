export const select2SchemaTRV_12 = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        location: {
          type: 'object',
          properties: {
            country: {
              type: 'object',
              properties: {
                code: { type: 'string' },
              },
              required: ['code'],
              additionalProperties: false,
            },
            city: {
              type: 'object',
              properties: {
                code: { type: 'string' },
              },
              required: ['code'],
              additionalProperties: false,
            },
          },
          required: ['country', 'city'],
          additionalProperties: false,
        },
        domain: { type: 'string', enum: ['ONDC:TRV12'] },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        bap_id: { type: 'string' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        version: { type: 'string' },
        action: { type: 'string', enum: ['select'] },
        bap_uri: { type: 'string' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string' },
        ttl: { type: 'string' },
      },
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
      additionalProperties: false,
    },
    message: {
      type: 'object',
      properties: {
        order: {
          type: 'object',
          properties: {
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
              additionalProperties: false,
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
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
                        required: ['count'],
                        additionalProperties: false,
                      },
                    },
                    required: ['selected'],
                    additionalProperties: false,
                  },
                  add_ons: {
                    type: ['array', 'null'],
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
                              required: ['count'],
                              additionalProperties: false,
                            },
                          },
                          required: ['selected'],
                          additionalProperties: false,
                        },
                      },
                      required: ['id', 'quantity'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['id', 'parent_item_id', 'quantity'],
                additionalProperties: false,
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      stops: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                          },
                          required: ['id'],
                          additionalProperties: false,
                        },
                      },
                      vehicle: {
                        type: 'object',
                        properties: {
                          category: { type: 'string' },
                          code: { type: 'string' },
                        },
                        required: ['category', 'code'],
                        additionalProperties: false,
                      },
                      tags: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            descriptor: {
                              type: 'object',
                              properties: {
                                code: { type: 'string' },
                                name: { type: ['string', 'null'] },
                              },
                              required: ['code'],
                              additionalProperties: false,
                            },
                            display: { type: 'boolean' },
                            list: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  descriptor: {
                                    type: 'object',
                                    properties: {
                                      code: { type: 'string' },
                                    },
                                    required: ['code'],
                                    additionalProperties: false,
                                  },
                                  value: { type: 'string' },
                                },
                                required: ['descriptor', 'value'],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ['descriptor', 'display', 'list'],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ['id', 'stops', 'vehicle', 'tags'],
                    additionalProperties: false,
                  },
                  {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      tags: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            descriptor: {
                              type: 'object',
                              properties: {
                                code: { type: 'string' },
                              },
                              required: ['code'],
                              additionalProperties: false,
                            },
                            list: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  descriptor: {
                                    type: 'object',
                                    properties: {
                                      code: { type: 'string' },
                                    },
                                    required: ['code'],
                                    additionalProperties: false,
                                  },
                                  value: { type: 'string' },
                                },
                                required: ['descriptor', 'value'],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ['descriptor', 'list'],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ['id', 'tags'],
                    additionalProperties: false,
                  },
                ],
              },
            },
          },
          required: ['provider', 'items', 'fulfillments'],
          additionalProperties: false,
        },
      },
      required: ['order'],
      additionalProperties: false,
    },
  },
  required: ['context', 'message'],
  additionalProperties: false,
}

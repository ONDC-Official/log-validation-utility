export const onSearchSchemaTRV_12 = {
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
                code: { type: 'string', enum: ['IND'] },
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
        bap_id: { type: 'string' },
        transaction_id: { type: 'string', format: 'uuid' },
        message_id: { type: 'string', format: 'uuid' },
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        action: { type: 'string', enum: ['on_search'] },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
      },
    },
    message: {
      type: 'object',
      required: ['catalog'],
      properties: {
        catalog: {
          type: 'object',
          required: ['descriptor', 'providers'],
          properties: {
            descriptor: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                images: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['url'],
                    properties: {
                      url: { type: 'string', format: 'uri' },
                      size_type: { type: 'string', enum: ['xs'] },
                    },
                  },
                },
              },
            },
            providers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'descriptor', 'items', 'payments'],
                properties: {
                  id: { type: 'string' },
                  descriptor: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                      name: { type: 'string' },
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['url', 'size_type'],
                          properties: {
                            url: { type: 'string', format: 'uri' },
                            size_type: { type: 'string', enum: ['xs'] },
                          },
                        },
                      },
                    },
                  },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'descriptor'],
                      properties: {
                        id: { type: 'string' },
                        descriptor: {
                          type: 'object',
                          required: ['name', 'code'],
                          properties: {
                            name: { type: 'string' },
                            code: {
                              type: 'string',
                              enum: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'],
                            },
                          },
                        },
                      },
                    },
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: [
                        'id',
                        'descriptor',
                        'quantity',
                        'category_ids',
                        'time',
                        'refund_terms',
                        'cancellation_terms',
                        'tags',
                      ],
                      properties: {
                        id: { type: 'string' },
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
                                count: { type: 'integer', minimum: 1 },
                              },
                            },
                          },
                        },
                        category_ids: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        time: {
                          type: 'object',
                          required: ['label', 'duration'],
                          properties: {
                            label: { type: 'string', enum: ['JOURNEY_TIME'] },
                            duration: { type: 'string', pattern: '^PT\\d+H\\d+M$' },
                          },
                        },
                        refund_terms: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['refund_eligible'],
                            properties: {
                              refund_eligible: { type: 'boolean' },
                            },
                          },
                        },
                        cancellation_terms: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['external_ref'],
                            properties: {
                              external_ref: {
                                type: 'object',
                                required: ['url', 'mimetype'],
                                properties: {
                                  url: { type: 'string', format: 'uri' },
                                  mimetype: { type: 'string', enum: ['application/pdf'] },
                                },
                              },
                            },
                          },
                        },
                        add_ons: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['id', 'descriptor', 'price'],
                            properties: {
                              id: { type: 'string' },
                              descriptor: {
                                type: 'object',
                                required: ['name', 'code'],
                                properties: {
                                  name: { type: 'string' },
                                  code: {
                                    type: 'string',
                                    enum: [
                                      'MEALS',
                                      'BAGGAGE',
                                      'FAST_FORWARD',
                                      'TRAVEL_ASSISTANCE',
                                      'FREE_CANCELLATION',
                                      'FREE_DATE_CHANGE',
                                    ],
                                  },
                                  short_desc: { type: 'string' },
                                },
                              },
                              quantity: {
                                type: 'object',
                                properties: {
                                  available: {
                                    type: 'object',
                                    required: ['count'],
                                    properties: {
                                      count: { type: 'integer', minimum: 1 },
                                    },
                                  },
                                },
                              },
                              price: {
                                type: 'object',
                                required: ['currency', 'value'],
                                properties: {
                                  currency: { type: 'string', enum: ['INR'] },
                                  value: { type: 'string', pattern: '^\\d+$' },
                                },
                              },
                            },
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
                                  code: { type: 'string', enum: ['FARE_TYPE', 'GENERAL_INFO'] },
                                  name: { type: 'string' },
                                },
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
                                        name: { type: 'string' },
                                        short_desc: { type: 'string' },
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
                  payments: {
                    type: 'array',
                    items: {
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
            tags: {
              type: 'array',
              items: {
                type: 'object',
                required: ['descriptor', 'display', 'list'],
                properties: {
                  descriptor: {
                    type: 'object',
                    required: ['code', 'name'],
                    properties: {
                      code: { type: 'string', enum: ['PAGINATION'] },
                      name: { type: 'string' },
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
                            code: { type: 'string', enum: ['PAGINATION_ID', 'MAX_PAGE_NUMBER'] },
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
}

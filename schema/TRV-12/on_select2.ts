export const onSelect2SchemaTRV_12 = {
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
                code: { type: 'string' },
              },
              additionalProperties: false,
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
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
        action: { type: 'string', enum: ['on_select'] },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
      },
      additionalProperties: false,
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['provider', 'items', 'fulfillments', 'quote'],
          properties: {
            provider: {
              type: 'object',
              required: ['id', 'descriptor'],
              properties: {
                id: { type: 'string' },
                descriptor: {
                  type: 'object',
                  required: ['name', 'images'],
                  properties: {
                    name: { type: 'string' },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['url', 'size_type'],
                        properties: {
                          url: { type: 'string', format: 'uri' },
                          size_type: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            items: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    required: [
                      'id',
                      'descriptor',
                      'price',
                      'quantity',
                      'category_ids',
                      'fulfillment_ids',
                      'time',
                      'refund_terms',
                      'tags',
                    ],
                    properties: {
                      id: { type: 'string' },
                      descriptor: {
                        type: 'object',
                        required: ['name', 'code'],
                        properties: {
                          name: { type: 'string' },
                          code: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                      price: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' },
                        },
                        additionalProperties: false,
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
                            additionalProperties: false,
                          },
                        },
                      },
                      category_ids: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      fulfillment_ids: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      time: {
                        type: 'object',
                        required: ['label', 'duration'],
                        properties: {
                          label: { type: 'string' },
                          duration: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                      refund_terms: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['refund_eligible'],
                          properties: {
                            refund_eligible: { type: 'boolean' },
                          },
                          additionalProperties: false,
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
                                code: { type: 'string' },
                                name: { type: 'string' },
                              },
                              additionalProperties: false,
                            },
                            display: { type: 'boolean' },
                            list: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['descriptor'],
                                properties: {
                                  descriptor: {
                                    type: 'object',
                                    required: ['code'],
                                    properties: {
                                      code: { type: 'string' },
                                    },
                                    additionalProperties: false,
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
                  {
                    type: 'object',
                    required: [
                      'id',
                      'parent_item_id',
                      'descriptor',
                      'price',
                      'quantity',
                      'category_ids',
                      'fulfillment_ids',
                      'time',
                      'refund_terms',
                      'tags',
                      'add_ons',
                    ],
                    properties: {
                      parent_item_id: { type: 'string' },
                      add_ons: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['id', 'descriptor', 'quantity', 'price'],
                          properties: {
                            id: { type: 'string' },
                            descriptor: {
                              type: 'object',
                              required: ['name', 'code'],
                              properties: {
                                name: { type: 'string' },
                                code: { type: 'string' },
                              },
                              additionalProperties: false,
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
                                  additionalProperties: false,
                                },
                              },
                            },
                            price: {
                              type: 'object',
                              required: ['currency', 'value'],
                              properties: {
                                currency: { type: 'string' },
                                value: { type: 'string' },
                              },
                              additionalProperties: false,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['id', 'type', 'stops', 'vehicle', 'tags'],
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      stops: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['id', 'type', 'location', 'time'],
                          properties: {
                            type: { type: 'string' },
                            location: {
                              type: 'object',
                              required: ['descriptor'],
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  required: ['name', 'code'],
                                  properties: {
                                    name: { type: 'string' },
                                    code: { type: 'string' },
                                  },
                                  additionalProperties: false,
                                },
                              },
                            },
                            time: {
                              type: 'object',
                              required: ['label', 'timestamp'],
                              properties: {
                                label: { type: 'string' },
                                timestamp: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                              },
                            },
                          },
                        },
                      },
                      vehicle: {
                        type: 'object',
                        required: ['category', 'code'],
                        properties: {
                          category: { type: 'string' },
                          code: { type: 'string' },
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
                                code: { type: 'string' },
                                name: { type: 'string' },
                              },
                              additionalProperties: false,
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
                                    additionalProperties: false,
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
                  {
                    type: 'object',
                    required: ['id', 'type', 'tags'],
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
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
                                code: { type: 'string' },
                              },
                              additionalProperties: false,
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
                                      code: { type: 'string' },
                                    },
                                    additionalProperties: false,
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
                ],
              },
            },
            quote: {
              type: 'object',
              required: ['price', 'breakup'],
              properties: {
                price: {
                  type: 'object',
                  required: ['value', 'currency'],
                  properties: {
                    value: { type: 'string' },
                    currency: { type: 'string' },
                  },
                  additionalProperties: false,
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'price'],
                    properties: {
                      title: { type: 'string' },
                      price: {
                        type: 'object',
                        required: ['value', 'currency'],
                        properties: {
                          value: { type: 'string' },
                          currency: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                      item: {
                        type: ['object', 'null'],
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
                                additionalProperties: false,
                              },
                            },
                          },
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
                                    code: { type: 'string' },
                                  },
                                  additionalProperties: false,
                                },
                                list: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['descriptor', 'value'],
                                    properties: {
                                      descriptor: {
                                        type: 'object',
                                        required: ['name'],
                                        properties: {
                                          name: { type: 'string' },
                                        },
                                        additionalProperties: false,
                                      },
                                      value: { type: 'string' },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          add_ons: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['id'],
                              properties: {
                                id: { type: 'string' },
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
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

export const onSelectSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'on_select',
        },
        core_version: {
          type: 'string',
          enum: ['1.2.5'],
          minLength: 1,
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
      },
      required: [
        'domain',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'city',
        'country',
        'timestamp',
      ],
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
                id: {
                  type: 'string',
                  minLength: 1,
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['id'],
                  },
                },
              },
              required: ['id', 'locations'],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  fulfillment_id: {
                    type: 'string',
                    minLength: 1,
                  },
                  parent_item_id: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'object',
                    properties: {
                      count: { type: 'integer' },
                    },
                  },
                },
                required: ['id', 'fulfillment_id'],
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['Delivery', 'Self-Pickup', 'Buyer-Delivery'],
                  },
                  id: {
                    type: 'string',
                  },
                  '@ondc/org/provider_name': {
                    type: 'string',
                  },
                  tracking: {
                    type: 'boolean',
                  },
                  '@ondc/org/category': {
                    type: 'string',
                    enum: [
                      'Takeaway',
                      'Kerbside',
                      'Immediate Delivery',
                      'Standard Delivery',
                      'Express Delivery',
                      'Same Day Delivery',
                      'Next Day Delivery',
                    ],
                  },
                  '@ondc/org/TAT': {
                    type: 'string',
                    format: 'duration',
                  },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            enum: ['Serviceable', 'Non-serviceable'],
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                },
                required: ['id', '@ondc/org/provider_name', '@ondc/org/category', '@ondc/org/TAT', 'state'],
              },
            },
            offers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Unique identifier for the offer.',
                  },
                  descriptor: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        description: 'Type of the offer (e.g., discount, buyXgetY, freebie).',
                        enum: ['discount', 'buyXgetY', 'freebie', 'slab', 'combo', 'delivery', 'exchange', 'financing']
                      },
                      images: {
                        type: 'array',
                        items: {
                          type: 'string',
                          format: 'uri',
                          description: 'URL to images related to the offer.',
                        },
                      },
                    },
                    required: ['code', 'images'],
                  },
                  location_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'List of location identifiers where the offer is valid.',
                    },
                  },
                  item_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'List of item identifiers applicable for the offer.',
                    },
                  },
                  time: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        description: 'Label for the time validity of the offer (e.g., valid).',
                      },
                      range: {
                        type: 'object',
                        properties: {
                          start: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Start date and time for the offer.',
                          },
                          end: {
                            type: 'string',
                            format: 'date-time',
                            description: 'End date and time for the offer.',
                          },
                        },
                        required: ['start', 'end'],
                      },
                    },
                    required: ['label', 'range'],
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          description: 'Type of the tag (e.g., qualifier, benefit, meta).',
                          enum: ['qualifier', 'benefit', 'meta']
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                description: 'Code representing the specific tag property.',
                                enum: ['min_value', 'value_type', 'value', 'additive', 'item_count', 'item_id', 'item_value']
                              },
                              value: {
                                type: 'string',
                                description: 'Value for the tag property.',
                              },
                            },

                          },
                          required: ['code', 'value'],
                        },
                      },
                    },
                    required: ['code', 'list'],
                  },
                },
              },

              required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags',],

            },
            quote: {
              type: 'object',
              properties: {
                price: {
                  type: 'object',
                  properties: {
                    currency: {
                      type: 'string',
                    },
                    value: {
                      type: 'string',
                      pattern: '^[0-9]+(\.[0-9]{1,2})?$',
                      errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                    },
                  },
                  required: ['currency', 'value'],
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      '@ondc/org/item_id': {
                        type: 'string',
                      },
                      '@ondc/org/item_quantity': {
                        type: 'object',
                        properties: {
                          count: {
                            type: 'integer',
                          },
                        },
                      },
                      title: {
                        type: 'string',
                      },
                      '@ondc/org/title_type': {
                        type: 'string',
                        enum: ['item', 'delivery', 'packing', 'tax', 'misc', 'discount', 'offer'],
                      },
                      price: {
                        type: 'object',
                        properties: {
                          currency: {
                            type: 'string',
                          },
                          value: {
                            type: 'string',
                            pattern: '^[-+]?[0-9]+(\.[0-9]{1,2})?$',
                            errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                          },
                        },
                        required: ['currency', 'value'],
                      },
                      item: {
                        type: 'object',
                        properties: {
                          parent_item_id: {
                            type: 'string',
                          },
                          quantity: {
                            type: 'object',
                            properties: {
                              available: {
                                type: 'object',
                                properties: {
                                  count: {
                                    type: 'string',
                                    enum: ['99', '0'],
                                    errorMessage: 'available count must be either 99 or 0 only',
                                  },
                                },
                                required: ['count'],
                              },
                              maximum: {
                                type: 'object',
                                properties: {
                                  count: {
                                    type: 'string',
                                  },
                                },
                                required: ['count'],
                              },
                            },
                            required: ['available', 'maximum'],
                          },
                          price: {
                            type: 'object',
                            properties: {
                              currency: {
                                type: 'string',
                              },
                              value: {
                                type: 'string',
                                pattern: '^[-+]?[0-9]+(\.[0-9]{1,2})?$',
                                errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                              },
                            },
                            required: ['currency', 'value'],
                          },
                          tags: {
                            type: 'array',
                            minItems: 2,
                            items: {
                              oneOf: [
                                {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      const: 'quote',
                                    },
                                    list: {
                                      type: 'array',
                                      items: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            type: 'string',
                                          },
                                          value: {
                                            type: 'string',
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                      minItems: 1,
                                    },
                                  },
                                  required: ['code', 'list'],
                                },
                                {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      const: 'offer',
                                    },
                                    list: {
                                      type: 'array',
                                      items: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            type: 'string',
                                            enum: [
                                              'id',
                                              'type',
                                              'auto',
                                              'additive',
                                              'item_id',
                                              'item_value',
                                              'item_count',
                                            ],
                                          },
                                          value: {
                                            type: 'string',
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                      uniqueItems: true,
                                    },
                                  },
                                  required: ['code', 'list'],
                                },
                              ],
                            },
                          },
                        },
                      },
                      ttl: {
                        type: 'string',
                        format: 'duration',
                      },
                    },
                    required: ['@ondc/org/item_id', 'title', '@ondc/org/title_type', 'price'],
                  },
                },
              },
              required: ['price', 'breakup'],
            },
          },
          required: ['provider', 'items', 'fulfillments', 'quote'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}

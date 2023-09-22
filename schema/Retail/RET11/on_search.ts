module.exports = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          const: 'ONDC:RET11',
        },
        action: {
          type: 'string',
          const: 'on_search',
        },
        country: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        core_version: {
          type: 'string',
          const: '1.2.0',
        },
        bap_id: {
          type: 'string',
        },
        bap_uri: {
          type: 'string',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
      },
      required: [
        'domain',
        'country',
        'city',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'timestamp',
      ],
    },
    message: {
      type: 'object',
      properties: {
        catalog: {
          type: 'object',
          properties: {
            'bpp/fulfillments': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                  },
                },
                required: ['id', 'type'],
              },
            },
            'bpp/descriptor': {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                symbol: {
                  type: 'string',
                },
                short_desc: {
                  type: 'string',
                },
                long_desc: {
                  type: 'string',
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    pattern:
                      '/(https://www.|http://www.|https://|http://)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?/',
                  },
                },
              },
              required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
            },
            'bpp/providers': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  time: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                      },
                      timestamp: {
                        type: 'string',
                      },
                    },
                    required: ['label', 'timestamp'],
                  },
                  fulfillments: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        contact: {
                          type: 'object',
                          properties: {
                            phone: {
                              type: 'string',
                            },
                            email: {
                              type: 'string',
                            },
                          },
                          required: ['phone', 'email'],
                        },
                      },
                      required: ['contact'],
                    },
                  },
                  descriptor: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      symbol: {
                        type: 'string',
                      },
                      short_desc: {
                        type: 'string',
                      },
                      long_desc: {
                        type: 'string',
                      },
                      images: {
                        type: 'array',
                        items: {
                          type: 'string',
                          pattern:
                            '/(https://www.|http://www.|https://|http://)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?/',
                        },
                      },
                    },
                    required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
                  },
                  '@ondc/org/fssai_license_no': {
                    type: 'string',
                  },
                  ttl: {
                    type: 'string',
                  },
                  locations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                            },
                            timestamp: {
                              type: 'string',
                            },
                            days: {
                              type: 'string',
                            },
                            schedule: {
                              type: 'object',
                              properties: {
                                holidays: {
                                  type: 'array',
                                  items: [
                                    {
                                      type: 'string',
                                    },
                                  ],
                                },
                                frequency: {
                                  type: 'string',
                                },
                                times: {
                                  type: 'array',
                                  items: [
                                    {
                                      type: 'string',
                                    },
                                    {
                                      type: 'string',
                                    },
                                  ],
                                },
                              },
                              required: ['holidays', 'frequency', 'times'],
                            },
                            range: {
                              type: 'object',
                              properties: {
                                start: {
                                  type: 'string',
                                },
                                end: {
                                  type: 'string',
                                },
                              },
                              required: ['start', 'end'],
                            },
                          },
                          required: ['timestamp'],
                        },
                        gps: {
                          type: 'string',
                        },
                        address: {
                          type: 'object',
                          properties: {
                            locality: {
                              type: 'string',
                            },
                            street: {
                              type: 'string',
                            },
                            city: {
                              type: 'string',
                            },
                            area_code: {
                              type: 'string',
                            },
                            state: {
                              type: 'string',
                            },
                          },
                          required: ['locality', 'street', 'city', 'area_code', 'state'],
                        },
                        circle: {
                          type: 'object',
                          properties: {
                            gps: {
                              type: 'string',
                            },
                            radius: {
                              type: 'object',
                              properties: {
                                unit: {
                                  type: 'string',
                                },
                                value: {
                                  type: 'string',
                                },
                              },
                              required: ['unit', 'value'],
                            },
                          },
                          required: ['gps', 'radius'],
                        },
                      },
                      required: ['id', 'time'],
                    },
                  },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        parent_category_id: {
                          type: 'string',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                            short_desc: {
                              type: 'string',
                            },
                            long_desc: {
                              type: 'string',
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                pattern:
                                  '/(https://www.|http://www.|https://|http://)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?/',
                              },
                            },
                          },
                          required: ['name'],
                        },
                        tags: {
                          type: 'array',
                          items: [
                            {
                              type: 'object',
                              properties: {
                                code: {
                                  type: 'string',
                                },
                                list: {
                                  type: 'array',
                                  items: [
                                    {
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
                                  ],
                                },
                              },
                              required: ['code', 'list'],
                            },
                            {
                              type: 'object',
                              properties: {
                                code: {
                                  type: 'string',
                                },
                                list: {
                                  type: 'array',
                                  items: [
                                    {
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
                                    {
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
                                    {
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
                                    {
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
                                  ],
                                },
                              },
                              required: ['code', 'list'],
                            },
                            {
                              type: 'object',
                              properties: {
                                code: {
                                  type: 'string',
                                },
                                list: {
                                  type: 'array',
                                  items: [
                                    {
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
                                  ],
                                },
                              },
                              required: ['code', 'list'],
                            },
                          ],
                        },
                      },
                      required: ['id', 'descriptor', 'tags'],
                    },
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                            },
                            timestamp: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'timestamp'],
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                            symbol: {
                              type: 'string',
                            },
                            short_desc: {
                              type: 'string',
                            },
                            long_desc: {
                              type: 'string',
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                pattern:
                                  '/(https://www.|http://www.|https://|http://)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?/',
                              },
                            },
                          },
                          required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
                        },
                        quantity: {
                          type: 'object',
                          properties: {
                            unitized: {
                              type: 'object',
                              properties: {
                                measure: {
                                  type: 'object',
                                  properties: {
                                    unit: {
                                      type: 'string',
                                    },
                                    value: {
                                      type: 'string',
                                    },
                                  },
                                  required: ['unit', 'value'],
                                },
                              },
                              required: ['measure'],
                            },
                            available: {
                              type: 'object',
                              properties: {
                                count: {
                                  type: 'string',
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
                          required: ['unitized', 'available', 'maximum'],
                        },
                        price: {
                          type: 'object',
                          properties: {
                            currency: {
                              type: 'string',
                            },
                            value: {
                              type: 'string',
                            },
                            maximum_value: {
                              type: 'string',
                            },
                          },
                          required: ['currency', 'value', 'maximum_value'],
                        },
                        category_id: {
                          type: 'string',
                        },
                        category_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        fulfillment_id: {
                          type: 'string',
                        },
                        location_id: {
                          type: 'string',
                        },
                        related: {
                          type: 'boolean',
                        },
                        recommended: {
                          type: 'boolean',
                        },
                        '@ondc/org/returnable': {
                          type: 'boolean',
                        },
                        '@ondc/org/cancellable': {
                          type: 'boolean',
                        },
                        '@ondc/org/return_window': {
                          type: 'string',
                        },
                        '@ondc/org/seller_pickup_return': {
                          type: 'boolean',
                        },
                        '@ondc/org/time_to_ship': {
                          type: 'string',
                        },
                        '@ondc/org/available_on_cod': {
                          type: 'boolean',
                        },
                        '@ondc/org/contact_details_consumer_care': {
                          type: 'string',
                        },
                        tags: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
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
                              },
                            },
                            required: ['code', 'list'],
                          },
                        },
                      },
                      required: [
                        'id',
                        'time',
                        'descriptor',
                        'quantity',
                        'price',
                        'category_id',
                        'category_ids',
                        'fulfillment_id',
                        'location_id',
                        'related',
                        'recommended',
                        '@ondc/org/returnable',
                        '@ondc/org/cancellable',
                        '@ondc/org/return_window',
                        '@ondc/org/seller_pickup_return',
                        '@ondc/org/time_to_ship',
                        '@ondc/org/available_on_cod',
                        '@ondc/org/contact_details_consumer_care',
                        'tags',
                      ],
                    },
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
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
                        },
                      },
                      required: ['code', 'list'],
                    },
                  },
                },
                required: ['id'],
              },
            },
          },
          required: ['bpp/providers'],
        },
      },
      required: ['catalog'],
    },
  },
  required: ['context', 'message'],
}

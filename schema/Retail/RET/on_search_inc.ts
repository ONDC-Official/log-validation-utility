export const onSearchIncSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
        },
        action: {
          type: 'string',
          const: 'on_search',
        },
        country: {
          type: 'string',
          const: 'IND',
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
          format: 'url',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
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
                    enum: ['Self-Pickup','Delivery'],
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
                        enum: ['enable', 'disable', 'close'],
                      },
                      timestamp: {
                        type: 'string',
                        format: 'rfc3339-date-time',
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
                              minLength: 10,
                              maxLength: 11,
                            },
                            email: {
                              type: 'string',
                              format: 'email',
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
                        },
                      },
                    },
                    required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
                  },
                  '@ondc/org/fssai_license_no': {
                    type: 'string',
                    minLength: 14,
                    maxLength: 14,
                  },
                  ttl: {
                    type: 'string',
                    format: 'duration',
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
                              enum: ['enable', 'disable', 'open', 'close'],
                            },
                            timestamp: {
                              type: 'string',
                              format: 'rfc3339-date-time',
                            },
                            days: {
                              type: 'string',
                            },
                            schedule: {
                              type: 'object',
                              properties: {
                                holidays: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                    format: 'date',
                                  },
                                },
                                frequency: {
                                  type: 'string',
                                  format: 'duration',
                                },
                                times: {
                                  type: 'array',
                                  minItems: 1,
                                  items: {
                                    type: 'string',
                                    minLength: 4,
                                    maxLength: 4,
                                  },
                                },
                              },
                              required: ['holidays'],
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
                          required: ['label', 'timestamp','schedule'],
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
                              minLength: 6,
                              maxLength: 6,
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

                              errorMessage:
                                'The gps co-ordinates should be precise atleast upto 6 digits after decimal',
                            },
                            radius: {
                              type: 'object',
                              properties: {
                                unit: {
                                  type: 'string',
                                  const: 'km',
                                },
                                value: {
                                  type: 'string',
                                },
                              },
                              required: ['unit', 'value'],
                            },
                          },
                          required: ['radius', 'gps'],
                        },
                      },
                      required: ['id', 'time', 'gps', 'address', 'circle'],
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
                              },
                            },
                          },
                          required: ['name'],
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
                      required: ['id', 'tags'],
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
                              enum: ['enable', 'disable'],
                            },
                            timestamp: {
                              type: 'string',
                              format: 'rfc3339-date-time',
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
                              },
                            },
                          },
                          required: ['name'],
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
                                      enum: ['unit', 'dozen', 'gram', 'kilogram', 'tonne', 'litre', 'millilitre'],
                                    },
                                    value: {
                                      pattern :"^[0-9]+(\.[0-9]+)?$",
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
                                  type:'string',
                                  enum: ['99','0'],
                                  errorMessage:
                                    'available count must be either 99 or 0 only',
                                },
                              },
                              required: ['count'],
                            },
                            maximum: {
                              type: 'object',
                              properties: {
                                count: {
                                  type: 'string',
                                  pattern: '^[0-9]+$',
                                  errorMessage:
                                    'maximum count must be numbers only ',
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
                              const: 'INR',
                            },
                            value: {
                              type: 'string',
                              pattern : '^[-+]?[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Price value should be a number in string with upto 2 decimal places'
                            },
                            maximum_value: {
                              type: 'string',
                              pattern : '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Price value should be a number in string with upto 2 decimal places'

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
                            pattern: '^[a-zA-Z0-9]{1,12}:[a-zA-Z0-9]{1,12}$',
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
                          type: ['string', 'null'],
                          format: 'duration',
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
                      required: ['id', 'descriptor', 'quantity', 'price', 'category_id', 'tags'],
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

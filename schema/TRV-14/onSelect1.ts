const onSelect1SchemaTRV14 = {
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
        action: { type: 'string', enum: ['on_select'] },
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
          required: ['items', 'fulfillments', 'provider', 'quote', 'replacement_terms'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'descriptor', 'location_ids', 'category_ids'],
                additionalProperties: false,
                properties: {
                  id: { type: 'string',minLength: 1 },
                  descriptor: {
                    type: 'object',
                    required: ['name', 'code'],
                    properties: {
                      name: { type: 'string' },
                      code: { type: 'string', enum: ['ENTRY_PASS', 'ABSTRACT', 'ADD_ON'] },
                    },
                  },
                  location_ids: { type: 'array', items: { type: 'string' } },
                  category_ids: { type: 'array', items: { type: 'string' } },
                  time: {},
                  parent_item_id: { type: 'string' },
                  fulfillment_ids: {
                    type:"array",
                    items: {
                      type: "string"
                      }
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                        },
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
                            },
                            value: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                  price: {
                    type: 'object',
                    required: ['value', 'currency'],
                    properties: {
                      curreny: { type: 'string', enum: ['INR'] },
                      value: { type: 'string', minlength: 1 },
                    },
                  },
                  quantity: {
                    type: 'object',
                    properties: {
                      selected: {
                        type: 'object',
                        properties: {
                          count: { type: 'integer' },
                        },
                        required: ['count'],
                      },
                    },
                    required: ['selected'],
                  },
                  add_ons: {},
                  xinput: {},
                },
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'type', 'stops', 'vehicle'],
                additionalProperties: false,
                properties: {
                  id: { type: 'string',minLength:1 },
                  type: { type: 'string', enum: ['VISIT'] },
                  stops: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['type', 'time'],
                      properties: {
                        type: { type: 'string', enum: ['START', 'END'] },
                        time: {
                          type: 'object',
                          required: ['timestamp'],
                          properties: {
                            timestamp: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                  agent: {
                    type: 'object',
                    properties: {
                      organization: {
                        type: 'object',
                        properties: {
                          contact: {
                            type: 'object',
                            required: ['phone', 'email'],
                            additionalProperties: false,
                            properties: {
                              phone: { type: 'string',minLength:1 },
                              email: { type: 'string',minLength:1 },
                            },
                          },
                        },
                      },
                    },
                  },
                  vehicle: {
                    type: 'object',
                    required: ['category'],
                    properties: {
                      category: { type: 'string', enum: ['SITE'] },
                    },
                  },
                },
              },
            },
            provider: {
              type: 'object',
              required: ['id', 'descriptor'],
              additionalProperties: false,
              properties: {
                id: { type: 'string',minLength:1 },
                descriptor: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string',minLength:1 },
                  },
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' ,minLength:1},
                      gps: { type: 'string' ,minLength:1},
                      descriptor: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' ,minLength:1 },
                          short_desc: { type: 'string' ,minLength:1 },
                          additional_desc: {
                            type: 'object',
                            properties: {
                              url: { type: 'string' },
                              content_type: { type: 'string' },
                            },
                          },
                          images: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                url: { type: 'string' },
                                size_type: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                      rating: { type: 'string' ,minLength:1},
                    },
                    required: ['id', 'gps', 'descriptor'],
                  },
                },
              },
            },
            quote: {
              type: 'object',
              required: ['breakup', 'price'],
              properties: {
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'price'],
                    properties: {
                      title: { type: 'string' ,minLength:1 },
                      price: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' ,minLength:1 },
                        },
                      },
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
                },
              },
            },
            replacement_terms: {
              type: 'array',
              items: {
                type: 'object',
                required: ['external_ref'],
                properties: {
                  external_ref: {
                    type: 'object',
                    required: ['mimetype', 'url'],
                    properties: {
                      mimetype: {
                        type: 'string',
                        enum: ['text/html', 'text/plain', 'application/pdf'],
                      },
                      url: {
                        type: 'string',
                        format: 'uri',
                        pattern: '^https://',
                      },
                    },
                  },
                },
              },
            },
            cancellation_terms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cancellation_fee: {
                    type: 'object',
                    properties: {
                      percentage: { type: 'string' },
                    },
                  },
                  fulfillment_state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                        },
                      },
                    },
                  },
                  cancel_by: {
                    type: 'object',
                    properties: {
                      label: { type: 'string' },
                      duration: { type: 'string' },
                    },
                  },
                  cancellation_eligible: { type: 'boolean' },
                  external_ref: {
                    type: 'object',
                    properties: {
                      mimetype: { type: 'string' },
                      url: { type: 'string' },
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
}

export default onSelect1SchemaTRV14

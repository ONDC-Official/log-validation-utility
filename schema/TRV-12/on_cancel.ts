export const onCancelSchemaTRV_12 = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: ['location', 'domain', 'timestamp', 'bap_id', 'transaction_id', 'message_id'],
      properties: {
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: {
                  type: 'string',
                },
              },
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: {
                  type: 'string',
                  pattern: '^std:\\d+$',
                },
              },
            },
          },
        },
        domain: {
          type: 'string',
          enum: ['ONDC:TRV12'],
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        bap_id: {
          type: 'string',
        },
        transaction_id: {
          type: 'string',
          format: 'uuid',
        },
        message_id: {
          type: 'string',
          format: 'uuid',
        },
        version: {
          type: 'string',
          pattern: '^\\d+\\.\\d+\\.\\d+$',
        },
        action: {
          type: 'string',
          enum: ['on_cancel'],
        },
        bap_uri: {
          type: 'string',
          format: 'uri',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
          format: 'uri',
        },
        ttl: {
          type: 'string',
          pattern: '^PT\\d+S$',
        },
      },
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: [
            'id',
            'provider',
            'items',
            'fulfillments',
            'quote',
            'payments',
            'status',
            'cancellation',
            'billing',
          ],
          properties: {
            id: {
              type: 'string',
            },
            provider: {
              type: 'object',
              required: ['id', 'descriptor'],
              properties: {
                id: {
                  type: 'string',
                },
                descriptor: {
                  type: 'object',
                  required: ['name', 'images'],
                  properties: {
                    name: {
                      type: 'string',
                    },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['url', 'size_type'],
                        properties: {
                          url: {
                            type: 'string',
                            format: 'uri',
                          },
                          size_type: {
                            type: 'string',
                            enum: ['xs'],
                          },
                        },
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
                  'price',
                  'quantity',
                  'category_ids',
                  'fulfillment_ids',
                  'time',
                  'refund_terms',
                  'tags',
                ],
                properties: {
                  id: {
                    type: 'string',
                  },
                  descriptor: {
                    type: 'object',
                    required: ['name', 'code'],
                    properties: {
                      name: {
                        type: 'string',
                      },
                      code: {
                        type: 'string',
                      },
                    },
                  },
                  price: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: {
                        type: 'string',
                        enum: ['INR'],
                      },
                      value: {
                        type: 'string',
                        pattern: '^\\d+$',
                      },
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
                          count: {
                            type: 'number',
                          },
                        },
                      },
                    },
                  },
                  category_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  fulfillment_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  time: {
                    type: 'object',
                    required: ['label', 'duration'],
                    properties: {
                      label: {
                        type: 'string',
                        enum: ['JOURNEY_TIME'],
                      },
                      duration: {
                        type: 'string',
                        pattern: '^PT\\d+H\\d+M$',
                      },
                    },
                  },
                  refund_terms: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['refund_eligible'],
                      properties: {
                        refund_eligible: {
                          type: 'boolean',
                        },
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
                          required: ['code', 'name'],
                          properties: {
                            code: {
                              type: 'string',
                            },
                            name: {
                              type: 'string',
                            },
                          },
                        },
                        display: {
                          type: 'boolean',
                        },
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
                                  code: {
                                    type: 'string',
                                  },
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
                  },
                },
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['id', 'type', 'stops', 'customer', 'vehicle'],
                    properties: {
                      id: {
                        type: 'string',
                      },
                      type: {
                        type: 'string',
                        enum: ['TRIP'],
                      },
                      stops: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['type', 'id', 'location', 'time'],
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['START', 'END'],
                            },
                            id: {
                              type: 'string',
                            },
                            location: {
                              type: 'object',
                              required: ['descriptor'],
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  required: ['name', 'code'],
                                  properties: {
                                    name: {
                                      type: 'string',
                                    },
                                    code: {
                                      type: 'string',
                                      pattern: '^[A-Z]{3}$',
                                    },
                                  },
                                },
                              },
                            },
                          },
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
                              name: {
                                type: 'string',
                              },
                              age: {
                                type: 'string',
                                pattern: '^\\d+$',
                              },
                              gender: {
                                type: 'string',
                                enum: ['MALE'],
                              },
                              dob: {
                                type: 'string',
                                format: 'date',
                              },
                            },
                          },
                          contact: {
                            type: 'object',
                            required: ['phone', 'email'],
                            properties: {
                              phone: {
                                type: 'string',
                                pattern: '^\\+91-\\d{10}$',
                              },
                              email: {
                                type: 'string',
                                format: 'email',
                              },
                            },
                          },
                        },
                      },
                      vehicle: {
                        type: 'object',
                        required: ['category', 'code'],
                        properties: {
                          category: {
                            type: 'string',
                            enum: ['AIRLINE'],
                          },
                          code: {
                            type: 'string',
                            pattern: '^\\d+E\\d+$',
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'object',
                    required: ['id', 'type', 'tags'],
                    properties: {
                      id: {
                        type: 'string',
                        pattern: '^FT_\\d+$',
                      },
                      type: {
                        type: 'string',
                        enum: ['TICKET'],
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
                                code: {
                                  type: 'string',
                                  enum: ['SEAT_GRID'],
                                },
                              },
                            },
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
                                      code: {
                                        type: 'string',
                                      },
                                      value: {
                                        type: 'string',
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
                    value: {
                      type: 'string',
                      pattern: '^\\d+$',
                    },
                    currency: {
                      type: 'string',
                      enum: ['INR'],
                    },
                  },
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'price'],
                    properties: {
                      title: {
                        type: 'string',
                        enum: [
                          'BASE_FARE',
                          'TAX',
                          'CONVENIENCE_FEE',
                          'SEAT_FARE',
                          'ADD_ONS',
                          'OTHER_CHARGES',
                          'REFUND',
                          'CANCELLATION_CHARGES',
                        ],
                      },
                      price: {
                        type: 'object',
                        required: ['value', 'currency'],
                        properties: {
                          value: {
                            type: 'string',
                            pattern: '^[-]?\\d+$',
                          },
                          currency: {
                            type: 'string',
                            enum: ['INR'],
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
                required: ['id', 'collected_by', 'status', 'type', 'params', 'tags'],
                properties: {
                  id: {
                    type: 'string',
                    pattern: '^PA\\d+$',
                  },
                  collected_by: {
                    type: 'string',
                    enum: ['BAP'],
                  },
                  status: {
                    type: 'string',
                    enum: ['PAID'],
                  },
                  type: {
                    type: 'string',
                    enum: ['PRE-ORDER'],
                  },
                  params: {
                    type: 'object',
                    required: ['transaction_id', 'currency', 'amount', 'bank_code', 'virtual_payment_address'],
                    properties: {
                      transaction_id: {
                        type: 'string',
                        format: 'uuid',
                      },
                      currency: {
                        type: 'string',
                        enum: ['INR'],
                      },
                      amount: {
                        type: 'string',
                        pattern: '^\\d+$',
                      },
                      bank_code: {
                        type: 'string',
                      },
                      virtual_payment_address: {
                        type: 'string',
                        pattern: '^\\d{10}@[^@]+$',
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
                            code: {
                              type: 'string',
                              enum: ['BUYER_FINDER_FEES', 'SETTLEMENT_TERMS'],
                            },
                          },
                        },
                        display: {
                          type: 'boolean',
                        },
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
                                  code: {
                                    type: 'string',
                                  },
                                  value: {
                                    type: 'string',
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
            status: {
              type: 'string',
              enum: ['CANCELLED'],
            },
            cancellation: {
              type: 'object',
              required: ['cancelled_by', 'time'],
              properties: {
                cancelled_by: {
                  type: 'string',
                  enum: ['CONSUMER'],
                },
                time: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
            cancellation_terms: {
              type: 'array',
              items: {
                type: 'object',
                required: ['cancel_by', 'cancellation_fee'],
                properties: {
                  cancel_by: {
                    type: 'object',
                    required: ['duration'],
                    properties: {
                      duration: {
                        type: 'string',
                        pattern: '^PT\\d+M$',
                      },
                    },
                  },
                  cancellation_fee: {
                    type: 'object',
                    required: ['percentage'],
                    properties: {
                      percentage: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100,
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
                name: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                  pattern: '^\\+91-\\d{10}$',
                },
                tax_id: {
                  type: 'string',
                  pattern: '^GSTIN:\\d{10}[A-Z]$',
                },
              },
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
}

export const onConfirmFIS12PurchaseFinanceSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          const: 'ONDC:FIS12',
        },
        action: {
          type: 'string',
          const: 'on_confirm',
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          minLength: 1,
          format: 'uri',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          minLength: 1,
          format: 'uri',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
      },
      required: [
        'domain',
        'action',
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
        order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              minLength: 1,
            },
            status: {
              type: 'string',
              const: 'ACTIVE',
            },
            provider: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                descriptor: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['name'],
                },
              },
              required: ['id', 'descriptor'],
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
                  descriptor: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['name'],
                  },
                  fulfillment_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                      minLength: 1,
                    },
                    minItems: 1,
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              enum: ['INFO', 'CHECKLISTS'],
                            },
                          },
                          required: ['code'],
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              descriptor: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    minLength: 1,
                                  },
                                },
                                required: ['code'],
                              },
                              value: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['descriptor', 'value'],
                          },
                          minItems: 1,
                        },
                      },
                      required: ['descriptor', 'list'],
                    },
                  },
                },
                required: ['id', 'descriptor', 'fulfillment_ids'],
              },
              minItems: 1,
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    enum: ['LOAN', 'BASE_ORDER'],
                  },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            enum: ['SANCTIONED', 'PLACED'],
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                  customer: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['name'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: {
                            type: 'string',
                            minLength: 1,
                          },
                          email: {
                            type: 'string',
                            format: 'email',
                          },
                        },
                        required: ['phone', 'email'],
                      },
                    },
                    required: ['person', 'contact'],
                  },
                },
                required: ['id', 'type', 'state', 'customer'],
              },
              minItems: 2,
            },
            quote: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                price: {
                  type: 'object',
                  properties: {
                    currency: {
                      type: 'string',
                      minLength: 1,
                    },
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['currency', 'value'],
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        minLength: 1,
                      },
                      price: {
                        type: 'object',
                        properties: {
                          currency: {
                            type: 'string',
                            minLength: 1,
                          },
                          value: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['currency', 'value'],
                      },
                    },
                    required: ['title', 'price'],
                  },
                  minItems: 1,
                },
              },
              required: ['id', 'price', 'breakup'],
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    enum: ['PRE_ORDER', 'ON_ORDER', 'POST_FULFILLMENT'],
                  },
                  collected_by: {
                    type: 'string',
                    enum: ['BAP', 'BPP'],
                  },
                  status: {
                    type: 'string',
                    enum: ['PAID', 'NOT-PAID'],
                  },
                  params: {
                    type: 'object',
                    properties: {
                      transaction_id: {
                        type: 'string',
                        minLength: 1,
                      },
                      amount: {
                        type: 'string',
                        minLength: 1,
                      },
                      currency: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                  },
                  time: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        enum: ['INSTALLMENT'],
                      },
                      range: {
                        type: 'object',
                        properties: {
                          start: {
                            type: 'string',
                            format: 'date-time',
                          },
                          end: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                        required: ['start', 'end'],
                      },
                    },
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              enum: ['BREAKUP', 'BAP_TERMS', 'BPP_TERMS'],
                            },
                          },
                          required: ['code'],
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              descriptor: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    minLength: 1,
                                  },
                                },
                                required: ['code'],
                              },
                              value: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['descriptor', 'value'],
                          },
                          minItems: 1,
                        },
                      },
                      required: ['descriptor', 'list'],
                    },
                  },
                },
                required: ['id', 'type'],
                allOf: [
                  {
                    if: {
                      properties: { type: { enum: ['PRE_ORDER', 'ON_ORDER'] } }
                    },
                    then: {
                      required: ['collected_by', 'status']
                    }
                  }
                ]
              },
              minItems: 1,
            },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  descriptor: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        enum: ['LOAN_AGREEMENT'],
                      },
                    },
                    required: ['code'],
                  },
                  mime_type: {
                    type: 'string',
                    minLength: 1,
                  },
                  url: {
                    type: 'string',
                    format: 'uri',
                  },
                },
                required: ['descriptor', 'mime_type', 'url'],
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
                      percentage: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['percentage'],
                  },
                  external_ref: {
                    type: 'object',
                    properties: {
                      mimetype: {
                        type: 'string',
                        minLength: 1,
                      },
                      url: {
                        type: 'string',
                        format: 'uri',
                      },
                    },
                    required: ['mimetype', 'url'],
                  },
                  fulfillment_state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                },
                oneOf: [
                  { required: ['cancellation_fee'] },
                  { required: ['external_ref'] }
                ],
              },
              minItems: 1,
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
          required: [
            'id',
            'status',
            'provider',
            'items',
            'fulfillments',
            'quote',
            'payments',
            'cancellation_terms',
            'created_at',
            'updated_at',
          ],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}; 
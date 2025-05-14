export const onInitFIS12PurchaseFinanceSchema = {
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
          const: 'on_init',
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
                  xinput: {
                    type: 'object',
                    properties: {
                      form: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            minLength: 1,
                          },
                          url: {
                            type: 'string',
                            format: 'uri',
                          },
                        },
                        required: ['id'],
                      },
                    },
                    required: ['form'],
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
                              enum: ['INFO', 'LOAN_DETAILS', 'CHECKLISTS', 'CONSENT_INFO'],
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
                required: ['id', 'descriptor', 'price'],
              },
              minItems: 1,
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
                              enum: ['BPP_TERMS', 'PAYMENT_DETAILS', 'BREAKUP', 'BAP_TERMS'],
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
          },
          required: ['provider', 'items', 'quote', 'payments'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}; 
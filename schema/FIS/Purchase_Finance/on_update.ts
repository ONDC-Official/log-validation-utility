export const onUpdateFIS12PurchaseFinanceSchema = {
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
          const: 'on_update',
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
              enum: ['ACTIVE', 'COMPLETE'],
            },
            provider: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['id'],
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
                  fulfillment_ids: {
                    type: 'array',
                    items: {
                      type: 'string',
                      minLength: 1,
                    },
                    minItems: 1,
                  },
                },
                required: ['id', 'fulfillment_ids'],
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
                            enum: ['SANCTIONED', 'DISBURSED', 'DELIVERED', 'PLACED'],
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
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
                              const: 'INFO',
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
                  customer: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          creds: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  const: 'IMEI',
                                },
                                id: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['type', 'id'],
                            },
                          },
                        },
                      },
                    },
                  },
                },
                required: ['id', 'type', 'state'],
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
                    enum: ['PAID', 'NOT-PAID', 'DEFERRED'],
                  },
                  time: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        enum: ['INSTALLMENT', 'MISSED_EMI_PAYMENT', 'PRE_PART_PAYMENT', 'FORECLOSURE'],
                      },
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
                        enum: ['LOAN_AGREEMENT', 'LOAN_CANCELLATION'],
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
            'documents',
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
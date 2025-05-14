export const confirmFIS12PurchaseFinanceSchema = {
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
          const: 'confirm',
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
        ttl: {
          type: 'string',
          pattern: '^PT[0-9]+[HMS]',
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
        'ttl',
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
                required: ['id'],
              },
              minItems: 1,
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
                              enum: ['BAP_TERMS', 'BPP_TERMS'],
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
                required: ['id', 'type', 'collected_by', 'status'],
              },
              minItems: 1,
            },
          },
          required: ['provider', 'items', 'payments'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}; 
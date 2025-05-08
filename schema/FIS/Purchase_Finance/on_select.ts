export const onSelectFIS12PurchaseFinanceSchema = {
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
          const: 'on_select',
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
                            enum: ['CONTACT_INFO', 'BPP_TERMS', 'LSP_INFO', 'GRO_DETAILS'],
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
                              enum: ['INFO', 'CHECKLISTS', 'CONSENT_INFO', 'LOAN_DETAILS'],
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
                  xinput: {
                    type: 'object',
                    properties: {
                      head: {
                        type: 'object',
                        properties: {
                          descriptor: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                          },
                        },
                      },
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
                      },
                    },
                    required: [],
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
          },
          required: ['provider', 'items', 'quote'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}; 
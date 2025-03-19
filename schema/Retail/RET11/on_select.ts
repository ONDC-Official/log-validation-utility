export const FnBonSelectSchema = {
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
          const: 'on_select',
        },
        core_version: {
          type: 'string',
          enum: ['1.2.0', '1.2.5'],
          minLength: 1,
        },
        bap_id: {
          type: 'string',
        },
        bap_uri: {
          type: 'string',
          format: 'url',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        city: {
          type: 'string',
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
                  },
                  fulfillment_id: {
                    type: 'string',
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
                required: ['id', 'fulfillment_id'],
              },
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
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
                            type: "object",
                            properties: {
                              tags: {
                                type: "array",
                                minItems: 2,
                                items: {
                                  oneOf: [
                                    {
                                      type: "object",
                                      properties: {
                                        code: {
                                          type: "string",
                                          const: "quote"
                                        },
                                        list: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            properties: {
                                              code: {
                                                type: "string"
                                              },
                                              value: {
                                                type: "string"
                                              }
                                            },
                                            required: ["code", "value"]
                                          }
                                        }
                                      },
                                      required: ["code", "list"]
                                    },
                                    {
                                      type: "object",
                                      properties: {
                                        code: {
                                          type: "string",
                                          const: "offer"
                                        },
                                        list: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            properties: {
                                              code: {
                                                type: "string",
                                                enum: ["id", "type", "auto", "additive", "item_id", "item_value", "item_count"]
                                              },
                                              value: {
                                                type: "string"
                                              }
                                            },
                                            required: ["code", "value"]
                                          },
                                          minItems: 7,
                                          uniqueItems: true
                                        }
                                      },
                                      required: ["code", "list"]
                                    }
                                  ]
                                }
                              }
                            },
                            required: ["tags"]
                          }
                        },                      },
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
            required: ['order'],
          },
          error: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
              },
              code: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
            },
            required: ['type', 'code', 'message'],
          },
        },
        required: ['context', 'message'],
      }
    }
  }
}

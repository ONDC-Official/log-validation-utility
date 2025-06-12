export const onInitFIS12WCLSchema = {
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
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['code'],
              },
              city: {
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
            required: ['country', 'city'],
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
          version: {
            type: 'string',
            minLength: 1,
          },
          ttl: {
            type: 'string',
            pattern: '^PT[0-9]+[HMS]',
          },
        },
        required: [
          'domain',
          'action',
          'location',
          'bap_id',
          'bap_uri',
          'bpp_id',
          'bpp_uri',
          'transaction_id',
          'message_id',
          'timestamp',
          'version',
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
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            size_type: {
                              type: 'string',
                              enum: ['sm', 'lg'],
                            },
                            url: {
                              type: 'string',
                              format: 'uri',
                            },
                          },
                          required: ['size_type', 'url'],
                        },
                        minItems: 1,
                      },
                      long_desc: {
                        type: 'string',
                        minLength: 1,
                      },
                      name: {
                        type: 'string',
                        minLength: 1,
                      },
                      short_desc: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['images', 'long_desc', 'name', 'short_desc'],
                  },
                },
                required: ['id', 'descriptor'],
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
                        enum: ['INR'],
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
                              enum: ['INR'],
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
                  ttl: {
                    type: 'string',
                    pattern: '^P[0-9]+D$',
                  },
                },
                required: ['id', 'price', 'breakup'],
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
                    parent_item_id: {
                      type: 'string',
                      minLength: 1,
                    },
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          enum: ['LOAN'],
                        },
                        name: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['code', 'name'],
                    },
                    category_ids: {
                      type: 'array',
                      items: {
                        type: 'string',
                        minLength: 1,
                      },
                      minItems: 1,
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: {
                        type: 'string',
                        minLength: 1,
                      },
                      minItems: 1,
                    },
                    price: {
                      type: 'object',
                      properties: {
                        currency: {
                          type: 'string',
                          enum: ['INR'],
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
                                enum: [
                                  'WORKING_CAPITAL_LIMIT',
                                  'INTEREST_RATE',
                                  'PROCESSING_FEE',
                                  'INSURANCE_CHARGES',
                                  'OTHER_UPFRONT_CHARGES',
                                  'TERM',
                                  'REPAYMENT_FREQUENCY',
                                  'RATE_ANNUALISED_PENAL_CHARGES',
                                  'OTHER_CHARGES',
                                  'COOL_OFF_PERIOD',
                                  'KYC_MODE',
                                  'CO_APPLICANT',
                                ],
                              },
                              name: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['code', 'name'],
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
                  required: ['id', 'parent_item_id', 'descriptor', 'category_ids', 'fulfillment_ids', 'price', 'tags'],
                },
                minItems: 1,
              },
            },
            required: ['provider', 'quote', 'items'],
          },
        },
        required: ['order'],
      },
    },
    required: ['context', 'message'],
  };
  
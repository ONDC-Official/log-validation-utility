export const onUpdateFIS12WCLSchema = {
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
          ttl: {
            type: 'string',
            pattern: '^PT[0-9]+[HMS]',
          },
          version: {
            type: 'string',
            minLength: 1,
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
          'ttl',
          'version',
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
              ref_order_ids: {
                type: 'array',
                items: {
                  type: 'string',
                  minLength: 1,
                },
              },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
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
                      short_desc: {
                        type: 'string',
                        minLength: 1,
                      },
                      long_desc: {
                        type: 'string',
                        minLength: 1,
                      },
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            size_type: {
                              type: 'string',
                              enum: ['sm', 'md', 'lg'],
                            },
                            url: {
                              type: 'string',
                              format: 'uri',
                            },
                          },
                          required: ['size_type', 'url'],
                        },
                      },
                    },
                    required: ['name', 'short_desc', 'long_desc'],
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
                              enum: ['LSP_INFO', 'CONTACT_INFO'],
                            },
                            name: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['code', 'name'],
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
                                    enum: [
                                      'LSP_NAME',
                                      'LSP_EMAIL',
                                      'LSP_CONTACT_NUMBER',
                                      'LSP_ADDRESS',
                                      'GRO_NAME',
                                      'GRO_EMAIL',
                                      'GRO_CONTACT_NUMBER',
                                      'CUSTOMER_SUPPORT_LINK',
                                      'CUSTOMER_SUPPORT_CONTACT_NUMBER',
                                      'CUSTOMER_SUPPORT_EMAIL',
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
                      required: ['descriptor', 'list'],
                    },
                    minItems: 1,
                  },
                },
                required: ['id', 'descriptor', 'tags'],
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
                          enum: ['LOAN', 'INTEREST'],
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
                      },
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
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
                                enum: ['INFO', 'CHECKLISTS'],
                              },
                              name: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['code', 'name'],
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
                                      enum: [
                                        'INTEREST_RATE',
                                        'REPAYMENT_FREQUENCY',
                                        'DRADOWN_APPROVAL',
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
                        required: ['descriptor', 'list'],
                      },
                      minItems: 1,
                    },
                  },
                  required: ['id', 'parent_item_id', 'descriptor', 'price', 'tags'],
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
                        bank_account_number: {
                          type: 'string',
                          minLength: 1,
                        },
                        bank_code: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['transaction_id', 'amount', 'currency', 'bank_account_number', 'bank_code'],
                    },
                    time: {
                      type: 'object',
                      properties: {
                        timestamp: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
                      required: ['timestamp'],
                    },
                    collected_by: {
                      type: 'string',
                      enum: ['MERCHANT', 'BPP'],
                    },
                    type: {
                      type: 'string',
                      enum: ['ON-ORDER', 'POST-FULFILLMENT'],
                    },
                    status: {
                      type: 'string',
                      enum: ['PAID', 'NOT-PAID'],
                    },
                  },
                  required: ['id', 'params', 'time', 'collected_by', 'type', 'status'],
                },
                minItems: 1,
              },
            },
            required: ['id', 'ref_order_ids', 'status', 'provider', 'quote', 'items'],
          },
        },
        required: ['order'],
      },
    },
    required: ['context', 'message'],
  };
  
export const confirmSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'confirm',
        },
        core_version: {
          type: 'string',
          minLength: 1,
          const: '1.2.0',
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          minLength: 1,
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          minLength: 1,
          format: 'url',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        timestamp: {
          type: 'string',
          minLength: 1,
          format: 'date-time',
        },
        ttl: {
          type: 'string',
          minLength: 1,
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
        'ttl',
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
              pattern: '^[a-zA-Z0-9]{1,32}$'
            },
            state: {
              type: 'string',
              minLength: 1,
            },
            provider: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['id'],
                  },
                },
              },
              required: ['id', 'locations'],
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
                  fulfillment_id: {
                    type: 'string',
                    minLength: 1,
                  },
                  quantity: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'integer',
                      },
                    },
                    required: ['count'],
                  },
                  parent_item_id: {
                    type: 'string',
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
                required: ['id', 'fulfillment_id', 'quantity'],
              },
            },
            billing: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                },
                address: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 1,
                    },
                    building: {
                      type: 'string',
                      minLength: 1,
                    },
                    locality: {
                      type: 'string',
                      minLength: 1,
                    },
                    city: {
                      type: 'string',
                      minLength: 1,
                    },
                    state: {
                      type: 'string',
                      minLength: 1,
                    },
                    country: {
                      type: 'string',
                      minLength: 1,
                    },
                    area_code: {
                      type: 'string',
                      maxLength: 6,
                      minLength: 1,
                    },
                  },
                  required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                },
                phone: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 11,
                },
                email: {
                  type: 'string',
                  format: 'email',
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
              required: ['name', 'address', 'phone', 'created_at', 'updated_at'],
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
                    const: 'Delivery',
                  },
                  tracking: {
                    type: 'boolean',
                  },
                  end: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                          },
                        },
                        required: ['name'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            format: 'email',
                          },
                          phone: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 11,
                          },
                        },
                        required: ['phone'],
                      },
                      location: {
                        type: 'object',
                        properties: {
                          gps: {
                            type: 'string',
                            minLength: 1,
                            pattern: '^[0-9]{2}[.][0-9]{6,}[,][0-9]{2}[.][0-9]{6,}$',
                            errorMessage: ' The gps co-ordinates should be precise atleast upto 6 digits after decimal',
                          },
                          address: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                                minLength: 1,
                              },
                              building: {
                                type: 'string',
                                minLength: 1,
                              },
                              locality: {
                                type: 'string',
                                minLength: 1,
                              },
                              city: {
                                type: 'string',
                                minLength: 1,
                              },
                              state: {
                                type: 'string',
                                minLength: 1,
                              },
                              country: {
                                type: 'string',
                                minLength: 1,
                              },
                              area_code: {
                                type: 'string',
                                maxLength: 6,
                                minLength: 1,
                              },
                            },
                            required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                          },
                        },
                        required: ['gps', 'address'],
                      },
                    },
                    required: ['person', 'contact', 'location'],
                  },
                },
                required: ['id', 'type', 'tracking', 'end'],
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
                      pattern: '^(?!s*$).+',
                    },
                    value: {
                      type: 'string',
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
                        minLength: 1,
                      },
                      '@ondc/org/item_quantity': {
                        type: 'object',
                        properties: {
                          count: {
                            type: 'integer',
                          },
                        },
                        required: ['count'],
                      },
                      title: {
                        type: 'string',
                        minLength: 1,
                      },
                      '@ondc/org/title_type': {
                        type: 'string',
                        enum: ['item', 'delivery', 'packing', 'tax', 'misc', 'discount'],
                      },
                      price: {
                        type: 'object',
                        properties: {
                          currency: {
                            type: 'string',
                            pattern: '^(?!s*$).+',
                          },
                          value: {
                            type: 'string',
                            minLength: 1,
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
                          price: {
                            type: 'object',
                            properties: {
                              currency: {
                                type: 'string',
                                pattern: '^(?!s*$).+',
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
                      },
                    },
                    required: ['@ondc/org/item_id', 'title', '@ondc/org/title_type', 'price'],
                  },
                },
                ttl: {
                  type: 'string',
                  format: 'duration',
                },
              },
              required: ['price', 'breakup', 'ttl'],
            },
            payment: {
              type: 'object',
              properties: {
                uri: {
                  type: 'string',
                },
                tl_method: {
                  type: 'string',
                },
                params: {
                  type: 'object',
                  properties: {
                    currency: {
                      type: 'string',
                      pattern: '^(?!s*$).+',
                    },
                    transaction_id: {
                      type: 'string',
                    },
                    amount: {
                      type: 'string',
                    },
                  },
                  required: ['currency', 'transaction_id', 'amount'],
                },
                status: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                },
                collected_by: {
                  type: 'string',
                },
                '@ondc/org/buyer_app_finder_fee_type': {
                  type: 'string',
                },
                '@ondc/org/buyer_app_finder_fee_amount': {
                  type: 'string',
                },
                '@ondc/org/settlement_basis': {
                  type: 'string',
                },
                '@ondc/org/settlement_window': {
                  type: 'string',
                },
                '@ondc/org/withholding_amount': {
                  type: 'string',
                },
                '@ondc/org/settlement_details': {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      settlement_counterparty: {
                        type: 'string',
                      },
                      settlement_phase: {
                        type: 'string',
                        const: 'sale-amount',
                      },
                      settlement_type: {
                        type: 'string',
                        enum: ['upi', 'neft', 'rtgs'],
                      },
                      upi_address: { type: 'string' },
                      settlement_bank_account_no: {
                        type: 'string',
                      },
                      settlement_ifsc_code: {
                        type: 'string',
                      },
                      bank_name: { type: 'string' },
                      beneficiary_name: {
                        type: 'string',
                      },
                      branch_name: { type: 'string' },
                    },
                    allOf: [
                      {
                        if: {
                          properties: {
                            settlement_type: {
                              const: 'upi',
                            },
                          },
                        },
                        then: {
                          properties: {
                            upi_address: {
                              type: 'string',
                            },
                          },
                          required: ['upi_address'],
                        },
                      },
                      {
                        if: {
                          properties: {
                            settlement_type: {
                              enum: ['rtgs', 'neft'],
                            },
                          },
                        },
                        then: {
                          properties: {
                            settlement_bank_account_no: {
                              type: 'string',
                            },
                            settlement_ifsc_code: {
                              type: 'string',
                            },
                            bank_name: { type: 'string' },
                            branch_name: { type: 'string' },
                          },
                          required: ['settlement_ifsc_code', 'settlement_bank_account_no', 'bank_name', 'branch_name'],
                        },
                      },
                    ],
                    required: ['settlement_counterparty', 'settlement_phase', 'settlement_type'],
                  },
                },
              },
              required: [
                'params',
                'status',
                'type',
                'collected_by',
                '@ondc/org/buyer_app_finder_fee_type',
                '@ondc/org/buyer_app_finder_fee_amount',
              ],
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
            'state',
            'provider',
            'items',
            'billing',
            'fulfillments',
            'quote',
            'payment',
            'tags',
            'created_at',
            'updated_at',
          ],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}

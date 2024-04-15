export const FnBonConfirmSchema = {
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
          const: 'on_confirm',
        },
        core_version: {
          type: 'string',
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
            id: {
              type: 'string',
              pattern: '^[a-zA-Z0-9-]{1,32}$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
              errorMessage: 'Order ID should be alphanumeric upto 32 letters max or UUID',
            },
            state: {
              type: 'string',
              enum: ['Created', 'Accepted', 'Cancelled'],
            },
            provider: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
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
                  },
                  fulfillment_id: {
                    type: 'string',
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
                                minLength: 1,
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
                      minLength: 1,
                    },
                  },
                  required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                phone: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 11,
                },
                created_at: {
                  type: 'string',
                  format: 'rfc3339-date-time',
                },
                updated_at: {
                  type: 'string',
                  format: 'rfc3339-date-time',
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
                  '@ondc/org/provider_name': {
                    type: 'string',
                    minLength: 1,
                  },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            const: 'Pending',
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                  type: {
                    type: 'string',
                    const: 'Delivery',
                  },
                  tracking: {
                    type: 'boolean',
                  },
                  start: {
                    type: 'object',
                    properties: {
                      location: {
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
                              },
                            },
                            required: ['name'],
                          },
                          gps: {
                            type: 'string',
                          },
                          address: {
                            type: 'object',
                            properties: {
                              locality: {
                                type: 'string',
                                minLength: 1,
                              },
                              city: {
                                type: 'string',
                                minLength: 1,
                              },
                              area_code: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 6,
                              },
                              state: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['locality', 'city', 'area_code', 'state'],
                          },
                        },
                        required: ['id', 'descriptor', 'gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: {
                          range: {
                            type: 'object',
                            properties: {
                              start: {
                                type: 'string',
                                minLength: 1,
                              },
                              end: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['start', 'end'],
                          },
                        },
                        required: ['range'],
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: {
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
                          long_desc: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['code', 'name', 'short_desc', 'long_desc'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 11,
                          },
                          email: {
                            type: 'string',
                            format: 'email',
                          },
                        },
                        required: ['phone'],
                      },
                    },
                    required: ['location', 'contact'],
                  },
                  end: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
                          gps: {
                            type: 'string',
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
                                minLength: 1,
                                maxLength: 6,
                              },
                            },
                            required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                          },
                        },
                        required: ['gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: {
                          range: {
                            type: 'object',
                            properties: {
                              start: {
                                type: 'string',
                                minLength: 1,
                              },
                              end: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['start', 'end'],
                          },
                        },
                        required: ['range'],
                      },
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
                            minLength: 10,
                            maxLength: 11,
                          },
                          email: {
                            type: 'string',
                            format: 'email',
                          },
                        },
                        required: ['phone'],
                      },
                    },
                    required: ['location', 'person', 'contact'],
                  },
                },
                required: ['id', '@ondc/org/provider_name', 'state', 'type', 'tracking', 'start', 'end'],
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
                      minLength: 1,
                      pattern : '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Price value should be a number in string with upto 2 decimal places'
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
                            pattern : '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Price value should be a number in string with upto 2 decimal places'
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
                                pattern : '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Price value should be a number in string with upto 2 decimal places'
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
                                        minLength: 1,
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
                  enum: ['PAID', 'NOT-PAID'],
                },
                type: {
                  type: 'string',
                  enum: ['ON-ORDER', 'ON-FULFILLMENT'],
                },
                collected_by: {
                  type: 'string',
                  enum: ['BAP', 'BPP'],
                },
                '@ondc/org/buyer_app_finder_fee_type': {
                  type: 'string',
                },
                '@ondc/org/buyer_app_finder_fee_amount': {
                  type: 'string',
                },
                '@ondc/org/settlement_basis': {
                  type: 'string',
                  enum: ['shipment', 'delivery', 'return_window_expiry'],
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
                    enum: ['bpp_terms', 'bap_terms'],
                  },
                  list: {
                    type: 'array',
                    items: {
                      allOf: [
                        {
                          if: {
                            properties: {
                              code: { const: 'np_type' },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                enum: ['np_type'],
                              },
                              value: {
                                type: 'string',
                                enum: ['MSN', 'ISN'],
                              },
                            },
                            required: ['code', 'value'],
                            additionalProperties: false,
                          },
                        },
                        {
                          if: {
                            properties: {
                              code: { const: 'tax_number' },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              value: {
                                type: 'string',
                                pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
                                errorMessage: 'Value for tax_number must be alphanumeric characters only',
                              },
                            },
                            required: ['code', 'value'],
                            additionalProperties: false,
                          },
                        },
                        {
                          if: {
                            properties: {
                              code: { const: 'provider_tax_number' },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              value: {
                                type: 'string',
                                pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
                                errorMessage: 'Value for provider_tax_number must be alphanumeric characters only',
                              },
                            },
                            required: ['code', 'value'],
                            additionalProperties: false,
                          },
                        },
                      ],
                    },
                    minItems: 1,
                  },
                },
                required: ['code', 'list'],
                additionalProperties: false,
              },
            },
            created_at: {
              type: 'string',
              format: 'rfc3339-date-time',
            },
            updated_at: {
              type: 'string',
              format: 'rfc3339-date-time',
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

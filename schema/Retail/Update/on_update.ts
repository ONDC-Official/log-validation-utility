export const onUpdateSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: { type: 'string', minLength: 1 },
        action: { type: 'string', const: 'on_update' },
        core_version: { type: 'string', const: '1.2.0' },
        bap_id: { type: 'string', minLength: 1 },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string', minLength: 1 },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string', minLength: 1 },
        message_id: { type: 'string', minLength: 1 },
        city: { type: 'string', minLength: 1 },
        country: { type: 'string', const: 'IND' },
        timestamp: { type: 'string', format: 'date-time' },
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
            id: { type: 'string', minLength: 1 },
            state: { type: 'string', const: 'Accepted' },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string', minLength: 1 },
                locations: {
                  type: 'array',
                  items: { type: 'object', properties: { id: { type: 'string', minLength: 1 } }, required: ['id'] },
                },
              },
              required: ['id', 'locations'],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', minLength: 1 },
                  fulfillment_id: { type: 'string', minLength: 1 },
                  quantity: {
                    type: 'object',
                    properties: { count: { type: 'integer' } },
                    required: ['count'],
                  },
                  parent_item_id: { type: 'string', minLength: 1 },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', minLength: 1 },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: { type: 'string', minLength: 1 },
                              value: { type: 'string', minLength: 1 },
                            },
                            required: ['code', 'value'],
                          },
                        },
                      },
                      required: ['code', 'list'],
                    },
                  },
                },
                required: ['id', 'fulfillment_id', 'quantity', 'parent_item_id', 'tags'],
              },
            },
            billing: {
              type: 'object',
              properties: {
                name: { type: 'string', minLength: 1 },
                address: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    building: { type: 'string' },
                    locality: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    country: { type: 'string', const: 'IND' },
                    area_code: { type: 'string' },
                  },
                  required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
              },
              required: ['name', 'address', 'email', 'phone', 'created_at', 'updated_at'],
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', minLength: 1 },
                  type: { type: 'string', const: 'Cancel' },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: { type: 'object', properties: { code: { type: 'string', const: 'Cancelled' } } },
                    },
                    required: ['descriptor'],
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', minLength: 1 },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: { type: 'string', minLength: 1 },
                              value: { type: 'string', minLength: 1 },
                            },
                            required: ['code', 'value'],
                          },
                        },
                      },
                      required: ['code', 'list'],
                    },
                  },
                },
                required: ['id', 'type', 'state', 'tags'],
              },
            },
            quote: {
              type: 'object',
              properties: {
                price: {
                  type: 'object',
                  properties: { currency: { type: 'string', const: 'INR' }, value: { type: 'string', minLength: 1 } },
                  required: ['currency', 'value'],
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      '@ondc/org/item_id': { type: 'string', minLength: 1 },
                      '@ondc/org/item_quantity': {
                        type: 'object',
                        properties: { count: { type: 'integer' } },
                        required: ['count'],
                      },
                      title: { type: 'string' },
                      '@ondc/org/title_type': { type: 'string' },
                      price: {
                        type: 'object',
                        properties: {
                          currency: { type: 'string', const: 'INR' },
                          value: { type: 'string', minLength: 1 },
                        },
                        required: ['currency', 'value'],
                      },
                      item: {
                        type: 'object',
                        properties: {
                          parent_item_id: { type: 'string' },
                          price: {
                            type: 'object',
                            properties: {
                              currency: { type: 'string', const: 'INR' },
                              value: { type: 'string', minLength: 1 },
                            },
                            required: ['currency', 'value'],
                          },
                          tags: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                code: { type: 'string', minLength: 1 },
                                list: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      code: { type: 'string', minLength: 1 },
                                      value: { type: 'string', minLength: 1 },
                                    },
                                    required: ['code', 'value'],
                                  },
                                },
                              },
                              required: ['code', 'list'],
                            },
                          },
                        },
                        required: ['parent_item_id', 'price', 'tags'],
                      },
                    },
                    required: [
                      '@ondc/org/item_id',
                      '@ondc/org/item_quantity',
                      'title',
                      '@ondc/org/title_type',
                      'price',
                      'item',
                    ],
                  },
                },
                ttl: { type: 'string', format: 'duration' },
              },
              required: ['price', 'breakup', 'ttl'],
            },
            payment: {
              type: 'object',
              properties: {
                uri: { type: 'string', format: 'uri' },
                params: {
                  type: 'object',
                  properties: {
                    currency: { type: 'string', const: 'INR' },
                    transaction_id: { type: 'string', minLength: 1 },
                    amount: { type: 'string', minLength: 1 },
                  },
                  required: ['currency', 'transaction_id', 'amount'],
                },
                status: { type: 'string', const: 'PAID' },
                type: { type: 'string', const: 'ON-ORDER' },
                collected_by: { type: 'string' },
                '@ondc/org/buyer_app_finder_fee_type': { type: 'string' },
                '@ondc/org/buyer_app_finder_fee_amount': { type: 'string' },
                '@ondc/org/settlement_basis': { type: 'string' },
                '@ondc/org/settlement_window': { type: 'string' },
                '@ondc/org/withholding_amount': { type: 'string' },
                '@ondc/org/settlement_details': {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      settlement_counterparty: { type: 'string' },
                      settlement_phase: { type: 'string' },
                      beneficiary_name: { type: 'string' },
                      settlement_type: { type: 'string' },
                      upi_address: { type: 'string' },
                      settlement_bank_account_no: { type: 'string' },
                      settlement_ifsc_code: { type: 'string' },
                      bank_name: { type: 'string' },
                      branch_name: { type: 'string' },
                    },
                    required: ['settlement_counterparty', 'settlement_phase', 'beneficiary_name', 'settlement_type'],
                  },
                },
              },
              required: [
                'uri',
                'params',
                'status',
                'type',
                'collected_by',
                '@ondc/org/buyer_app_finder_fee_type',
                '@ondc/org/buyer_app_finder_fee_amount',
                '@ondc/org/settlement_basis',
                '@ondc/org/settlement_window',
                '@ondc/org/withholding_amount',
                '@ondc/org/settlement_details',
              ],
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
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

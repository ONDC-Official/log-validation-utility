export const onUpdateRQCSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'on_update',
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
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
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
        timestamp: {
          type: 'string',
          format: 'date-time',
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
            id: { type: 'string' },
            state: { type: 'string' },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                locations: {
                  type: 'array',
                  items: { type: 'object', properties: { id: { type: 'string' } } },
                },
              },
              required: ['id', 'locations'],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  fulfillment_id: { type: 'string' },
                  quantity: {
                    type: 'object',
                    properties: { count: { type: 'integer' } },
                  },
                },
                required: ['id', 'fulfillment_id', 'quantity'],
              },
            },
            billing: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                address: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    building: { type: 'string' },
                    locality: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    country: { type: 'string' },
                    area_code: { type: 'string' },
                  },
                  required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                },
                email: { type: 'string' },
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
                  id: { type: 'string' },
                  '@ondc/org/provider_name': { type: 'string' },
                  type: { type: 'string' },
                  tracking: { type: 'boolean' },
                  '@ondc/org/TAT': { type: 'string' },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: { type: 'object', properties: { code: { type: 'string' } } },
                    },
                    required: ['descriptor'],
                  },
                  start: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          descriptor: { type: 'object', properties: { name: { type: 'string' } } },
                          gps: { type: 'string' },
                          address: {
                            type: 'object',
                            properties: {
                              locality: { type: 'string' },
                              city: { type: 'string' },
                              area_code: { type: 'string' },
                              state: { type: 'string' },
                            },
                            required: ['locality', 'city', 'area_code', 'state'],
                          },
                        },
                        required: ['id', 'descriptor', 'gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: { timestamp: { type: 'string', format: 'date-time' } },
                      },
                      range: {
                        type: 'object',
                        properties: {
                          start: { type: 'string', format: 'date-time' },
                          end: { type: 'string', format: 'date-time' },
                        },
                        required: ['start', 'end'],
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          name: { type: 'string' },
                          short_desc: { type: 'string' },
                          long_desc: { type: 'string' },
                          images: { type: 'array', items: { type: 'string' } },
                        },
                        required: ['code', 'name', 'short_desc', 'long_desc', 'images'],
                      },
                      authorization: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          token: { type: 'string' },
                          valid_from: { type: 'string', format: 'date-time' },
                          valid_to: { type: 'string', format: 'date-time' },
                        },
                        required: ['type', 'token', 'valid_from', 'valid_to'],
                      },
                      contact: {
                        type: 'object',
                        properties: { phone: { type: 'string' }, email: { type: 'string' } },
                      },
                    },
                    required: ['location', 'time', 'instructions', 'authorization', 'contact'],
                  },
                  end: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
                          gps: { type: 'string' },
                          address: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              building: { type: 'string' },
                              locality: { type: 'string' },
                              city: { type: 'string' },
                              state: { type: 'string' },
                              country: { type: 'string' },
                              area_code: { type: 'string' },
                            },
                            required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                          },
                        },
                        required: ['gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: { timestamp: { type: 'string', format: 'date-time' } },
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          name: { type: 'string' },
                          short_desc: { type: 'string' },
                          images: { type: 'array', items: { type: 'string' } },
                        },
                        required: ['code', 'name', 'short_desc', 'images'],
                      },
                      authorization: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          token: { type: 'string' },
                          valid_from: { type: 'string', format: 'date-time' },
                          valid_to: { type: 'string', format: 'date-time' },
                        },
                        required: ['type', 'token', 'valid_from', 'valid_to'],
                      },
                      person: { type: 'object', properties: { name: { type: 'string' } } },
                      contact: {
                        type: 'object',
                        properties: { phone: { type: 'string' }, email: { type: 'string' } },
                      },
                    },
                    required: ['location', 'time', 'instructions', 'authorization', 'contact'],
                  },
                  agent: {
                    type: 'object',
                    properties: { name: { type: 'string' }, phone: { type: 'string' } },
                    required: ['name', 'phone'],
                  },
                  vehicle: { type: 'object', properties: { registration: { type: 'string' } } },
                },
                required: [
                  'id',
                  '@ondc/org/provider_name',
                  'type',
                  'tracking',
                  '@ondc/org/TAT',
                  'state',
                  'start',
                  'end',
                  'agent',
                  'vehicle',
                ],
              },
            },
            quote: {
              type: 'object',
              properties: {
                price: { type: 'object', properties: { currency: { type: 'string' }, value: { type: 'string' } } },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      '@ondc/org/item_id': { type: 'string' },
                      '@ondc/org/item_quantity': { type: 'object', properties: { count: { type: 'integer' } } },
                      title: { type: 'string' },
                      '@ondc/org/title_type': { type: 'string' },
                      price: {
                        type: 'object',
                        properties: { currency: { type: 'string' }, value: { type: 'string' } },
                      },
                      item: {
                        type: 'object',
                        properties: {
                          price: {
                            type: 'object',
                            properties: { currency: { type: 'string' }, value: { type: 'string' } },
                          },
                        },
                      },
                      tags: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' },
                            list: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: { code: { type: 'string' }, value: { type: 'string' } },
                              },
                            },
                          },
                        },
                      },
                    },
                    required: [
                      '@ondc/org/item_id',
                      '@ondc/org/item_quantity',
                      'title',
                      '@ondc/org/title_type',
                      'price',
                    ],
                  },
                },
                ttl: { type: 'string' },
              },
              required: ['price', 'breakup', 'ttl'],
            },
            payment: {
              type: 'object',
              properties: {
                uri: { type: 'string' },
                tl_method: { type: 'string' },
                params: {
                  type: 'object',
                  properties: {
                    currency: { type: 'string' },
                    transaction_id: { type: 'string' },
                    amount: { type: 'string' },
                  },
                },
                status: { type: 'string' },
                type: { type: 'string' },
                collected_by: { type: 'string' },
                '@ondc/org/buyer_app_finder_fee_type': { type: 'string' },
                '@ondc/org/buyer_app_finder_fee_amount': { type: 'string' },
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
                    required: [
                      'settlement_counterparty',
                      'settlement_phase',
                      'beneficiary_name',
                      'settlement_type',
                      'upi_address',
                      'settlement_bank_account_no',
                      'settlement_ifsc_code',
                      'bank_name',
                      'branch_name',
                    ],
                  },
                },
              },
              required: ['uri', 'tl_method', 'params', 'status', 'type', 'collected_by'],
            },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  label: { type: 'string' },
                },
                required: ['url', 'label'],
              },
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
}

export const onUpdateSchema = {
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
          format: 'rfc3339-date-time',
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
            id: { type: 'string',
            pattern: '^[a-zA-Z0-9-]{1,32}$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
            errorMessage: 'Order ID should be alphanumeric upto 32 letters max or UUID',
           },
            state: { type: 'string', enum: ['Created', 'Accepted', 'Cancelled', 'Completed', 'Delivered'] },
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
                created_at: { type: 'string', format: 'rfc3339-date-time' },
                updated_at: { type: 'string', format: 'rfc3339-date-time' },
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
                  type: { type: 'string', enum: ['Cancel', 'Delivery', 'Return'] },
                  tracking: { type: 'boolean' },
                  '@ondc/org/TAT': { type: 'string' },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            enum: [
                              'Cancelled',
                              'Pending',
                              'Order-delivered',
                              'Return_Initiated',
                              'Return_Pick_Failed',
                              'Return_Approved',
                              'Return_Picked',
                              'Return_Delivered',
                              'Liquidated',
                              'Return_Rejected',
                            ],
                          },
                          short_desc: {
                            type: 'string',
                            enum: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'],
                          },
                        },
                      },
                    },
                  },
                  start: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          descriptor: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                            },
                            required: ['name'],
                          },
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
                        required: ['id', 'gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: {
                          timestamp: { type: 'string', format: 'rfc3339-date-time' },
                          range: {
                            type: 'object',
                            properties: {
                              start: { type: 'string', format: 'rfc3339-date-time' },
                              end: { type: 'string', format: 'rfc3339-date-time' },
                            },
                          },
                        },
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
                      },
                      authorization: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          token: { type: 'string' },
                          valid_from: { type: 'string', format: 'rfc3339-date-time' },
                          valid_to: { type: 'string', format: 'rfc3339-date-time' },
                        },
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' ,                 
                          minLength: 10,
                          maxLength: 11,},
                          email: { type: 'string', format: 'email' },
                        },
                        required: ['phone', 'email'],
                      },
                    },
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
                          },
                        },
                      },
                      time: {
                        type: 'object',
                        properties: {
                          timestamp: { type: 'string', format: 'rfc3339-date-time' },
                        },
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                          name: { type: 'string' },
                          images: { type: 'array', items: { type: 'string' } },
                        },
                      },
                      authorization: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          token: { type: 'string' },
                          valid_from: { type: 'string', format: 'rfc3339-date-time' },
                          valid_to: { type: 'string', format: 'rfc3339-date-time' },
                        },
                      },
                      person: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                        },
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' ,                  
                          minLength: 10,
                          maxLength: 11,},
                          email: { type: 'string', format: 'email' },
                        },
                      },
                    },
                  },
                  agent: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      phone: { type: 'string' },
                    },
                  },
                  vehicle: {
                    type: 'object',
                    properties: {
                      registration: { type: 'string' },
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
                            properties: {
                              code: { type: 'string' },
                              value: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
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
                      'title',
                      '@ondc/org/title_type',
                      'price',
                    ],
                  },
                },
                ttl: { type: 'string',format: 'duration' },
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
                  enum:["PAID","NOT-PAID"]
                },
                type: {
                  type: 'string',
                  enum:["ON-ORDER","ON-FULFILLMENT"]
                },
                collected_by: {
                  type: 'string',
                  enum:["BAP","BPP"]
                },
                '@ondc/org/buyer_app_finder_fee_type': {
                  type: 'string',
                },
                '@ondc/org/buyer_app_finder_fee_amount': {
                  type: 'string',
                },
                '@ondc/org/settlement_basis': {
                  type: 'string',
                  enum:['shipment','delivery','return_window_expiry']
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
            created_at: { type: 'string', format: 'rfc3339-date-time' },
            updated_at: { type: 'string', format: 'rfc3339-date-time' },
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
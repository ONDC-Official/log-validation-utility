export const onStatusSchema = {
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
          const: 'on_status',
        },
        core_version: {
          type: 'string',
          const: '1.2.0',
          minLength: 1,
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          minLength: 1,
          type: 'string',
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
        timestamp: {
          type: 'string',
          format: 'date-time',
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
            },
            state: {
              type: 'string',
              enum: ['Created', 'Accepted', 'In-progress', 'Completed', 'Cancelled'],
            },
            cancellation: {
              type: 'object',
              properties: {
                cancelled_by: {
                  type: 'string',
                  minLength: 1,
                },
                reason: {
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
              required: ['cancelled_by', 'reason'],
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
                    minLength: 1,
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          minLength: 1,
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                minLength: 1,
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
                  '@ondc/org/provider_name': {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    minLength: 1,
                  },
                  tracking: {
                    type: 'boolean',
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
                            minLength: 1,
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                  start: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
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
                              },
                              city: {
                                type: 'string',
                              },
                              area_code: {
                                type: 'string',
                              },
                              state: {
                                type: 'string',
                              },
                            },
                            required: ['locality', 'city', 'area_code', 'state'],
                          },
                        },
                        required: ['descriptor', 'gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: {
                          range: {
                            type: 'object',
                            properties: {
                              start: {
                                type: 'string',
                                format: 'date-time',
                              },
                              end: {
                                type: 'string',
                                format: 'date-time',
                              },
                            },
                            required: ['start', 'end'],
                          },
                          timestamp: {
                            type: 'string',
                          },
                        },
                        required: ['range'],
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          short_desc: {
                            type: 'string',
                          },
                          long_desc: {
                            type: 'string',
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
                    required: ['location', 'time', 'contact'],
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
                                format: 'date-time',
                              },
                              end: {
                                type: 'string',
                                format: 'date-time',
                              },
                            },
                            required: ['start', 'end'],
                          },
                          timestamp: {
                            type: 'string',
                          },
                        },
                        required: ['range'],
                      },
                      instructions: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          short_desc: {
                            type: 'string',
                          },
                          long_desc: {
                            type: 'string',
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
                        },
                        required: ['phone'],
                      },
                    },
                    required: ['location', 'time', 'contact'],
                  },
                  agent: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      phone: {
                        type: 'string',
                        minLength: 10,
                        maxLength: 11,
                      },
                    },
                    required: ['name', 'phone'],
                  },
                  vehicle: {
                    type: 'object',
                    properties: {
                      category: {
                        type: 'string',
                      },
                      size: {
                        type: 'string',
                      },
                      registration: {
                        type: 'string',
                      },
                    },
                    required: ['category', 'size', 'registration'],
                  },
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
                ],
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
                      },
                      '@ondc/org/title_type': {
                        type: 'string',
                      },
                      price: {
                        type: 'object',
                        properties: {
                          currency: {
                            type: 'string',
                          },
                          value: {
                            type: 'string',
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
                              },
                              value: {
                                type: 'string',
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
                      },
                      beneficiary_name: {
                        type: 'string',
                      },
                      settlement_reference: {
                        type: 'string',
                      },
                      settlement_status: {
                        type: 'string',
                      },
                      settlement_timestamp: {
                        type: 'string',
                      },
                      settlement_type: {
                        type: 'string',
                      },
                      upi_address: {
                        type: 'string',
                      },
                      settlement_bank_account_no: {
                        type: 'string',
                      },
                      settlement_ifsc_code: {
                        type: 'string',
                      },
                      bank_name: {
                        type: 'string',
                      },
                      branch_name: {
                        type: 'string',
                      },
                    },
                    required: [
                      'settlement_counterparty',
                      'settlement_phase',
                      'settlement_timestamp',
                      'settlement_type',
                    ],
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
                '@ondc/org/settlement_basis',
                '@ondc/org/settlement_window',
                '@ondc/org/withholding_amount',
                '@ondc/org/settlement_details',
              ],
            },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                },
                required: ['url', 'label'],
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

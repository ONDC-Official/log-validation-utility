export const FnBonConfirmSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
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
        },
        bap_uri: {
          type: 'string',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
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
            },
            state: {
              type: 'string',
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
                required: ['id', 'fulfillment_id', 'quantity', 'parent_item_id', 'tags'],
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
                    },
                    building: {
                      type: 'string',
                    },
                    locality: {
                      type: 'string',
                    },
                    city: {
                      type: 'string',
                    },
                    state: {
                      type: 'string',
                    },
                    country: {
                      type: 'string',
                    },
                    area_code: {
                      type: 'string',
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
              required: ['name', 'address', 'email', 'phone', 'created_at', 'updated_at'],
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
                              },
                              end: {
                                type: 'string',
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
                        required: ['phone', 'email'],
                      },
                    },
                    required: ['location', 'time', 'instructions', 'contact'],
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
                              },
                              building: {
                                type: 'string',
                              },
                              locality: {
                                type: 'string',
                              },
                              city: {
                                type: 'string',
                              },
                              state: {
                                type: 'string',
                              },
                              country: {
                                type: 'string',
                              },
                              area_code: {
                                type: 'string',
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
                              },
                              end: {
                                type: 'string',
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
                        required: ['phone', 'email'],
                      },
                    },
                    required: ['location', 'time', 'person', 'contact'],
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
                        required: ['parent_item_id', 'tags'],
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
                      },
                      beneficiary_name: {
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
              required: [
                'uri',
                'tl_method',
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

export const FnBconfirmSchema = {
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
        },
        core_version: {
          type: 'string',
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
        },
        ttl: {
          type: 'string',
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
              required: ['name', 'address', 'phone', 'email', 'created_at', 'updated_at'],
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
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
                        required: ['email', 'phone'],
                      },
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
                      beneficiary_name: {
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
                      'settlement_type',
                      'upi_address',
                      'settlement_bank_account_no',
                      'settlement_ifsc_code',
                      'beneficiary_name',
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

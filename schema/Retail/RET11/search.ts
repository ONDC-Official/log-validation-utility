export const FnBsearchSchema = {
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
          const: 'search',
        },
        country: {
          type: 'string',
        },
        city: {
          type: 'string',
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
          format: 'url',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
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
        'country',
        'city',
        'core_version',
        'bap_id',
        'bap_uri',
        'transaction_id',
        'message_id',
        'timestamp',
        'ttl',
      ],
    },
    message: {
      type: 'object',
      properties: {
        intent: {
          type: 'object',
          properties: {
            fulfillment: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['Delivery', 'Self-Pickup', 'Buyer-Delivery'],
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
                            area_code: {
                              type: 'string',
                            },
                          },
                          required: ['area_code'],
                        },
                      },
                      required: ['gps', 'address'],
                    },
                  },
                  required: ['location'],
                },
              },
            },
            item: {
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
              },
              required: ['descriptor'],
            },
            category: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
              },
              required: ['id'],
            },
            payment: {
              type: 'object',
              properties: {
                '@ondc/org/buyer_app_finder_fee_type': {
                  type: 'string',
                  const: 'percent',
                },
                '@ondc/org/buyer_app_finder_fee_amount': {
                  type: 'string',
                  pattern: '^(\\d*.?\\d{1,2})$',
                },
              },
              required: ['@ondc/org/buyer_app_finder_fee_type', '@ondc/org/buyer_app_finder_fee_amount'],
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    enum: ['catalog_inc', 'bap_terms', 'bap_features'],
                  },
                  list: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          enum: [
                            '000',
                            '001',
                            '002',
                            '003',
                            '004',
                            '005',
                            '006',
                            '007',
                            '008',
                            '0091',
                            '0092',
                            '0093',
                            '0094',
                            '0095',
                            '0096',
                            '0097',
                            '0098',
                            '0099',
                            '009A',
                            '009B',
                            '009C',
                            '009D',
                            '009E',
                            '00A',
                            '00B',
                            '00C',
                            '00D',
                            '00E',
                            '00F',
                            '010',
                            '011',
                            '012',
                            '013',
                            '014',
                            '015',
                            '016',
                            '017',
                            '018',
                            '019',
                            '01A',
                            '01B',
                            '01C',
                            '01D',
                          ],
                        },
                        value: {
                          type: 'string',
                          enum: ['yes', 'no'],
                        },
                      },
                      required: ['code', 'value'],
                    },
                    minItems: 1,
                    contains: {
                      type: 'object',
                      properties: {
                        code: {
                          const: '000',
                        },
                      },
                      required: ['code'],
                    },
                  },
                },
                required: ['code', 'list'],
                allOf: [
                  {
                    if: {
                      properties: {
                        code: {
                          const: 'catalog_inc',
                        },
                      },
                    },
                    then: {
                      properties: {
                        list: {
                          items: {
                            properties: {
                              code: {
                                enum: [
                                  'start_time',
                                  'end_time',
                                  'mode',
                                  'static_terms',
                                  'effective_date',
                                  'static_terms_new',
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    if: {
                      properties: {
                        code: {
                          const: 'bap_terms',
                        },
                      },
                    },
                    then: {
                      properties: {
                        list: {
                          items: {
                            properties: {
                              code: {
                                enum: [
                                  'start_time',
                                  'end_time',
                                  'mode',
                                  'static_terms',
                                  'effective_date',
                                  'static_terms_new',
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
              minItems: 1,
              contains: {
                type: 'object',
                properties: {
                  code: {
                    const: 'bap_features',
                  },
                },
                required: ['code', 'list'],
              },
            },
          },
          required: ['payment'],
        },
      },
      required: ['intent'],
    },
  },
  required: ['context', 'message'],
}

export const searchSchema = {
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
          const: 'search',
        },
        country: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        core_version: {
          type: 'string',
          const: '1.2.5',
          minLength: 1,
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
      additionalProperties: false,
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
                    enum: ['catalog_inc', 'bap_terms', 'catalog_full', 'bap_features'],
                  },
                  list: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          enum: [
                            'start_time',
                            'end_time',
                            'mode',
                            'static_terms',
                            'effective_date',
                            'static_terms_new',
                            'payload_type',
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
                            '01E',
                            '01F',
                            '020',
                            '021',
                            '022',
                            '023',
                            '024',
                            '025',
                          ],
                        },
                        value: {
                          type: 'string',
                        },
                      },
                          additionalProperties: false,
                      required: ['code', 'value'],
                    },
                    minItems: 1,
                  },
                },
                required: ['code', 'list'],
                anyOf: [
                  {
                    properties: {
                      code: { const: 'bap_features' },
                    },
                    then: {
                      properties: {
                        list: {
                          contains: {
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
                        },
                      },
                    },
                  },
                  // Did changes for catalog_full
                  {
                    properties: {
                      code: { const: 'catalog_full' },
                    },
                    then: {
                      properties: {
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                const: 'payload_type',
                              },
                              value: {
                                type: 'string',
                                enum: ['link', 'inline'],
                              },
                            },
                            required: ['code', 'value'],
                          },
                        },
                      },
                    },
                  },
                  {
                    properties: {
                      code: { const: 'catalog_inc' },
                    },
                    then: {
                      properties: {
                        list: {
                          anyOf: [
                            {
                              contains: {
                                type: 'object',
                                properties: {
                                  code: { const: 'mode' },
                                },
                                required: ['code'],
                              },
                            },
                            {
                              contains: {
                                allOf: [
                                  {
                                    type: 'object',
                                    properties: {
                                      code: { const: 'start_time' },
                                    },
                                    required: ['code'],
                                  },
                                  {
                                    type: 'object',
                                    properties: {
                                      code: { const: 'end_time' },
                                    },
                                    required: ['code'],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    properties: {
                      code: { const: 'bap_terms' },
                    },
                    then: {
                      properties: {
                        list: {
                          contains: {
                            allOf: [
                              {
                                type: 'object',
                                properties: {
                                  code: { const: 'static_terms' },
                                },
                                required: ['code'],
                              },
                              {
                                type: 'object',
                                properties: {
                                  code: { const: 'static_terms_new' },
                                },
                                required: ['code'],
                              },
                              {
                                type: 'object',
                                properties: {
                                  code: { const: 'effective_date' },
                                },
                                required: ['code'],
                              },
                            ],
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
                  code: { enum: ['bap_features', 'catalog_full', 'catalog_inc', 'bap_terms'] },
                },
                required: ['code', 'list'],
              },
            },
          },
          required: ['payment'],
        },
      },
      required: ['intent'],
      additionalProperties: false,
    },
  },
  required: ['context', 'message'],
  additionalProperties: false,
}

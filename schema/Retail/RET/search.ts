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
                          pattern: '^[0-9]{2}[.][0-9]{6,}[,][0-9]{2}[.][0-9]{6,}$',
                          errorMessage: 'The gps co-ordinates should be precise atleast upto 6 digits after decimal',
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
                    enum: ['catalog_inc', 'bap_terms'],
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
                          ],
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
          required: ['payment'],
        },
      },
      required: ['intent'],
    },
  },
  required: ['context', 'message'],
}

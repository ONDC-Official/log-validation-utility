export const cancel_RTO_Schema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: { type: 'string' },
        country: { type: 'string' },
        city: { type: 'string' },
        action: { type: 'string' },
        core_version: { type: 'string' },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string' },
      },
      required: [
        'domain',
        'country',
        'city',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
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
            id: { type: 'string' },
            state: { type: 'string' },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
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
                  id: { type: 'string' },
                  fulfillment_id: { type: 'string' },
                  quantity: {
                    type: 'object',
                    properties: {
                      count: { type: 'integer' },
                    },
                    required: ['count'],
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
                  id: { type: 'string' },
                  type: { type: 'string' },
                  tracking: { type: 'boolean' },
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: { type: 'string' },
                        },
                        required: ['code'],
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
                        required: ['id', 'descriptor', 'gps', 'address'],
                      },
                      time: {
                        type: 'object',
                        properties: {
                          range: {
                            type: 'object',
                            properties: {
                              start: { type: 'string', format: 'date-time' },
                              end: { type: 'string', format: 'date-time' },
                            },
                            required: ['start', 'end'],
                          },
                        },
                        required: ['location', 'time'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' },
                          email: { type: 'string', format: 'email' },
                        },
                        required: ['phone', 'email'],
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
                        properties: {
                          range: {
                            type: 'object',
                            properties: {
                              start: { type: 'string', format: 'date-time' },
                              end: { type: 'string', format: 'date-time' },
                            },
                            required: ['start', 'end'],
                          },
                        },
                        required: ['location', 'time'],
                      },
                      person: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                        },
                        required: ['name'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' },
                          email: { type: 'string', format: 'email' },
                        },
                        required: ['phone', 'email'],
                      },
                    },
                    required: ['id', 'type', 'tracking', 'state', 'start', 'contact'],
                  },
                },
              },
            },
            quote: {
              type: 'object',
              properties: {
                price: {
                  type: 'object',
                  properties: {
                    currency: { type: 'string' },
                    value: { type: 'string' },
                  },
                  required: ['currency', 'value'],
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      '@ondc/org/item_id': { type: 'string' },
                      '@ondc/org/item_quantity': {
                        type: 'object',
                        properties: {
                          count: { type: 'integer' },
                        },
                        required: ['count'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

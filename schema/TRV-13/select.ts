const selectSchemaTRV13 = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain',
        'location',
        'transaction_id',
        'message_id',
        'action',
        'timestamp',
        'version',
        'bap_uri',
        'bap_id',
        'bpp_uri',
        'bpp_id',
        'ttl'
      ],
      properties: {
        domain: { type: 'string', enum: ['ONDC:TRV13'] },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', enum: ['IND'] }
              }
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string' }
              }
            }
          }
        },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        action: { type: 'string', enum: ['select'] },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', enum: ['2.0.0'] },
        bap_uri: { type: 'string', format: 'uri' },
        bap_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' }
      }
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['provider', 'items', 'fulfillments'],
          properties: {
            provider: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' },
                time: {
                  type: 'object',
                  required: ['label', 'range'],
                  properties: {
                    label: { type: 'string', enum: ['AVAILABLE'] },
                    range: {
                      type: 'object',
                      required: ['start', 'end'],
                      properties: {
                        start: { type: 'string', format: 'date-time' },
                        end: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'location_ids', 'quantity'],
                properties: {
                  id: { type: 'string' },
                  location_ids: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  quantity: {
                    type: 'object',
                    required: ['selected'],
                    properties: {
                      selected: {
                        type: 'object',
                        required: ['count'],
                        properties: {
                          count: { type: 'number' }
                        }
                      }
                    }
                  },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['tags'],
                properties: {
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['descriptor', 'list'],
                      properties: {
                        descriptor: {
                          type: 'object',
                          required: ['code'],
                          properties: {
                            code: { type: 'string' }
                          }
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['descriptor', 'value'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['code'],
                                properties: {
                                  code: { type: 'string' }
                                }
                              },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  additionalProperties: false
}

export default selectSchemaTRV13 
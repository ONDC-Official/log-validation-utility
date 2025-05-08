const searchTimeSchemaTRV13 = {
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
        action: { type: 'string', enum: ['search'] },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', enum: ['2.0.0'] },
        bap_uri: { type: 'string', format: 'uri' },
        bap_id: { type: 'string' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' }
      }
    },
    message: {
      type: 'object',
      required: ['intent'],
      properties: {
        intent: {
          type: 'object',
          required: ['category', 'tags'],
          properties: {
            category: {
              type: 'object',
              required: ['descriptor', 'time'],
              properties: {
                descriptor: {
                  type: 'object',
                  required: ['code'],
                  properties: {
                    code: { type: 'string', enum: ['HOTEL'] }
                  }
                },
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
            fulfillment: {
              type: 'object',
              required: ['stops'],
              properties: {
                stops: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['type', 'location'],
                    properties: {
                      type: { type: 'string', enum: ['START', 'END'] },
                      location: {
                        type: 'object',
                        properties: {
                          gps: { type: 'string' },
                          area_code: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
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
  },
  additionalProperties: false
}

export default searchTimeSchemaTRV13 
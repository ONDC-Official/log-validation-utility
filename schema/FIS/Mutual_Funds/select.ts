export const selectFIS14Schema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
      context: {
        type: 'object',
        required: [
          'domain',
          'location',
          'version',
          'action',
          'bap_id',
          'bap_uri',
          'bpp_id',
          'bpp_uri',
          'transaction_id',
          'message_id',
          'timestamp',
          'ttl'
        ],
        properties: {
          domain: { type: 'string' },
          location: {
            type: 'object',
            required: ['country', 'city'],
            properties: {
              country: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' }
                },
                additionalProperties: false
              },
              city: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string' }
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          version: { type: 'string' },
          action: { type: 'string', enum: ['select'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string', format: 'uri' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          ttl: { type: 'string', format: 'duration' }
        },
        additionalProperties: false
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
                  id: { type: 'string' }
                },
                additionalProperties: false
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'quantity'],
                  properties: {
                    id: { type: 'string' },
                    quantity: {
                      type: 'object',
                      required: ['selected'],
                      properties: {
                        selected: {
                          type: 'object',
                          required: ['measure'],
                          properties: {
                            measure: {
                              type: 'object',
                              required: ['value', 'unit'],
                              properties: {
                                value: { type: 'string' },
                                unit: { type: 'string' }
                              },
                              additionalProperties: false
                            }
                          },
                          additionalProperties: false
                        }
                      },
                      additionalProperties: false
                    }
                  },
                  additionalProperties: false
                }
              },
              fulfillments: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'type', 'customer'],
                  properties: {
                    id: { type: 'string' },
                    type: { type: 'string' },
                    customer: {
                      type: 'object',
                      required: ['person'],
                      properties: {
                        person: {
                          type: 'object',
                          required: ['id'],
                          properties: {
                            id: { type: 'string' }
                          },
                          additionalProperties: false
                        }
                      },
                      additionalProperties: false
                    },
                    agent: {
                      type: 'object',
                      properties: {
                        person: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' }
                          },
                          additionalProperties: false
                        },
                        organization: {
                          type: 'object',
                          properties: {
                            creds: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['id', 'type'],
                                properties: {
                                  id: { type: 'string' },
                                  type: { type: 'string' }
                                },
                                additionalProperties: false
                              }
                            }
                          },
                          additionalProperties: false
                        }
                      },
                      additionalProperties: false
                    },
                    stops: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          time: {
                            type: 'object',
                            properties: {
                              schedule: {
                                type: 'object',
                                properties: {
                                  frequency: { type: 'string' }
                                },
                                additionalProperties: false
                              }
                            },
                            additionalProperties: false
                          }
                        },
                        additionalProperties: false
                      }
                    }
                  },
                  additionalProperties: false
                }
              },
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['descriptor', 'list'],
                  properties: {
                    display: { type: 'boolean' },
                    descriptor: {
                      type: 'object',
                      required: ['name', 'code'],
                      properties: {
                        name: { type: 'string' },
                        code: { type: 'string' }
                      },
                      additionalProperties: false
                    },
                    list: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['descriptor', 'value'],
                        properties: {
                          descriptor: {
                            type: 'object',
                            required: ['name', 'code'],
                            properties: {
                              name: { type: 'string' },
                              code: { type: 'string' }
                            },
                            additionalProperties: false
                          },
                          value: { type: 'string' }
                        },
                        additionalProperties: false
                      }
                    }
                  },
                  additionalProperties: false
                }
              }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    },
    additionalProperties: false
  };
  
  
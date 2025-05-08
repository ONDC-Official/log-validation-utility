const onSelectSchemaTRV13 = {
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
        action: { type: 'string', enum: ['on_select'] },
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
          required: ['provider', 'items', 'quote', 'payments'],
          properties: {
            provider: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id'],
                properties: {
                  id: { type: 'string' },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'string' }
                      }
                    }
                  },
                  payment_ids: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            },
            quote: {
              type: 'object',
              required: ['price', 'breakup', 'ttl'],
              properties: {
                price: {
                  type: 'object',
                  required: ['currency', 'value'],
                  properties: {
                    currency: { type: 'string' },
                    value: { type: 'string' }
                  }
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'price'],
                    properties: {
                      item: {
                        type: 'object',
                        required: ['id', 'quantity', 'price'],
                        properties: {
                          id: { type: 'string' },
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
                          price: {
                            type: 'object',
                            required: ['currency', 'value'],
                            properties: {
                              currency: { type: 'string' },
                              value: { type: 'string' }
                            }
                          },
                          add_ons: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['id', 'price'],
                              properties: {
                                id: { type: 'string' },
                                price: {
                                  type: 'object',
                                  required: ['currency', 'value'],
                                  properties: {
                                    currency: { type: 'string' },
                                    value: { type: 'string' }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      title: { type: 'string' },
                      price: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                ttl: { type: 'string' }
              }
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'type'],
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['descriptor'],
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
                  },
                  params: {
                    type: 'object',
                    properties: {
                      amount: { type: 'string' },
                      currency: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' }
      }
    }
  },
  additionalProperties: false
}

export default onSelectSchemaTRV13 
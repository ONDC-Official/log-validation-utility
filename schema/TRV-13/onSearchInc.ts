const onSearchIncSchemaTRV13 = {
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
        action: { type: 'string', enum: ['on_search'] },
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
      required: ['catalog'],
      properties: {
        catalog: {
          type: 'object',
          required: ['providers'],
          properties: {
            providers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'items'],
                properties: {
                  id: { type: 'string' },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'descriptor'],
                      properties: {
                        id: { type: 'string' },
                        descriptor: {
                          type: 'object',
                          required: ['name'],
                          properties: {
                            name: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'descriptor', 'price', 'location_ids', 'category_ids'],
                      properties: {
                        id: { type: 'string' },
                        time: {
                          type: 'object',
                          properties: {
                            label: { type: 'string' },
                            timestamp: { type: 'string', format: 'date-time' }
                          }
                        },
                        descriptor: {
                          type: 'object',
                          required: ['name'],
                          properties: {
                            name: { type: 'string' },
                            code: { type: 'string' },
                            additional_desc: {
                              type: 'object',
                              properties: {
                                url: { type: 'string', format: 'uri' },
                                content_type: { type: 'string' }
                              }
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['url'],
                                properties: {
                                  url: { type: 'string', format: 'uri' }
                                }
                              }
                            }
                          }
                        },
                        price: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string' },
                            value: { type: 'string' },
                            maximum_value: { type: 'string' }
                          }
                        },
                        quantity: {
                          type: 'object',
                          properties: {
                            available: {
                              type: 'object',
                              properties: {
                                count: { type: 'number' }
                              }
                            },
                            maximum: {
                              type: 'object',
                              properties: {
                                count: { type: 'number' }
                              }
                            }
                          }
                        },
                        location_ids: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        category_ids: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        payment_ids: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        add_ons: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['id', 'descriptor', 'price'],
                            properties: {
                              id: { type: 'string' },
                              descriptor: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                  name: { type: 'string' },
                                  short_desc: { type: 'string' }
                                }
                              },
                              price: {
                                type: 'object',
                                required: ['currency', 'value'],
                                properties: {
                                  currency: { type: 'string' },
                                  value: { type: 'string' },
                                  maximum_value: { type: 'string' }
                                }
                              }
                            }
                          }
                        },
                        cancellation_terms: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              external_ref: {
                                type: 'object',
                                properties: {
                                  mimetype: { type: 'string' },
                                  url: { type: 'string', format: 'uri' }
                                }
                              }
                            }
                          }
                        },
                        recommended: { type: 'boolean' }
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

export default onSearchIncSchemaTRV13 
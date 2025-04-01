export const initFIS14Schema = {
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
          action: { type: 'string', enum: ['init'] },
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
                  required: ['id', 'quantity', 'fulfillment_ids'],
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
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: { type: 'string' }
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
                    type: { type: 'string', enum: ['SIP', 'LUMPSUM'] },
                    customer: {
                      type: 'object',
                      properties: {
                        person: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', pattern: '^pan:[a-zA-Z0-9]+$' },
                            creds: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['id', 'type'],
                                properties: {
                                  id: { type: 'string' },
                                  type: { type: 'string', enum: ['IP_ADDRESS', 'ARN', 'SUB_BROKER_ARN', 'EUIN'] }
                                },
                                additionalProperties: false
                              }
                            }
                          },
                          additionalProperties: false
                        },
                        contact: {
                          type: 'object',
                          properties: {
                            phone: { type: 'string', pattern: '^[0-9]{10}$' }
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
              payments: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['collected_by', 'params', 'type', 'tags'],
                  properties: {
                    collected_by: { type: 'string', enum: ['BPP'] },
                    params: {
                      type: 'object',
                      required: ['amount', 'currency'],
                      properties: {
                        amount: { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' },
                        currency: { type: 'string', enum: ['INR'] },
                        source_bank_code: { type: 'string' },
                        source_bank_account_number: { type: 'string' },
                        source_bank_account_name: { type: 'string' }
                      },
                      additionalProperties: false
                    },
                    type: { type: 'string', enum: ['PRE_FULFILLMENT'] },
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
                              name: { type: 'string' },
                              code: { type: 'string', enum: ['PAYMENT_METHOD'] }
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
                                  required: ['code'],
                                  properties: {
                                    code: { type: 'string', enum: ['MODE'] }
                                  },
                                  additionalProperties: false
                                },
                                value: { type: 'string', enum: ['MANDATE_REGISTRATION'] }
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
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['display', 'descriptor', 'list'],
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

export const onSelectFIS14Schema = {
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
          action: { type: 'string', enum: ['on_select'] },
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
                required: ['id', 'descriptor'],
                properties: {
                  id: { type: 'string' },
                  descriptor: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                      name: { type: 'string' }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'descriptor', 'fulfillment_ids', 'quantity'],
                  properties: {
                    id: { type: 'string' },
                    parent_item_id: { type: 'string' },
                    descriptor: {
                      type: 'object',
                      required: ['name', 'code'],
                      properties: {
                        name: { type: 'string' },
                        code: { type: 'string' }
                      },
                      additionalProperties: false
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: { type: 'string' }
                    },
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
                      properties: {
                        person: {
                          type: 'object',
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
              xinput: {
                type: 'object',
                properties: {
                  required: { type: 'boolean' },
                  head: {
                    type: 'object',
                    properties: {
                      index: {
                        type: 'object',
                        properties: {
                          min: { type: 'integer' },
                          cur: { type: 'integer' },
                          max: { type: 'integer' }
                        },
                        additionalProperties: false
                      },
                      headings: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    },
                    additionalProperties: false
                  },
                  form: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      url: { type: 'string', format: 'uri' },
                      mime_type: { type: 'string' }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
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

export const onSearchFIS14Schema = {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            const: 'ONDC:FIS14',
          },
          action: {
            type: 'string',
            const: 'on_search',
          },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    minLength: 1,
                  }
                },
                required: ['code']
              },
              city: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    minLength: 1,
                  }
                },
                required: ['code']
              }
            },
            required: ['country', 'city']
          },
          bap_id: {
            type: 'string',
            minLength: 1,
          },
          bap_uri: {
            type: 'string',
            minLength: 1,
            format: 'uri',
          },
          bpp_id: {
            type: 'string',
            minLength: 1,
          },
          bpp_uri: {
            type: 'string',
            minLength: 1,
            format: 'uri',
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
          version: {
            type: 'string',
            minLength: 1,
          },
          ttl: {
            type: 'string',
            pattern: '^PT[0-9]+[HMS]$',
          },
        },
        required: [
          'domain',
          'action',
          'location',
          'bap_id',
          'bap_uri',
          'bpp_id',
          'bpp_uri',
          'transaction_id',
          'message_id',
          'timestamp',
          'version',
          'ttl',
        ],
      },
      message: {
        type: 'object',
        properties: {
          catalog: {
            type: 'object',
            properties: {
              descriptor: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    minLength: 1
                  }
                },
                required: ['name']
              },
              providers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      minLength: 1
                    },
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          minLength: 1
                        }
                      },
                      required: ['name']
                    },
                    categories: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            minLength: 1
                          },
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                minLength: 1
                              },
                              name: {
                                type: 'string',
                                minLength: 1
                              }
                            },
                            required: ['code', 'name']
                          },
                          parent_category_id: {
                            type: 'string'
                          }
                        },
                        required: ['id', 'descriptor']
                      },
                      minItems: 1
                    },
                    fulfillments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            minLength: 1
                          },
                          type: {
                            type: 'string',
                            enum: ['LUMPSUM', 'SIP', 'REDEMPTION']
                          },
                          tags: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      enum: ['THRESHOLDS']
                                    },
                                    name: {
                                      type: 'string',
                                      minLength: 1
                                    }
                                  },
                                  required: ['code', 'name']
                                },
                                display: {
                                  type: 'boolean'
                                },
                                list: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      descriptor: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            type: 'string',
                                            enum: [
                                              'AMOUNT_MIN', 
                                              'AMOUNT_MAX', 
                                              'AMOUNT_MULTIPLES',
                                              'FREQUENCY',
                                              'FREQUENCY_DATES',
                                              'INSTALMENTS_COUNT_MIN',
                                              'INSTALMENTS_COUNT_MAX',
                                              'CUMULATIVE_AMOUNT_MIN',
                                              'UNITS_MIN',
                                              'UNITS_MAX',
                                              'UNITS_MULTIPLES'
                                            ]
                                          },
                                          name: {
                                            type: 'string',
                                            minLength: 1
                                          }
                                        },
                                        required: ['code', 'name']
                                      },
                                      value: {
                                        type: 'string',
                                        minLength: 1
                                      }
                                    },
                                    required: ['descriptor', 'value']
                                  },
                                  minItems: 1
                                }
                              },
                              required: ['descriptor', 'list']
                            },
                            minItems: 1
                          }
                        },
                        required: ['id', 'type', 'tags']
                      },
                      minItems: 1
                    },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            minLength: 1
                          },
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                enum: ['SCHEME', 'SCHEME_PLAN']
                              },
                              name: {
                                type: 'string',
                                minLength: 1
                              }
                            },
                            required: ['code', 'name']
                          },
                          category_ids: {
                            type: 'array',
                            items: {
                              type: 'string',
                              minLength: 1
                            },
                            minItems: 1
                          },
                          matched: {
                            type: 'boolean'
                          },
                          parent_item_id: {
                            type: 'string'
                          },
                          fulfillment_ids: {
                            type: 'array',
                            items: {
                              type: 'string',
                              minLength: 1
                            }
                          },
                          creator: {
                            type: 'object',
                            properties: {
                              descriptor: {
                                type: 'object',
                                properties: {
                                  name: {
                                    type: 'string',
                                    minLength: 1
                                  }
                                },
                                required: ['name']
                              }
                            },
                            required: ['descriptor']
                          },
                          tags: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      enum: [
                                        'SCHEME_INFORMATION',
                                        'PLAN_INFORMATION',
                                        'PLAN_IDENTIFIERS',
                                        'PLAN_OPTIONS'
                                      ]
                                    },
                                    name: {
                                      type: 'string',
                                      minLength: 1
                                    }
                                  },
                                  required: ['code', 'name']
                                },
                                display: {
                                  type: 'boolean'
                                },
                                list: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      descriptor: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            type: 'string',
                                            minLength: 1
                                          },
                                          name: {
                                            type: 'string',
                                            minLength: 1
                                          }
                                        },
                                        required: ['code', 'name']
                                      },
                                      value: {
                                        type: 'string',
                                        minLength: 1
                                      }
                                    },
                                    required: ['descriptor', 'value']
                                  },
                                  minItems: 1
                                }
                              },
                              required: ['descriptor', 'list']
                            },
                            minItems: 1
                          }
                        },
                        required: ['id', 'descriptor', 'category_ids', 'matched']
                      },
                      minItems: 1
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                enum: ['BPP_TERMS']
                              },
                              name: {
                                type: 'string',
                                minLength: 1
                              }
                            },
                            required: ['code', 'name']
                          },
                          display: {
                            type: 'boolean'
                          },
                          list: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      enum: ['STATIC_TERMS', 'OFFLINE_CONTRACT']
                                    },
                                    name: {
                                      type: 'string',
                                      minLength: 1
                                    }
                                  },
                                  required: ['code', 'name']
                                },
                                value: {
                                  type: 'string',
                                  minLength: 1
                                }
                              },
                              required: ['descriptor', 'value']
                            },
                            minItems: 1
                          }
                        },
                        required: ['descriptor', 'list']
                      },
                      minItems: 1
                    }
                  },
                  required: ['id', 'descriptor', 'categories', 'fulfillments', 'items', 'tags']
                },
                minItems: 1
              }
            },
            required: ['descriptor', 'providers']
          }
        },
        required: ['catalog']
      }
    },
    required: ['context', 'message']
  }
  
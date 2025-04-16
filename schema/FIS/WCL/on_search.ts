export const onSearchFIS12WCLSchema = {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: { type: 'string', const: 'ONDC:FIS12' },
          action: { type: 'string', const: 'on_search' },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: { type: 'string', minLength: 1 }
                },
                required: ['code']
              },
              city: {
                type: 'object',
                properties: {
                  code: { type: 'string', minLength: 1 }
                },
                required: ['code']
              }
            },
            required: ['country', 'city']
          },
          version: { type: 'string', minLength: 1 },
          bap_id: { type: 'string', minLength: 1 },
          bap_uri: { type: 'string', format: 'uri', minLength: 1 },
          transaction_id: { type: 'string', minLength: 1 },
          message_id: { type: 'string', minLength: 1 },
          ttl: {
            type: 'string',
            pattern: '^PT[0-9]+[HMS]'
          },
          timestamp: { type: 'string', format: 'date-time' },
          bpp_id: { type: 'string', minLength: 1 },
          bpp_uri: { type: 'string', format: 'uri', minLength: 1 }
        },
        required: [
          'domain',
          'action',
          'location',
          'version',
          'bap_id',
          'bap_uri',
          'transaction_id',
          'message_id',
          'ttl',
          'timestamp',
          'bpp_id',
          'bpp_uri'
        ]
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
                  name: { type: 'string', minLength: 1 }
                },
                required: ['name']
              },
              providers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', minLength: 1 },
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', minLength: 1 },
                        short_desc: { type: 'string' },
                        long_desc: { type: 'string' },
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              url: { type: 'string', format: 'uri' },
                              size_type: { type: 'string' }
                            },
                            required: ['url']
                          }
                        }
                      },
                      required: ['name']
                    },
                    categories: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', minLength: 1 },
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: { type: 'string', minLength: 1 },
                              name: { type: 'string', minLength: 1 }
                            },
                            required: ['code', 'name']
                          }
                        },
                        required: ['id', 'descriptor']
                      }
                    },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', minLength: 1 },
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: { type: 'string', minLength: 1 },
                              name: { type: 'string', minLength: 1 }
                            },
                            required: ['code', 'name']
                          },
                          category_ids: {
                            type: 'array',
                            items: { type: 'string' },
                            minItems: 1
                          },
                          matched: { type: 'boolean' },
                          recommended: { type: 'boolean' },
                          xinput: {
                            type: 'object',
                            properties: {
                              required: { type: 'boolean' },
                              head: {
                                type: 'object',
                                properties: {
                                  descriptor: {
                                    type: 'object',
                                    properties: {
                                      name: { type: 'string', minLength: 1 }
                                    },
                                    required: ['name']
                                  },
                                  index: {
                                    type: 'object',
                                    properties: {
                                      min: { type: 'integer' },
                                      cur: { type: 'integer' },
                                      max: { type: 'integer' }
                                    },
                                    required: ['min', 'cur', 'max']
                                  },
                                  headings: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    minItems: 1
                                  }
                                },
                                required: ['descriptor', 'index', 'headings']
                              },
                              form: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', minLength: 1 },
                                  mime_type: { type: 'string', minLength: 1 },
                                  url: { type: 'string', format: 'uri' },
                                  resubmit: { type: 'boolean' },
                                  multiple_sumbissions: { type: 'boolean' }
                                },
                                required: ['id', 'mime_type', 'url']
                              }
                            },
                            required: ['required', 'head', 'form']
                          }
                        },
                        required: ['id', 'descriptor', 'category_ids']
                      }
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: { type: 'string', minLength: 1 },
                              name: { type: 'string', minLength: 1 }
                            },
                            required: ['code', 'name']
                          },
                          list: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  properties: {
                                    code: { type: 'string', minLength: 1 },
                                    name: { type: 'string', minLength: 1 }
                                  },
                                  required: ['code', 'name']
                                },
                                value: { type: 'string', minLength: 1 }
                              },
                              required: ['descriptor', 'value']
                            }
                          }
                        },
                        required: ['descriptor', 'list']
                      }
                    }
                  },
                  required: ['id', 'descriptor']
                },
                minItems: 1
              },
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    display: { type: 'boolean' },
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', minLength: 1 },
                        code: { type: 'string', enum: ['BPP_TERMS'] }
                      },
                      required: ['name', 'code']
                    },
                    list: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: { type: 'string' }
                            },
                            required: ['code']
                          },
                          value: { type: 'string', minLength: 1 }
                        },
                        required: ['descriptor', 'value']
                      },
                      minItems: 1
                    }
                  },
                  required: ['descriptor', 'list']
                }
              }
            },
            required: ['descriptor', 'providers']
          }
        },
        required: ['catalog']
      }
    },
    required: ['context', 'message']
  };
  
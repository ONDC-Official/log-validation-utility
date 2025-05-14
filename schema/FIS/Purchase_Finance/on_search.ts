export const onSearchFIS12PurchaseFinanceSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          const: 'ONDC:FIS12',
        },
        action: {
          type: 'string',
          const: 'on_search',
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
        ttl: {
          type: 'string',
          pattern: '^PT[0-9]+[HMS]',
        },
      },
      required: [
        'domain',
        'action',
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
        catalog: {
          type: 'object',
          properties: {
            descriptor: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['name'],
            },
            providers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  descriptor: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        minLength: 1,
                      },
                      short_desc: {
                        type: 'string',
                        minLength: 1,
                      },
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            url: {
                              type: 'string',
                              format: 'uri',
                            },
                          },
                          required: ['url'],
                        },
                      },
                    },
                    required: ['name'],
                  },
                  locations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          minLength: 1,
                        }
                      },
                      required: ['id']
                    }
                  },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          minLength: 1,
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              pattern: '.*PURCHASE_FINANCE.*',
                            },
                          },
                          required: ['code'],
                        },
                      },
                      required: ['id', 'descriptor'],
                    },
                    minItems: 1,
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          minLength: 1,
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                              minLength: 1,
                            },
                            short_desc: {
                              type: 'string',
                              minLength: 1,
                            },
                            long_desc: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['name'],
                        },
                        price: {
                          type: 'object',
                          properties: {
                            currency: {
                              type: 'string',
                              minLength: 1,
                            },
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['currency', 'value'],
                        },
                        category_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                            minLength: 1,
                          },
                          minItems: 1,
                        },
                        tags: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              display: {
                                type: 'boolean',
                              },
                              descriptor: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    enum: ['INFO', 'TERMS', 'FORM_REQUIRED', 'INFO_REQUIRED', 'CONSENT_INFO', 'CHECKLISTS'],
                                  },
                                },
                                required: ['code'],
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
                                          minLength: 1,
                                        },
                                      },
                                      required: ['code'],
                                    },
                                    value: {
                                      type: 'string',
                                      minLength: 1,
                                    },
                                  },
                                  required: ['descriptor', 'value'],
                                },
                              },
                            },
                            required: ['descriptor'],
                          },
                        },
                        xinput: {
                          type: 'object',
                          properties: {
                            head: {
                              type: 'object',
                              properties: {
                                descriptor: {
                                  type: 'object',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      minLength: 1,
                                    },
                                  },
                                },
                                index: {
                                  type: 'object',
                                  properties: {
                                    min: {
                                      type: 'integer',
                                      minimum: 0,
                                    },
                                    cur: {
                                      type: 'integer',
                                      minimum: 0,
                                    },
                                    max: {
                                      type: 'integer',
                                      minimum: 0,
                                    },
                                  },
                                },
                                headings: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                    minLength: 1,
                                  },
                                },
                              },
                            },
                            form: {
                              type: 'object',
                              properties: {
                                id: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                url: {
                                  type: 'string',
                                  format: 'uri',
                                },
                                mime_type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                resubmit: {
                                  type: 'boolean',
                                },
                                multiple_sumbissions: {
                                  type: 'boolean',
                                },
                              },
                            },
                            required: {
                              type: 'boolean',
                            },
                            form_response: {
                              type: 'object',
                              properties: {
                                status: {
                                  type: 'string',
                                  enum: ['SUCCESS', 'APPROVED'],
                                },
                                submission_id: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['status', 'submission_id'],
                            },
                          },
                          required: [],
                        },
                      },
                      required: ['id', 'descriptor', 'category_ids'],
                    },
                    minItems: 1,
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        display: {
                          type: 'boolean',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              enum: ['CONTACT_INFO', 'BPP_TERMS', 'LSP_INFO', 'GRO_DETAILS'],
                            },
                          },
                          required: ['code'],
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
                                    minLength: 1,
                                  },
                                },
                                required: ['code'],
                              },
                              value: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['descriptor', 'value'],
                          },
                          minItems: 1,
                        },
                      },
                      required: ['descriptor', 'list'],
                    },
                  },
                },
                required: ['id', 'descriptor', 'categories', 'items'],
              },
              minItems: 1,
            },
          },
          required: ['descriptor', 'providers'],
        },
      },
      required: ['catalog'],
    },
  },
  required: ['context', 'message'],
};

const KNOWN_TAG_DESCRIPTOR_CODES = [
  'PLAN_INFORMATION', 'PLAN_IDENTIFIERS', 'PLAN_OPTIONS', 'CHECKLISTS', 
  'THRESHOLDS', 'BPP_TERMS', 'PAYMENT_METHOD'
];

const KNOWN_ITEM_LIST_DESCRIPTOR_CODES = [
  'CONSUMER_TNC', 'ISIN', 'RTA_IDENTIFIER', 'AMFI_IDENTIFIER', 
  'PLAN', 'OPTION', 'IDCW_OPTION', 'APPLICATION_FORM', 'APPLICATION_FORM_WITH_KYC', 
  'KYC', 'ESIGN'
];

const KNOWN_FULFILLMENT_LIST_DESCRIPTOR_CODES = [
  'FREQUENCY', 'FREQUENCY_DATES', 'AMOUNT_MIN', 'AMOUNT_MAX', 
  'AMOUNT_MULTIPLES', 'INSTALMENTS_COUNT_MIN', 'INSTALMENTS_COUNT_MAX', 
  'CUMULATIVE_AMOUNT_MIN'
];

const KNOWN_BPP_TERMS_CODES = ['STATIC_TERMS', 'OFFLINE_CONTRACT'];

export const onSelectFIS14Schema = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain', 'location', 'version', 'action', 'bap_id', 'bap_uri',
        'bpp_id', 'bpp_uri', 'transaction_id', 'message_id', 'timestamp', 'ttl'
      ],
      properties: {
        domain: { type: 'string', const: 'ONDC:FIS14' },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', minLength: 1 }
              },
              additionalProperties: false
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', minLength: 1 }
              },
              additionalProperties: false
            }
          },
          additionalProperties: false
        },
        version: { type: 'string', minLength: 1 },
        action: { type: 'string', const: 'on_select' },
        bap_id: { type: 'string', minLength: 1 },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string', minLength: 1 },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string', minLength: 1 },
        message_id: { type: 'string', minLength: 1 },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string', pattern: '^PT[0-9]+[HMS]' }
      },
      additionalProperties: false
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['provider', 'items', 'fulfillments', 'tags'],
          properties: {
            provider: {
              type: 'object',
              required: ['id', 'descriptor'],
              properties: {
                id: { type: 'string', minLength: 1 },
                descriptor: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', minLength: 1 }
                  },
                  additionalProperties: false
                }
              },
              additionalProperties: false
            },
            items: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['id', 'descriptor', 'fulfillment_ids', 'quantity', 'tags'],
                properties: {
                  id: { type: 'string', minLength: 1 },
                  parent_item_id: { type: 'string' },
                  descriptor: {
                    type: 'object',
                    required: ['name', 'code'],
                    properties: {
                      name: { type: 'string', minLength: 1 },
                      code: { type: 'string', enum: ['SCHEME_PLAN'] }
                    },
                    additionalProperties: false
                  },
                  fulfillment_ids: {
                    type: 'array',
                    minItems: 1,
                    items: { type: 'string', minLength: 1 }
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
                              value: { type: 'string', pattern: '^[0-9]+$' },
                              unit: { type: 'string', const: 'INR' }
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
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['display', 'descriptor', 'list'],
                      properties: {
                        display: { type: 'boolean' },
                        descriptor: {
                          type: 'object',
                          required: ['name', 'code'],
                          properties: {
                            name: { type: 'string', minLength: 1 },
                            code: { type: 'string', enum: KNOWN_TAG_DESCRIPTOR_CODES }
                          },
                          additionalProperties: false
                        },
                        list: {
                          type: 'array',
                          minItems: 1,
                          items: {
                            type: 'object',
                            required: ['descriptor', 'value'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['name', 'code'],
                                properties: {
                                  name: { type: 'string', minLength: 1 },
                                  code: { type: 'string', enum: KNOWN_ITEM_LIST_DESCRIPTOR_CODES }
                                },
                                additionalProperties: false
                              },
                              value: { type: 'string', minLength: 1 }
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
              minItems: 1,
              items: {
                type: 'object',
                required: ['id', 'type', 'customer', 'agent', 'stops'],
                properties: {
                  id: { type: 'string', minLength: 1 },
                  type: { type: 'string', enum: ['SIP', 'LUMPSUM'] },
                  customer: {
                    type: 'object',
                    required: ['person'],
                    properties: {
                      person: {
                        type: 'object',
                        required: ['id'],
                        properties: {
                          id: { type: 'string', pattern: '^pan:[a-zA-Z0-9]+$' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  },
                  agent: {
                    type: 'object',
                    required: ['person', 'organization'],
                    properties: {
                      person: {
                        type: 'object',
                        required: ['id'],
                        properties: {
                          id: { type: 'string', pattern: '^euin:[a-zA-Z0-9]+$' }
                        },
                        additionalProperties: false
                      },
                      organization: {
                        type: 'object',
                        required: ['creds'],
                        properties: {
                          creds: {
                            type: 'array',
                            minItems: 1,
                            items: {
                              type: 'object',
                              required: ['id', 'type'],
                              properties: {
                                id: { type: 'string', minLength: 1 },
                                type: { type: 'string', enum: ['ARN', 'SUB_BROKER_ARN'] }
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
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['time'],
                      properties: {
                        time: {
                          type: 'object',
                          required: ['schedule'],
                          properties: {
                            schedule: {
                              type: 'object',
                              required: ['frequency'],
                              properties: {
                                frequency: { 
                                  type: 'string', 
                                  pattern: '^R\\d+\\/\\d{4}-\\d{2}-\\d{2}\\/P\\d+[YMWD]$' 
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
                            name: { type: 'string', minLength: 1 },
                            code: { type: 'string', enum: ['THRESHOLDS'] }
                          },
                          additionalProperties: false
                        },
                        list: {
                          type: 'array',
                          minItems: 1,
                          items: {
                            type: 'object',
                            required: ['descriptor', 'value'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['name', 'code'],
                                properties: {
                                  name: { type: 'string', minLength: 1 },
                                  code: { type: 'string', enum: KNOWN_FULFILLMENT_LIST_DESCRIPTOR_CODES }
                                },
                                additionalProperties: false
                              },
                              value: { type: 'string', minLength: 1 }
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
              oneOf: [
                {
                  // First variant - form with required, head, etc.
                  type: 'object',
                  required: ['required', 'head', 'form'],
                  properties: {
                    required: { type: 'boolean' },
                    head: {
                      type: 'object',
                      required: ['index', 'headings'],
                      properties: {
                        index: {
                          type: 'object',
                          required: ['min', 'cur', 'max'],
                          properties: {
                            min: { type: 'integer', minimum: 0 },
                            cur: { type: 'integer', minimum: 0 },
                            max: { type: 'integer', minimum: 0 }
                          },
                          additionalProperties: false
                        },
                        headings: {
                          type: 'array',
                          items: { type: 'string', enum: ['APPLICATION_FORM_WITH_KYC', 'KYC', 'ESIGN', 'APPLICATION_FORM'] }
                        }
                      },
                      additionalProperties: false
                    },
                    form: {
                      type: 'object',
                      required: ['id', 'url'],
                      properties: {
                        id: { type: 'string', minLength: 1 },
                        url: { type: 'string', format: 'uri' },
                        mime_type: { type: 'string' }
                      },
                      additionalProperties: false
                    }
                  },
                  additionalProperties: false
                },
                {
                  // Second variant - form with form_response
                  type: 'object',
                  required: ['form', 'form_response'],
                  properties: {
                    form: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'string', minLength: 1 }
                      },
                      additionalProperties: false
                    },
                    form_response: {
                      type: 'object',
                      required: ['status', 'submission_id'],
                      properties: {
                        status: { type: 'string', enum: ['SUCCESS'] },
                        submission_id: { type: 'string', minLength: 1 }
                      },
                      additionalProperties: false
                    }
                  },
                  additionalProperties: false
                }
              ]
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['collected_by', 'type', 'tags'],
                properties: {
                  collected_by: { type: 'string', enum: ['BPP'] },
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
                required: ['descriptor', 'list'],
                properties: {
                  display: { type: 'boolean' },
                  descriptor: {
                    type: 'object',
                    required: ['name', 'code'],
                    properties: {
                      name: { type: 'string' },
                      code: { type: 'string', enum: ['BPP_TERMS'] }
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
                            code: { type: 'string', enum: KNOWN_BPP_TERMS_CODES }
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
            },
            quote: {
              type: 'object',
              required: ['id', 'price', 'breakup'],
              properties: {
                id: { type: 'string', minLength: 1 },
                price: {
                  type: 'object',
                  required: ['currency', 'value'],
                  properties: {
                    currency: { type: 'string', enum: ['INR'] },
                    value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' }
                  },
                  additionalProperties: false
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['item', 'title', 'price'],
                    properties: {
                      item: {
                        type: 'object',
                        required: ['id', 'fulfillment_ids'],
                        properties: {
                          id: { type: 'string', minLength: 1 },
                          fulfillment_ids: {
                            type: 'array',
                            items: { type: 'string', minLength: 1 }
                          }
                        },
                        additionalProperties: false
                      },
                      title: { type: 'string', minLength: 1 },
                      price: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string', enum: ['INR'] },
                          value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' }
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
          additionalProperties: false
        },
      },
    },
  }
}
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

const KNOWN_PAYMENT_METHOD_CODES = ['MODE'];
const KNOWN_CUSTOMER_CRED_TYPES = ['IP_ADDRESS', 'DEVICE_ID', 'MOBILE_DEVICE_ID'];
const KNOWN_AGENT_CRED_TYPES = ['ARN', 'SUB_BROKER_ARN'];
const KNOWN_PAYMENT_STATUSES = ['NOT-PAID', 'PAID', 'FAILED'];
const KNOWN_ORDER_STATUSES = ['CREATED', 'INITIATED', 'PENDING', 'COMPLETED', 'CANCELLED'];

export const onInitFIS14Schema = {
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
          action: { type: 'string', const: 'on_init' },
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
            required: ['id', 'status', 'provider', 'items', 'fulfillments', 'created_at', 'updated_at'],
            properties: {
              id: { type: 'string', minLength: 1 },
              status: { type: 'string', enum: KNOWN_ORDER_STATUSES },
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
                items: {
                  type: 'object',
                  required: ['id', 'descriptor', 'quantity', 'fulfillment_ids'],
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
                                unit: { type: 'string', enum: ['INR'] }
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
                      items: { type: 'string', minLength: 1 }
                    },
                    payment_ids: {
                      type: 'array',
                      items: { type: 'string', minLength: 1 }
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
                              code: { type: 'string', enum: KNOWN_TAG_DESCRIPTOR_CODES }
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
                items: {
                  type: 'object',
                  required: ['id', 'type', 'customer'],
                  properties: {
                    id: { type: 'string', minLength: 1 },
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
                                  id: { type: 'string', minLength: 1 },
                                  type: { type: 'string', enum: KNOWN_CUSTOMER_CRED_TYPES }
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
                    },
                    agent: {
                      type: 'object',
                      properties: {
                        person: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', pattern: '^euin:[a-zA-Z0-9]+$' }
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
                                  id: { type: 'string', minLength: 1 },
                                  type: { type: 'string', enum: KNOWN_AGENT_CRED_TYPES }
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
              payments: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'collected_by', 'status', 'type'],
                  properties: {
                    id: { type: 'string', minLength: 1 },
                    collected_by: { type: 'string', enum: ['BPP'] },
                    url: { type: 'string', format: 'uri' },
                    status: { type: 'string', enum: KNOWN_PAYMENT_STATUSES },
                    params: {
                      type: 'object',
                      properties: {
                        amount: { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' },
                        currency: { type: 'string', enum: ['INR'] },
                        source_bank_code: { type: 'string', minLength: 1 },
                        source_bank_account_number: { type: 'string', minLength: 1 },
                        source_bank_account_name: { type: 'string', minLength: 1 }
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
                                    code: { type: 'string', enum: KNOWN_PAYMENT_METHOD_CODES }
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
              },
              quote: {
                type: 'object',
                required: ['id', 'price', 'breakup'],
                properties: {
                  id: { type: 'string' },
                  price: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: { type: 'string' },
                      value: { type: 'string' }
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
                            id: { type: 'string' },
                            fulfillment_ids: {
                              type: 'array',
                              items: { type: 'string' }
                            }
                          },
                          additionalProperties: false
                        },
                        title: { type: 'string' },
                        price: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string' },
                            value: { type: 'string' }
                          },
                          additionalProperties: false
                        }
                      },
                      additionalProperties: false
                    }
                  }
                },
                additionalProperties: false
              },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    },
    additionalProperties: false
  };

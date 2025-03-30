export const onConfirmFIS14Schema = {
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
        domain: { type: 'string', enum: ['ONDC:FIS14'] },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } },
            city: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } }
          }
        },
        version: { type: 'string' },
        action: { type: 'string', enum: ['on_confirm'] },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string' }
      }
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['id', 'status', 'provider', 'items', 'fulfillments', 'payments', 'quote'],
          properties: {
            id: { type: 'string' },
            status: { type: 'string', enum: ['ACCEPTED', 'REJECTED'] },
            provider: {
              type: 'object',
              required: ['id', 'descriptor'],
              properties: {
                id: { type: 'string' },
                descriptor: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'descriptor', 'quantity', 'fulfillment_ids', 'payment_ids', 'tags'],
                properties: {
                  id: { type: 'string' },
                  parent_item_id: { type: 'string' },
                  descriptor: { 
                    type: 'object', 
                    required: ['name', 'code'], 
                    properties: { 
                      name: { type: 'string' }, 
                      code: { type: 'string', enum: ['SCHEME_PLAN'] } 
                    } 
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
                              unit: { type: 'string', enum: ['INR'] } 
                            } 
                          }
                        }
                      }
                    }
                  },
                  fulfillment_ids: { type: 'array', items: { type: 'string' } },
                  payment_ids: { type: 'array', items: { type: 'string' } },
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
                            code: { 
                              type: 'string', 
                              enum: [
                                'PLAN_INFORMATION', 
                                'PLAN_IDENTIFIERS', 
                                'PLAN_OPTIONS', 
                                'CHECKLISTS'
                              ] 
                            } 
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
                                required: ['name', 'code'], 
                                properties: { 
                                  name: { type: 'string' }, 
                                  code: { 
                                    type: 'string', 
                                    enum: [
                                      'CONSUMER_TNC',
                                      'ISIN',
                                      'RTA_IDENTIFIER',
                                      'AMFI_IDENTIFIER',
                                      'PLAN',
                                      'OPTION',
                                      'IDCW_OPTION',
                                      'APPLICATION_FORM',
                                      'KYC',
                                      'ESIGN'
                                    ] 
                                  } 
                                } 
                              },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
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
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          code: { type: 'string', enum: ['PENDING', 'ACTIVE', 'COMPLETED'] }
                        }
                      }
                    }
                  },
                  customer: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          creds: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['id', 'type'],
                              properties: {
                                id: { type: 'string' },
                                type: { type: 'string', enum: ['IP_ADDRESS'] }
                              }
                            }
                          }
                        }
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' }
                        }
                      }
                    }
                  },
                  agent: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
                        }
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
                                type: { type: 'string', enum: ['ARN', 'SUB_BROKER_ARN'] }
                              }
                            }
                          }
                        }
                      }
                    }
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
                              }
                            }
                          }
                        }
                      }
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
                            code: { type: 'string', enum: ['THRESHOLDS'] }
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
                                required: ['name', 'code'],
                                properties: {
                                  name: { type: 'string' },
                                  code: { 
                                    type: 'string', 
                                    enum: [
                                      'FREQUENCY',
                                      'FREQUENCY_DATES',
                                      'AMOUNT_MIN',
                                      'AMOUNT_MAX',
                                      'AMOUNT_MULTIPLES',
                                      'INSTALMENTS_COUNT_MIN',
                                      'INSTALMENTS_COUNT_MAX',
                                      'CUMULATIVE_AMOUNT_MIN'
                                    ] 
                                  }
                                }
                              },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } 
            },
            payments: { 
              type: 'array', 
              items: { 
                type: 'object',
                required: ['id', 'collected_by', 'status', 'type'],
                properties: {
                  id: { type: 'string' },
                  collected_by: { type: 'string', enum: ['BAP', 'BPP'] },
                  status: { type: 'string', enum: ['PAID', 'NOT-PAID'] },
                  url: { type: 'string', format: 'uri' },
                  params: {
                    type: 'object',
                    properties: {
                      amount: { type: 'string' },
                      currency: { type: 'string', enum: ['INR'] },
                      source_bank_code: { type: 'string' },
                      source_bank_account_number: { type: 'string' },
                      source_bank_account_name: { type: 'string' }
                    }
                  },
                  type: { type: 'string', enum: ['PRE_FULFILLMENT', 'ON_FULFILLMENT', 'POST_FULFILLMENT'] },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['descriptor', 'list'],
                      properties: {
                        descriptor: {
                          type: 'object',
                          required: ['name', 'code'],
                          properties: {
                            name: { type: 'string' },
                            code: { type: 'string', enum: ['PAYMENT_METHOD'] }
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
                                  code: { type: 'string', enum: ['MODE'] }
                                }
                              },
                              value: { type: 'string', enum: ['MANDATE_REGISTRATION'] }
                            }
                          }
                        }
                      }
                    }
                  }
                }
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
                      code: { type: 'string', enum: ['BAP_TERMS', 'BPP_TERMS'] }
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
                          required: ['name', 'code'],
                          properties: {
                            name: { type: 'string' },
                            code: { type: 'string', enum: ['STATIC_TERMS', 'OFFLINE_CONTRACT'] }
                          }
                        },
                        value: { type: 'string' }
                      }
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
                  reason_required: { type: 'boolean' },
                  external_ref: {
                    type: 'object',
                    properties: {
                      url: { type: 'string', format: 'uri' },
                      mimetype: { type: 'string' }
                    }
                  }
                }
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
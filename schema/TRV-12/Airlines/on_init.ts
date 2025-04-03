export const onInitSchemaTRV_12 = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
      context: {
        type: 'object',
        required: [
          'location',
          'domain',
          'timestamp',
          'bap_id',
          'transaction_id',
          'message_id',
          'version',
          'action',
          'bap_uri',
          'bpp_id',
          'bpp_uri',
          'ttl'
        ],
        properties: {
          location: {
            type: 'object',
            required: ['country', 'city'],
            properties: {
              country: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string', pattern: '^[A-Z]{3}$' }
                }
              },
              city: {
                type: 'object',
                required: ['code'],
                properties: {
                  code: { type: 'string', pattern: '^std:\\d{3}$' }
                }
              }
            }
          },
          domain: { type: 'string', enum: ['ONDC:TRV12'] },
          timestamp: { type: 'string', format: 'date-time' },
          bap_id: { type: 'string', format: 'uri' },
          transaction_id: { type: 'string', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' },
          message_id: { type: 'string', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' },
          version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
          action: { type: 'string', enum: ['on_init'] },
          bap_uri: { type: 'string', format: 'uri' },
          bpp_id: { type: 'string', format: 'uri' },
          bpp_uri: { type: 'string', format: 'uri' },
          ttl: { type: 'string', pattern: '^PT\\d+S$' }
        }
      },
      message: {
        type: 'object',
        required: ['order'],
        properties: {
          order: {
            type: 'object',
            required: ['provider', 'items', 'fulfillments', 'quote', 'payments', 'cancellation_terms', 'billing'],
            properties: {
              provider: {
                type: 'object',
                required: ['id', 'descriptor'],
                properties: {
                  id: { type: 'string' },
                  descriptor: {
                    type: 'object',
                    required: ['name', 'images'],
                    properties: {
                      name: { type: 'string' },
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['url', 'size_type'],
                          properties: {
                            url: { type: 'string', format: 'uri' },
                            size_type: { type: 'string', enum: ['xs'] }
                          }
                        }
                      }
                    }
                  }
                }
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'descriptor', 'price', 'quantity', 'category_ids', 'fulfillment_ids', 'time', 'refund_terms', 'tags'],
                  properties: {
                    id: { type: 'string' },
                    descriptor: {
                      type: 'object',
                      required: ['name', 'code'],
                      properties: {
                        name: { type: 'string' },
                        code: { type: 'string', enum: ['ADULT_TICKET', 'CHILD_TICKET'] }
                      }
                    },
                    price: {
                      type: 'object',
                      required: ['currency', 'value'],
                      properties: {
                        currency: { type: 'string', enum: ['INR'] },
                        value: { type: 'string', pattern: '^\\d+$' }
                      }
                    },
                    quantity: {
                      type: 'object',
                      required: ['selected'],
                      properties: {
                        selected: {
                          type: 'object',
                          required: ['count'],
                          properties: {
                            count: { type: 'integer' }
                          }
                        }
                      }
                    },
                    category_ids: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    time: {
                      type: 'object',
                      required: ['label', 'duration'],
                      properties: {
                        label: { type: 'string', enum: ['JOURNEY_TIME'] },
                        duration: { type: 'string', pattern: '^PT\\d+H\\d+M$' }
                      }
                    },
                    refund_terms: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['refund_eligible'],
                        properties: {
                          refund_eligible: { type: 'boolean' }
                        }
                      }
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['descriptor', 'display', 'list'],
                        properties: {
                          descriptor: {
                            type: 'object',
                            required: ['code', 'name'],
                            properties: {
                              code: { type: 'string', enum: ['FARE_TYPE', 'GENERAL_INFO'] },
                              name: { type: 'string' }
                            }
                          },
                          display: { type: 'boolean' },
                          list: {
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
                  required: ['id', 'type', 'stops', 'vehicle'],
                  properties: {
                    id: { type: 'string' },
                    type: { type: 'string', enum: ['TRIP', 'TICKET'] },
                    stops: {
                      type: 'array',
                      minItems: 2,
                      items: {
                        type: 'object',
                        required: ['id', 'type', 'location', 'time'],
                        properties: {
                          id: { type: 'string' },
                          type: { type: 'string', enum: ['START', 'END'] },
                          location: {
                            type: 'object',
                            required: ['descriptor'],
                            properties: {
                              descriptor: {
                                type: 'object',
                                required: ['name', 'code'],
                                properties: {
                                  name: { type: 'string' },
                                  code: { type: 'string' }
                                }
                              }
                            }
                          },
                          time: {
                            type: 'object',
                            required: ['label', 'timestamp'],
                            properties: {
                              label: { type: 'string', enum: ['DATE_TIME'] },
                              timestamp: { type: 'string', format: 'date-time' }
                            }
                          }
                        }
                      }
                    },
                    vehicle: {
                      type: 'object',
                      required: ['category', 'code'],
                      properties: {
                        category: { type: 'string', enum: ['AIRLINE'] },
                        code: { type: 'string' }
                      }
                    }
                  }
                }
              },
              quote: {
                type: 'object',
                required: ['price', 'breakup'],
                properties: {
                  price: {
                    type: 'object',
                    required: ['currency', 'value'],
                    properties: {
                      currency: { type: 'string', enum: ['INR'] },
                      value: { type: 'string', pattern: '^\\d+$' }
                    }
                  },
                  breakup: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['title', 'price'],
                      properties: {
                        title: { type: 'string' },
                        price: {
                          type: 'object',
                          required: ['currency', 'value'],
                          properties: {
                            currency: { type: 'string', enum: ['INR'] },
                            value: { type: 'string', pattern: '^\\d+$' }
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
                  required: ['id', 'collected_by', 'status', 'type', 'params'],
                  properties: {
                    id: { type: 'string' },
                    collected_by: { type: 'string', enum: ['BAP'] },
                    status: { type: 'string', enum: ['NOT-PAID'] },
                    type: { type: 'string', enum: ['PRE-ORDER'] },
                    params: {
                      type: 'object',
                      required: ['amount', 'currency', 'bank_code', 'bank_account_number', 'virtual_payment_address'],
                      properties: {
                        amount: { type: 'string', pattern: '^\\d+$' },
                        currency: { type: 'string', enum: ['INR'] },
                        bank_code: { type: 'string' },
                        bank_account_number: { type: 'string' },
                        virtual_payment_address: { type: 'string' }
                      }
                    }
                  }
                }
              },
              cancellation_terms: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['cancel_by', 'cancellation_fee'],
                  properties: {
                    cancel_by: {
                      type: 'object',
                      required: ['duration'],
                      properties: {
                        duration: { type: 'string', pattern: '^PT\\d+M$' }
                      }
                    },
                    cancellation_fee: {
                      type: 'object',
                      required: ['percentage'],
                      properties: {
                        percentage: { type: 'string', pattern: '^\\d+$' }
                      }
                    }
                  }
                }
              },
              billing: {
                type: 'object',
                required: ['name', 'phone', 'tax_id'],
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string', pattern: '^\\+91\\d{10}$' },
                  tax_id: { type: 'string', pattern: '^GSTIN:\\d{10}$' }
                }
              }
            }
          }
        }
      }
    }
  }
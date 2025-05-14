const onConfirmSchemaTRV13 = {
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
        action: { type: 'string', enum: ['on_confirm'] },
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
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['id', 'status', 'provider', 'items', 'quote', 'billing', 'fulfillments', 'payments', 'tags'],
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            provider: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'location_ids', 'quantity'],
                properties: {
                  id: { type: 'string' },
                  location_ids: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  quantity: {
                    type: 'object',
                    required: ['selected'],
                    properties: {
                      selected: {
                        type: 'object',
                        required: ['count'],
                        properties: {
                          count: { type: 'number' }
                        }
                      }
                    }
                  },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            quote: {
              type: 'object',
              required: ['price', 'breakup', 'ttl'],
              properties: {
                price: {
                  type: 'object',
                  required: ['currency', 'value'],
                  properties: {
                    currency: { type: 'string' },
                    value: { type: 'string' }
                  }
                },
                breakup: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'price'],
                    properties: {
                      item: {
                        type: 'object',
                        required: ['id', 'quantity', 'price'],
                        properties: {
                          id: { type: 'string' },
                          quantity: {
                            type: 'object',
                            required: ['selected'],
                            properties: {
                              selected: {
                                type: 'object',
                                required: ['count'],
                                properties: {
                                  count: { type: 'number' }
                                }
                              }
                            }
                          },
                          price: {
                            type: 'object',
                            required: ['currency', 'value'],
                            properties: {
                              currency: { type: 'string' },
                              value: { type: 'string' }
                            }
                          },
                          add_ons: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['id', 'price'],
                              properties: {
                                id: { type: 'string' },
                                price: {
                                  type: 'object',
                                  required: ['currency', 'value'],
                                  properties: {
                                    currency: { type: 'string' },
                                    value: { type: 'string' }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      title: { type: 'string' },
                      price: {
                        type: 'object',
                        required: ['currency', 'value'],
                        properties: {
                          currency: { type: 'string' },
                          value: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                ttl: { type: 'string' }
              }
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'type', 'status'],
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  status: { type: 'string', enum: ['PAID', 'NOT-PAID'] },
                  collected_by: { type: 'string', enum: ['BAP', 'BPP'] },
                  tags: {
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
                                  code: { type: 'string' }
                                }
                              },
                              value: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  },
                  params: {
                    type: 'object',
                    properties: {
                      amount: { type: 'string' },
                      currency: { type: 'string' },
                      transaction_id: { type: 'string' },
                      bank_code: { type: 'string' },
                      bank_account_number: { type: 'string' },
                      virtual_payment_address: { type: 'string' }
                    }
                  }
                }
              }
            },
            billing: {
              type: 'object',
              required: ['name', 'address', 'email', 'phone'],
              properties: {
                name: { type: 'string' },
                address: { type: 'string' },
                state: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                },
                city: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                },
                organization: {
                  type: 'object',
                  properties: {
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' }
                      }
                    },
                    address: { type: 'string' }
                  }
                },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' },
                tax_id: { type: 'string' }
              }
            },
            fulfillments: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'customer'],
                properties: {
                  id: { type: 'string' },
                  customer: {
                    type: 'object',
                    required: ['person', 'contact'],
                    properties: {
                      person: {
                        type: 'object',
                        required: ['name'],
                        properties: {
                          name: { type: 'string' },
                          age: { type: 'string' },
                          dob: { type: 'string' },
                          gender: { type: 'string' },
                          creds: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: ['id', 'type'],
                              properties: {
                                id: { type: 'string' },
                                type: { type: 'string' }
                              }
                            }
                          }
                        }
                      },
                      contact: {
                        type: 'object',
                        required: ['phone', 'email'],
                        properties: {
                          phone: { type: 'string' },
                          email: { type: 'string', format: 'email' }
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
                required: ['descriptor', 'list'],
                properties: {
                  descriptor: {
                    type: 'object',
                    required: ['code'],
                    properties: {
                      code: { type: 'string' }
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
                            code: { type: 'string' }
                          }
                        },
                        value: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  additionalProperties: false
}

export default onConfirmSchemaTRV13 
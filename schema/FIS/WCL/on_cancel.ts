export const onCancelFISWCLSchema= {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              },
              city: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              }
            },
            required: ['country', 'city']
          },
          version: { type: 'string' },
          action: { type: 'string', enum: ['on_cancel'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          timestamp: { type: 'string' },
          ttl: { type: 'string' }
        },
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
        ]
      },
      message: {
        type: 'object',
        properties: {
          order: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  descriptor: {
                    type: 'object',
                    properties: {
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            size_type: { type: 'string' },
                            url: { type: 'string' }
                          },
                          required: ['size_type', 'url']
                        }
                      },
                      long_desc: { type: 'string', nullable: true },
                      name: { type: 'string', nullable: true },
                      short_desc: { type: 'string', nullable: true }
                    }
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        descriptor: { type: 'object' },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              descriptor: { type: 'object' },
                              value: { type: 'string' }
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
              quote: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  price: {
                    type: 'object',
                    properties: {
                      currency: { type: 'string' },
                      value: { type: 'string' }
                    },
                    required: ['currency', 'value']
                  },
                  breakup: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        price: {
                          type: 'object',
                          properties: {
                            value: { type: 'string' },
                            currency: { type: 'string' }
                          },
                          required: ['value', 'currency']
                        }
                      },
                      required: ['title', 'price']
                    }
                  },
                  ttl: { type: 'string' }
                },
                required: ['id', 'price', 'breakup', 'ttl']
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    parent_item_id: { type: 'string', nullable: true },
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['code', 'name']
                    },
                    category_ids: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    price: {
                      type: 'object',
                      properties: {
                        currency: { type: 'string' },
                        value: { type: 'string' }
                      },
                      required: ['currency', 'value']
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: { type: 'object' },
                          list: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: { type: 'object' },
                                value: { type: 'string' }
                              },
                              required: ['descriptor', 'value']
                            }
                          },
                          display: { type: 'boolean', nullable: true }
                        },
                        required: ['descriptor', 'list']
                      }
                    }
                  },
                  required: ['id', 'descriptor', 'price', 'tags']
                }
              },
              payments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    collected_by: { type: 'string' },
                    params: {
                      type: 'object',
                      properties: {
                        amount: { type: 'string' },
                        currency: { type: 'string' }
                      },
                      required: ['amount', 'currency']
                    },
                    status: { type: 'string' },
                    type: { type: 'string' }
                  },
                  required: ['id', 'collected_by', 'params', 'status', 'type']
                }
              },
              cancellation_terms: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    fulfillment_state: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' }
                          },
                          required: ['code']
                        }
                      }
                    },
                    cancellation_fee: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        percentage: { type: 'string' }
                      },
                      required: ['percentage']
                    },
                    external_ref: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        mimetype: { type: 'string' },
                        url: { type: 'string' }
                      },
                      required: ['mimetype', 'url']
                    }
                  }
                }
              },
              documents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        name: { type: 'string' },
                        short_desc: { type: 'string' },
                        long_desc: { type: 'string' }
                      },
                      required: ['code', 'name']
                    },
                    mime_type: { type: 'string' },
                    url: { type: 'string' }
                  },
                  required: ['descriptor', 'mime_type', 'url']
                }
              },
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    display: { type: 'boolean', nullable: true },
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        code: { type: 'string' }
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
                          value: { type: 'string' }
                        },
                        required: ['descriptor', 'value']
                      }
                    }
                  },
                  required: ['descriptor', 'list']
                }
              },
              fulfillments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    customer: {
                      type: 'object',
                      properties: {
                        person: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            dob: { type: 'string' },
                            gender: { type: 'string' },
                            creds: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  type: { type: 'string' }
                                },
                                required: ['id', 'type']
                              }
                            }
                          },
                          required: ['name', 'dob', 'gender', 'creds']
                        },
                        contact: {
                          type: 'object',
                          properties: {
                            email: { type: 'string' },
                            phone: { type: 'string' }
                          },
                          required: ['email', 'phone']
                        }
                      },
                      required: ['person', 'contact']
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: { type: 'object' },
                          list: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                descriptor: { type: 'object' },
                                value: { type: 'string' }
                              },
                              required: ['descriptor', 'value']
                            }
                          }
                        },
                        required: ['descriptor', 'list']
                      }
                    }
                  },
                  required: ['id', 'customer', 'tags']
                }
              },
              created_at: { type: 'string' },
              updated_at: { type: 'string' }
            },
            required: [
              'id',
              'status',
              'provider',
              'quote',
              'items',
              'payments',
              'cancellation_terms',
              'documents',
              'tags',
              'fulfillments',
              'created_at',
              'updated_at'
            ]
          }
        },
        required: ['order']
      }
    },
    required: ['context', 'message']
  }
  
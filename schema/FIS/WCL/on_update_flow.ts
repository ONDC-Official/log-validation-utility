export const onUpdateFIS12FlowSchema = {
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
            const: 'on_update',
          },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    const: 'IND',
                  },
                },
                required: ['code'],
              },
              city: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    const: '*',
                  },
                },
                required: ['code'],
              },
            },
            required: ['country', 'city'],
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
            const: '2.3.0',
          },
          ttl: {
            type: 'string',
            pattern: '^PT30M$',
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
          order: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              ref_order_ids: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              status: {
                type: 'string',
                const: 'ACTIVE',
              },
              provider: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  descriptor: {
                    type: 'object',
                    properties: {
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            size_type: {
                              type: 'string',
                              const: 'sm',
                            },
                            url: {
                              type: 'string',
                              format: 'uri',
                            },
                          },
                          required: ['size_type', 'url'],
                        },
                      },
                      long_desc: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      short_desc: {
                        type: 'string',
                      },
                    },
                    required: ['name', 'short_desc'],
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
                            },
                            name: {
                              type: 'string',
                            },
                          },
                          required: ['code', 'name'],
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
                                  },
                                },
                                required: ['code'],
                              },
                              value: {
                                type: 'string',
                              },
                            },
                            required: ['descriptor', 'value'],
                          },
                        },
                      },
                      required: ['descriptor', 'list'],
                    },
                    minItems: 1,
                  },
                },
                required: ['id', 'descriptor'],
              },
              quote: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  price: {
                    type: 'object',
                    properties: {
                      currency: {
                        type: 'string',
                        const: 'INR',
                      },
                      value: {
                        type: 'string',
                      },
                    },
                    required: ['currency', 'value'],
                  },
                  breakup: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                        },
                        price: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                            },
                            currency: {
                              type: 'string',
                              const: 'INR',
                            },
                          },
                          required: ['value', 'currency'],
                        },
                      },
                      required: ['title', 'price'],
                    },
                  },
                  ttl: {
                    type: 'string',
                    pattern: '^P5D$',
                  },
                },
                required: ['id', 'price'],
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    parent_item_id: {
                      type: 'string',
                    },
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                      required: ['code', 'name'],
                    },
                    category_ids: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    price: {
                      type: 'object',
                      properties: {
                        currency: {
                          type: 'string',
                          const: 'INR',
                        },
                        value: {
                          type: 'string',
                        },
                      },
                      required: ['currency', 'value'],
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
                              },
                              name: {
                                type: 'string',
                              },
                            },
                            required: ['code', 'name'],
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
                                    },
                                  },
                                  required: ['code'],
                                },
                                value: {
                                  type: 'string',
                                },
                              },
                              required: ['descriptor', 'value'],
                            },
                          },
                        },
                        required: ['descriptor', 'list'],
                      },
                    },
                  },
                  required: ['id', 'descriptor', 'price'],
                },
              },
              payments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    collected_by: {
                      type: 'string',
                    },
                    url: {
                      type: 'string',
                      format: 'uri',
                    },
                    params: {
                      type: 'object',
                      properties: {
                        amount: {
                          type: 'string',
                        },
                        currency: {
                          type: 'string',
                          const: 'INR',
                        },
                      },
                      required: ['amount', 'currency'],
                    },
                    status: {
                      type: 'string',
                    },
                    time: {
                      type: 'object',
                      properties: {
                        label: {
                          type: 'string',
                        },
                        range: {
                          type: 'object',
                          properties: {
                            start: {
                              type: 'string',
                              format: 'date-time',
                            },
                            end: {
                              type: 'string',
                              format: 'date-time',
                            },
                          },
                          required: ['start', 'end'],
                        },
                        timestamp: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
                      required: ['label'],
                    },
                    type: {
                      type: 'string',
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
                              },
                              name: {
                                type: 'string',
                              },
                            },
                            required: ['code', 'name'],
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
                                    },
                                  },
                                  required: ['code'],
                                },
                                value: {
                                  type: 'string',
                                },
                              },
                              required: ['descriptor', 'value'],
                            },
                          },
                        },
                        required: ['descriptor', 'list'],
                      },
                    },
                  },
                  required: ['id', 'collected_by', 'status', 'time', 'type'],
                },
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
                        },
                        name: {
                          type: 'string',
                        },
                      },
                      required: ['code', 'name'],
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
                              },
                            },
                            required: ['code'],
                          },
                          value: {
                            type: 'string',
                          },
                        },
                        required: ['descriptor', 'value'],
                      },
                    },
                  },
                  required: ['descriptor', 'list'],
                },
              },
            },
            required: ['id', 'provider', 'quote', 'items'],
          },
        },
        required: ['order'],
      },
    },
    required: ['context', 'message'],
  };
  
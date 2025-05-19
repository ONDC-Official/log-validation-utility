export const onSelectFIS12WCLSchema = {
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
            const: 'on_select',
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
                  },
                },
                required: ['code'],
              },
              city: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['code'],
              },
            },
            required: ['country', 'city'],
          },
          version: {
            type: 'string',
            minLength: 1,
          },
          bap_id: {
            type: 'string',
            minLength: 1,
          },
          bap_uri: {
            type: 'string',
            format: 'uri',
            minLength: 1,
          },
          bpp_id: {
            type: 'string',
            minLength: 1,
          },
          bpp_uri: {
            type: 'string',
            format: 'uri',
            minLength: 1,
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
          'location',
          'version',
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
          order: {
            type: 'object',
            properties: {
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', minLength: 1 },
                  descriptor: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      short_desc: { type: 'string' },
                      long_desc: { type: 'string' },
                      images: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            size_type: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                          },
                          required: ['size_type', 'url'],
                        },
                      },
                    },
                    required: ['name'],
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' },
                            name: { type: 'string' },
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
                                  code: { type: 'string' },
                                  name: { type: 'string' },
                                  short_desc: { type: 'string' },
                                },
                                required: ['code', 'name'],
                              },
                              value: { type: 'string' },
                            },
                            required: ['descriptor', 'value'],
                          },
                        },
                      },
                      required: ['descriptor', 'list'],
                    },
                  },
                },
                required: ['id', 'descriptor'],
              },
              quote: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  price: {
                    type: 'object',
                    properties: {
                      currency: { type: 'string' },
                      value: { type: 'string' },
                    },
                    required: ['currency', 'value'],
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
                            currency: { type: 'string' },
                            value: { type: 'string' },
                          },
                          required: ['currency', 'value'],
                        },
                      },
                      required: ['title', 'price'],
                    },
                  },
                  ttl: { type: 'string' },
                },
                required: ['price', 'breakup'],
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    parent_item_id: { type: 'string' },
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        name: { type: 'string' },
                      },
                      required: ['code', 'name'],
                    },
                    category_ids: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    fulfillment_ids: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    price: {
                      type: 'object',
                      properties: {
                        currency: { type: 'string' },
                        value: { type: 'string' },
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
                              code: { type: 'string' },
                              name: { type: 'string' },
                              short_desc: { type: 'string' },
                            },
                            required: ['code', 'name'],
                          },
                          display: { type: 'boolean' },
                          list: {
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
                                  },
                                  required: ['code', 'name'],
                                },
                                value: { type: 'string' },
                              },
                              required: ['descriptor', 'value'],
                            },
                          },
                        },
                        required: ['descriptor', 'list'],
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
                                name: { type: 'string' },
                              },
                              required: ['name'],
                            },
                            index: {
                              type: 'object',
                              properties: {
                                min: { type: 'integer' },
                                cur: { type: 'integer' },
                                max: { type: 'integer' },
                              },
                              required: ['min', 'cur', 'max'],
                            },
                            headings: {
                              type: 'array',
                              items: { type: 'string' },
                            },
                          },
                          required: ['descriptor', 'index', 'headings'],
                        },
                        form: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            mime_type: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                          },
                          required: ['id', 'mime_type', 'url'],
                        },
                        required: { type: 'boolean' },
                      },
                      required: ['head', 'form', 'required'],
                    },
                  },
                  required: ['id', 'descriptor', 'category_ids', 'fulfillment_ids', 'price'],
                },
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
                                  type: { type: 'string' },
                                },
                                required: ['id', 'type'],
                              },
                            },
                          },
                          required: ['name', 'dob', 'gender'],
                        },
                        contact: {
                          type: 'object',
                          properties: {
                            email: { type: 'string', format: 'email' },
                            phone: { type: 'string' },
                          },
                          required: ['email', 'phone'],
                        },
                      },
                      required: ['person', 'contact'],
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          descriptor: {
                            type: 'object',
                            properties: {
                              code: { type: 'string' },
                              name: { type: 'string' },
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
                                    code: { type: 'string' },
                                    name: { type: 'string' },
                                  },
                                  required: ['code', 'name'],
                                },
                                value: { type: 'string' },
                              },
                              required: ['descriptor', 'value'],
                            },
                          },
                        },
                        required: ['descriptor', 'list'],
                      },
                    },
                  },
                  required: ['id', 'customer'],
                },
              },
            },
            required: ['provider', 'quote', 'items', 'fulfillments'],
          },
        },
        required: ['order'],
      },
    },
    required: ['context', 'message'],
  };
  
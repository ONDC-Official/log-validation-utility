export const onConfirmFIS12Schema = {
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
            const: 'on_confirm',
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
            minLength: 1,
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
                minLength: 1,
              },
              status: {
                type: 'string',
                enum: ['ACTIVE'],
              },
              provider: {
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
                      long_desc: {
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
                            size_type: {
                              type: 'string',
                              enum: ['sm', 'md', 'lg'],
                            },
                            url: {
                              type: 'string',
                              format: 'uri',
                            },
                          },
                          required: ['size_type', 'url'],
                        },
                      },
                    },
                    required: ['name', 'long_desc', 'short_desc'],
                  },
                },
                required: ['id', 'descriptor'],
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
                          enum: ['LSP_INFO', 'CONTACT_INFO'],
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
                                enum: [
                                  'LSP_NAME',
                                  'LSP_EMAIL',
                                  'LSP_CONTACT_NUMBER',
                                  'LSP_ADDRESS',
                                  'GRO_NAME',
                                  'GRO_EMAIL',
                                  'GRO_CONTACT_NUMBER',
                                  'CUSTOMER_SUPPORT_LINK',
                                  'CUSTOMER_SUPPORT_CONTACT_NUMBER',
                                  'CUSTOMER_SUPPORT_EMAIL',
                                ],
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
                minItems: 1,
              },
            },
            required: ['id', 'status', 'provider', 'tags'],
          },
          quote: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                minLength: 1,
              },
              price: {
                type: 'object',
                properties: {
                  currency: {
                    type: 'string',
                    enum: ['INR'],
                  },
                  value: {
                    type: 'string',
                    minLength: 1,
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
                      minLength: 1,
                    },
                    price: {
                      type: 'object',
                      properties: {
                        currency: {
                          type: 'string',
                          enum: ['INR'],
                        },
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['currency', 'value'],
                    },
                  },
                  required: ['title', 'price'],
                },
                minItems: 1,
              },
              ttl: {
                type: 'string',
                pattern: '^P[0-9]+D$',
              },
            },
            required: ['id', 'price', 'breakup'],
          },
          fulfillments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                customer: {
                  type: 'object',
                  properties: {
                    person: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          minLength: 1,
                        },
                        dob: {
                          type: 'string',
                          format: 'date',
                        },
                        gender: {
                          type: 'string',
                          enum: ['Male', 'Female'],
                        },
                        creds: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: {
                                type: 'string',
                                minLength: 1,
                              },
                              type: {
                                type: 'string',
                                enum: ['PAN'],
                              },
                            },
                            required: ['id', 'type'],
                          },
                        },
                      },
                      required: ['name', 'dob', 'gender', 'creds'],
                    },
                    contact: {
                      type: 'object',
                      properties: {
                        email: {
                          type: 'string',
                          format: 'email',
                        },
                        phone: {
                          type: 'string',
                          minLength: 10,
                          maxLength: 10,
                        },
                      },
                      required: ['email', 'phone'],
                    },
                  },
                  required: ['person', 'contact'],
                },
              },
              required: ['id', 'customer'],
            },
            minItems: 1,
          },
          cancellation_terms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fulfillment_state: {
                  type: 'object',
                  properties: {
                    descriptor: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          enum: ['SANCTIONED'],
                        },
                      },
                      required: ['code'],
                    },
                  },
                  required: ['descriptor'],
                },
                cancellation_fee: {
                  type: 'object',
                  properties: {
                    percentage: {
                      type: 'string',
                      pattern: '^\\d+%$',
                    },
                  },
                  required: ['percentage'],
                },
              },
              required: ['fulfillment_state', 'cancellation_fee'],
            },
            minItems: 1,
          },
        },
        required: ['order', 'quote', 'fulfillments', 'cancellation_terms'],
      },
    },
    required: ['context', 'message'],
  };
  
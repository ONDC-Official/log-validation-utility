export const confirmFIS12Schema = {
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
            const: 'confirm',
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
          bpp_id: {
            type: 'string',
            minLength: 1,
          },
          bpp_uri: {
            type: 'string',
            minLength: 1,
            format: 'uri',
          },
        },
        required: [
          'domain',
          'action',
          'location',
          'bap_id',
          'bap_uri',
          'transaction_id',
          'message_id',
          'timestamp',
          'version',
          'ttl',
          'bpp_id',
          'bpp_uri',
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
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['id'],
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
                              enum: ['Male', 'Female', 'Other'],
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
                                    minLength: 1,
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
                              minLength: 1,
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
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      minLength: 1,
                    },
                    parent_item_id: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['id', 'parent_item_id'],
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
                        name: {
                          type: 'string',
                          minLength: 1,
                        },
                        code: {
                          type: 'string',
                          enum: ['BAP_TERMS', 'BPP_TERMS'],
                        },
                      },
                      required: ['name', 'code'],
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
                minItems: 1,
              },
            },
            required: ['provider', 'fulfillments', 'items', 'tags'],
          },
        },
        required: ['order'],
      },
    },
    required: ['context', 'message'],
  };
  
export const searchFIS12WCLSchema = {
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
            const: 'search',
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
        ],
      },
      message: {
        type: 'object',
        properties: {
          intent: {
            type: 'object',
            properties: {
              category: {
                type: 'object',
                properties: {
                  descriptor: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        const: 'WORKING_CAPITAL_LOAN',
                      },
                    },
                    required: ['code'],
                  },
                },
                required: ['descriptor'],
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
                          enum: ['BAP_TERMS'],
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
                                enum: [
                                  'BUYER_FINDER_FEES_TYPE',
                                  'BUYER_FINDER_FEES_PERCENTAGE',
                                  'DELAY_INTEREST',
                                  'STATIC_TERMS',
                                  'OFFLINE_CONTRACT',
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
            required: ['category', 'tags'],
          },
        },
        required: ['intent'],
      },
    },
    required: ['context', 'message'],
  };
  
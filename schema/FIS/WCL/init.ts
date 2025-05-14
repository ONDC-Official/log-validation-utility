export const initFIS12Schema = {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: { type: 'string', const: 'ONDC:FIS12' },
          action: { type: 'string', const: 'init' },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: { type: 'string', minLength: 1 },
                },
                required: ['code'],
              },
              city: {
                type: 'object',
                properties: {
                  code: { type: 'string', minLength: 1 },
                },
                required: ['code'],
              },
            },
            required: ['country', 'city'],
          },
          transaction_id: { type: 'string', minLength: 1 },
          message_id: { type: 'string', minLength: 1 },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string', minLength: 1 },
          bap_id: { type: 'string', minLength: 1 },
          bap_uri: { type: 'string', minLength: 1, format: 'uri' },
          ttl: { type: 'string', pattern: '^PT[0-9]+[HMS]' },
          bpp_id: { type: 'string', minLength: 1 },
          bpp_uri: { type: 'string', minLength: 1, format: 'uri' },
        },
        required: [
          'domain',
          'action',
          'location',
          'transaction_id',
          'message_id',
          'timestamp',
          'version',
          'bap_id',
          'bap_uri',
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
                  id: { type: 'string', minLength: 1 },
                },
                required: ['id'],
              },
              fulfillments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', minLength: 1 },
                    customer: {
                      type: 'object',
                      properties: {
                        person: {
                          type: 'object',
                          properties: {
                            name: { type: 'string', minLength: 1 },
                            dob: { type: 'string', format: 'date' },
                            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                            creds: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', minLength: 1 },
                                  type: { type: 'string', enum: ['PAN'] },
                                },
                                required: ['id', 'type'],
                              },
                              minItems: 1,
                            },
                          },
                          required: ['name', 'dob', 'gender', 'creds'],
                        },
                        contact: {
                          type: 'object',
                          properties: {
                            email: { type: 'string', format: 'email' },
                            phone: { type: 'string', pattern: '^[0-9]{10}$' },
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
                    id: { type: 'string', minLength: 1 },
                    parent_item_id: { type: 'string', minLength: 1 },
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
                    display: { type: 'boolean' },
                    descriptor: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', minLength: 1 },
                        code: { type: 'string', const: 'BAP_TERMS' },
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
                              name: { type: 'string' },
                              code: {
                                type: 'string',
                                enum: [
                                  'BUYER_FINDER_FEES_TYPE',
                                  'BUYER_FINDER_FEES_PERCENTAGE',
                                  'SETTLEMENT_TYPE',
                                  'DELAY_INTEREST',
                                  'STATIC_TERMS',
                                  'OFFLINE_CONTRACT',
                                ],
                              },
                            },
                            required: ['code'],
                          },
                          value: { type: 'string', minLength: 1 },
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
  
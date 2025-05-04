export const updateFIS12PurchaseFinanceSchema = {
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
          const: 'update',
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
        ttl: {
          type: 'string',
          pattern: '^PT[0-9]+[HMS]',
        },
      },
      required: [
        'domain',
        'action',
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
        update_target: {
          type: 'string',
          const: 'fulfillments',
        },
        order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              minLength: 1,
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
                  state: {
                    type: 'object',
                    properties: {
                      descriptor: {
                        type: 'object',
                        properties: {
                          code: {
                            type: 'string',
                            const: 'DELIVERED',
                          },
                        },
                        required: ['code'],
                      },
                    },
                    required: ['descriptor'],
                  },
                  customer: {
                    type: 'object',
                    properties: {
                      person: {
                        type: 'object',
                        properties: {
                          creds: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  const: 'IMEI',
                                },
                                id: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['type', 'id'],
                            },
                            minItems: 1,
                          },
                        },
                        required: ['creds'],
                      },
                    },
                    required: ['person'],
                  },
                },
                required: ['id', 'state', 'customer'],
              },
              minItems: 1,
            },
          },
          required: ['id', 'fulfillments'],
        },
      },
      required: ['update_target', 'order'],
    },
  },
  required: ['context', 'message'],
}; 
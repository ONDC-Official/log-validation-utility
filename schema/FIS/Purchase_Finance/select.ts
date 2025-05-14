export const selectFIS12PurchaseFinanceSchema = {
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
          const: 'select',
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
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  xinput: {
                    type: 'object',
                    properties: {
                      form: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['id'],
                      },
                      form_response: {
                        type: 'object',
                        properties: {
                          status: {
                            type: 'string',
                            minLength: 1,
                          },
                          submission_id: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['status', 'submission_id'],
                      },
                    },
                    required: ['form'],
                  },
                },
                required: ['id'],
              },
              minItems: 1,
            },
          },
          required: ['provider', 'items'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}; 
export const trackSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'track',
        },
        core_version: {
          type: 'string',
          enum: ['1.2.5'],
          minLength: 1,
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          minLength: 1,
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          minLength: 1,
          format: 'url',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        timestamp: {
          type: 'string',
          minLength: 1,
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          minLength: 1,
          format: 'duration',
        },
      },
      required: [
        'domain',
        'action',
        'country',
        'city',
        'core_version',
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
        order_id: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['order_id'],
    },
  },
  required: ['context', 'message'],
}

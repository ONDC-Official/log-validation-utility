export const cancelSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'cancel',
        },
        core_version: {
          type: 'string',
          enum: ['1.2.0'],
          minLength: 1,
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          minLength: 1,
          type: 'string',
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
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
      },
      required: [
        'domain',
        'country',
        'city',
        'action',
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
          pattern: '^[a-zA-Z0-9-]{1,32}$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
          errorMessage: 'Order ID should be alphanumeric upto 32 letters max or UUID',
        },
        cancellation_reason_id: {
          type: 'string',
          minLength: 3,
          maxLength: 3,
        },
        descriptor: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
            short_desc: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['name', 'short_desc'],
        },
      },
      required: ['order_id', 'cancellation_reason_id'],
    },
  },
  required: ['context', 'message'],
}

export const onTrackSchema = {
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
          const: 'on_track',
        },
        core_version: {
          type: 'string',
          minLength: 1,
          const: '1.2.0',
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
          format: 'date-time',
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
        tracking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              minLength: 1,
            },
            location: {
              type: 'object',
              properties: {
                gps: {
                  type: 'string',
                  minLength: 1,
                  pattern: '^[0-9]{2}[.][0-9]{6,}[,][0-9]{2}[.][0-9]{6,}$',
                  errorMessage: 'The gps co-ordinates should be precise atleast upto 6 digits after decimal',
                },
                time: {
                  type: 'object',
                  properties: {
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                  required: ['timestamp'],
                },
                updated_at: {
                  type: 'string',
                  format: 'date-time',
                },
              },
              required: ['gps', 'time', 'updated_at'],
            },
            status: {
              type: 'string',
            },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    minLength: 1,
                  },
                  list: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          minLength: 1,
                        },
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['code', 'value'],
                    },
                  },
                },
                required: ['code', 'list'],
              },
            },
          },
          required: ['id', 'location', 'status', 'tags'],
        },
      },
      required: ['tracking'],
    },
  },
  required: ['context', 'message'],
}

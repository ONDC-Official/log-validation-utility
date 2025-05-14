export const updateFISWCLSchema = {
    type: 'object',
    properties: {
      context: {
        type: 'object',
        properties: {
          domain: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              country: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              },
              city: {
                type: 'object',
                properties: {
                  code: { type: 'string' }
                },
                required: ['code']
              }
            },
            required: ['country', 'city']
          },
          version: { type: 'string' },
          action: { type: 'string', enum: ['update'] },
          bap_id: { type: 'string' },
          bap_uri: { type: 'string' },
          transaction_id: { type: 'string' },
          message_id: { type: 'string' },
          ttl: { type: 'string' },
          timestamp: { type: 'string' },
          bpp_id: { type: 'string' },
          bpp_uri: { type: 'string' }
        },
        required: [
          'domain',
          'location',
          'version',
          'action',
          'bap_id',
          'bap_uri',
          'transaction_id',
          'message_id',
          'ttl',
          'timestamp',
          'bpp_id',
          'bpp_uri'
        ]
      },
      message: {
        type: 'object',
        properties: {
          update_target: { type: 'string' },
          order: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              payments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    params: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        amount: { type: ['string', 'number'], nullable: true },
                        currency: { type: 'string', nullable: true }
                      }
                    },
                    time: {
                      type: 'object',
                      nullable: true,
                      properties: {
                        label: { type: 'string', nullable: true }
                      }
                    }
                  }
                }
              }
            },
            required: ['id']
          }
        },
        required: ['update_target', 'order']
      }
    },
    required: ['context', 'message']
  }
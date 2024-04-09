const onSettleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: { type: 'string', enum: ['ONDC:NTS10'] },
        action: { type: 'string', enum: ['on_settle'] },
        core_version: { type: 'string', enum: ['1.0.0'] },
        country: { type: 'string' },
        city: { type: 'string' },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        key: { type: ['null', 'string'] },
        ttl: { type: 'string' },
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
      additionalProperties: false,
    },
    message: {
      type: 'object',
      properties: {
        settlement: {
          type: 'object',
          properties: {
            settlements: {
              type: 'array',
              minItems: 5,
              items: {
                type: 'object',
                properties: {
                  curr_type: { type: 'string' },
                  amount: {
                    type: 'object',
                    properties: {
                      currency: { type: 'string' },
                      value: { type: 'string' },
                    },
                    required: ['currency', 'value'],
                    additionalProperties: false,
                  },
                  settlement_id: { type: 'string' },
                  state: { type: 'string', enums: ['01', '02', '03'] },
                  settlement_reference_no: { type: 'string' }, //
                  error_code: { type: ['null', 'string'] },
                  error_message: { type: ['null', 'string'] },
                },
                required: [
                  'curr_type',
                  'amount',
                  'settlement_id',
                  'state',
                  'settlement_reference_no',
                  'error_code',
                  'error_message',
                ],
                additionalProperties: false,
              },
            },
          },
          required: ['settlements'],
          additionalProperties: false,
        },
      },
      required: ['settlement'],
      additionalProperties: false,
    },
  },
  required: ['context', 'message'],
  additionalProperties: false,
}
export default onSettleSchema
// timestamp > settlement

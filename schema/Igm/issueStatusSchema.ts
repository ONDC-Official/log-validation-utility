const issueStatusSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          enum: [
            'nic2004:52110',
            'nic2004:60232',
            'ONDC:RET10',
            'ONDC:RET11',
            'ONDC:RET12',
            'ONDC:RET13',
            'ONDC:RET14',
            'ONDC:RET15',
            'ONDC:RET16',
            'ONDC:RET17',
            'ONDC:NTS10',
            'ONDC:NTS11',
            'ONDC:TRV10',
            'ONDC:FIS10',
            'ONDC:FIS11',
          ],
        },
        country: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        action: {
          type: 'string',
        },
        core_version: {
          type: 'string',
        },
        bap_id: {
          type: 'string',
        },
        bap_uri: {
          type: 'string',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        key: {
          type: 'string',
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
        'transaction_id',
        'message_id',
        'timestamp',
        'bpp_id',
        'bpp_uri',
        'ttl',
      ],
    },
    message: {
      type: 'object',
      properties: {
        issue_id: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['issue_id'],
    },
  },
  required: ['context', 'message'],
}

export default issueStatusSchema

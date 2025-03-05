const newOnIssueSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          enum: [
            'nic2004:60232',
            'ONDC:AGR10',
            'ONDC:AGR11',
            'ONDC:AGR12',
            'ONDC:FIS10',
            'ONDC:FIS11',
            'ONDC:FIS12',
            'ONDC:FIS13',
            'ONDC:FIS14',
            'ONDC:LOG10',
            'ONDC:LOG11',
            'ONDC:MEC10',
            'ONDC:MEC11',
            'ONDC:NTS10',
            'ONDC:NTS11',
            'ONDC:ONEST10',
            'ONDC:ONEST11',
            'ONDC:ONEST12',
            'ONDC:ONEST13',
            'ONDC:RET10',
            'ONDC:RET11',
            'ONDC:RET12',
            'ONDC:RET13',
            'ONDC:RET14',
            'ONDC:RET15',
            'ONDC:RET16',
            'ONDC:RET18',
            'ONDC:RET1A',
            'ONDC:RET1B',
            'ONDC:RET1C',
            'ONDC:RET1D',
            'ONDC:RET1E',
            'ONDC:SRV10',
            'ONDC:SRV11',
            'ONDC:SRV12',
            'ONDC:SRV13',
            'ONDC:SRV14',
            'ONDC:SRV16',
            'ONDC:SRV17',
            'ONDC:SRV18',
            'ONDC:TRV10',
            'ONDC:TRV11',
            'ONDC:TRV12',
            'ONDC:TRV13',
            'ONDC:TRV14',
          ],
        },
        location: {
          type: 'object',
          properties: {
            country: {
              type: 'object',
              properties: {
                code: { type: 'string' },
              },
              required: ['code'],
            },
            city: {
              type: 'object',
              properties: {
                code: { type: 'string' },
              },
              required: ['code'],
            },
          },
          required: ['country', 'city'],
        },
        action: { type: 'string', const: 'on_issue' },
        core_version: { type: 'string' },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        ttl: { type: 'string', format: 'duration' },
      },
      required: [
        'domain',
        'location',
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
        updated_target: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              action: { type: 'string', enum: ['APPENDED'] },
            },
            required: ['path', 'action'],
          },
        },
        issue: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: {
              type: 'string',
              enum: ['OPEN', 'PROCESSING', 'RESOLVED', 'CLOSED'],
            },
            level: {
              type: 'string',
              enum: ['ISSUE', 'GRIEVANCE', 'DISPUTE'],
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            expected_response_time: {
              type: 'object',
              properties: {
                duration: { type: 'string', format: 'duration' },
              },
              required: ['duration'],
            },
            expected_resolution_time: {
              type: 'object',
              properties: {
                duration: { type: 'string', format: 'duration' },
              },
              required: ['duration'],
            },
            refs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ref_id: { type: 'string' },
                  ref_type: {
                    type: 'string',
                    enum: [
                      'ORDER',
                      'PROVIDER',
                      'FULFILMENT',
                      'ITEM',
                      'AGENT',
                      'TRANSACTION_ID',
                      'MESSAGE_ID',
                      'COMPLAINT',
                      'CUSTOMER',
                      'PAYMENT',
                      'ACTION',
                    ],
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: { type: 'string' },
                          },
                          required: ['code'],
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              descriptor: {
                                type: 'object',
                                properties: {
                                  code: { type: 'string' },
                                },
                                required: ['code'],
                              },
                              value: { type: 'string' },
                            },
                            required: ['descriptor', 'value'],
                          },
                        },
                      },
                      required: ['descriptor'],
                    },
                  },
                },
                required: ['ref_id', 'ref_type'],
              },
            },
            actors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: [
                      'CONSUMER',
                      'INTERFACING_NP',
                      'COUNTERPARTY_NP',
                      'PROVIDER',
                      'AGENT',
                      'INTERFACING_NP_GRO',
                      'COUNTERPARTY_NP_GRO',
                      'CASCADED_NP_GRO',
                      'CASCADED_NP',
                    ],
                  },
                  info: {
                    type: 'object',
                    properties: {
                      org: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                        },
                        required: ['name'],
                      },
                      person: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                        },
                        required: ['name'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: { type: 'string' },
                          email: { type: 'string', format: 'email' },
                        },
                        required: ['phone', 'email'],
                      },
                    },
                    required: ['org', 'contact'],
                  },
                },
                required: ['id', 'type', 'info'],
              },
            },
            source_id: { type: 'string' },
            complainant_id: { type: 'string' },
            respondent_ids: {
              type: 'array',
              items: { type: 'string' },
            },
            description: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                short_desc: { type: 'string' },
                long_desc: { type: 'string' },
                additional_desc: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', format: 'uri' },
                    content_type: { type: 'string' },
                  },
                  required: ['url', 'content_type'],
                },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                },
              },
              required: ['code', 'short_desc', 'long_desc'],
            },
            last_action_id: { type: 'string' },
            actions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  description: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        enum: [
                          'OPEN',
                          'PROCESSING',
                          'RESOLVED',
                          'CLOSED',
                          'INFO_REQUESTED',
                          'INFO_PROVIDED',
                          'INFO_NOT_AVAILABLE',
                          'RESOLUTION_PROPOSED',
                          'RESOLUTION_ACCEPTED',
                          'RESOLUTION_REJECTED',
                          'RESOLUTION_CASCADED',
                        ],
                      },
                      short_desc: { type: 'string' },
                    },
                    required: ['code', 'short_desc'],
                  },
                  updated_at: { type: 'string', format: 'date-time' },
                  action_by: { type: 'string' },
                  actor_details: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                    },
                    required: ['name'],
                  },
                },
                required: ['id', 'description', 'updated_at', 'action_by', 'actor_details'],
              },
            },
          },
          required: [
            'id',
            'status',
            'level',
            'created_at',
            'updated_at',
            'expected_response_time',
            'expected_resolution_time',
            'refs',
            'actors',
            'source_id',
            'complainant_id',
            'respondent_ids',
            'description',
            'last_action_id',
            'actions',
          ],
        },
      },
      required: ['updated_target', 'issue'],
    },
  },
  required: ['context', 'message'],
}

export default newOnIssueSchema

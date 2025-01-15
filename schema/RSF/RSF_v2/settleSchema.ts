const settleSchema = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'domain',
        'location',
        'version',
        'action',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'timestamp',
        'ttl'
      ],
      properties: {
        domain: { type: 'string', enum: ['ONDC:NTS10'] },
        location: {
          type: 'object',
          required: ['country', 'city'],
          properties: {
            country: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', enum: ['IND'] },
              },
            },
            city: {
              type: 'object',
              required: ['code'],
              properties: {
                code: { type: 'string', enum: ['*'] },
              },
            },
          },
        },
        version: { type: 'string', enum: ['2.0.0'] },
        action: { type: 'string', enum: ['settle'] },
        bap_id: { type: 'string' },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        transaction_id: { type: 'string' },
        message_id: { type: 'string' },
        timestamp: { type: 'string', format: 'rfc3339-date-time' },
        ttl: { type: 'string', format: 'duration' },
      },
    },
    message: {
      type: 'object',
      required: ['settlement'],
      properties: {
        collector_app_id: { type: 'string' },
        receiver_app_id: { type: 'string' },
        settlement: {
          type: 'object',
          required: ['type', 'orders'],
          properties: {
            type: { type: 'string', enum: ['NP-NP', 'MISC', 'NIL'] },
            id: { type: ['string', 'null'] },
            orders: {
              type: 'array',
              items: {
                oneOf: [
                  {
                    if: { properties: { settlementType: { const: "NIL" } } },
                    then: {
                      required: [],
                      properties: {}
                    }
                  },
                  {
                    if: { properties: { settlementType: { const: "MISC" } } },
                    then: {
                      required: ["id"],
                      properties: {
                        id: { type: "string" },
                        self: {
                          required: ["amount"],
                          properties: {
                            amount: {
                              required: ["currency", "value"],
                              properties: {
                                currency: { type: "string", enum: ["INR"] },
                                value: { type: "number" }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    if: { properties: { settlementType: { const: "NP-NP" } } },
                    then: {
                      required: ["id", "inter_participant", "collector", "provider", "self"],
                      properties: {
                        id: { type: "string" },
                        inter_participant: {
                          required: ["amount"],
                          properties: {
                            amount: {
                              required: ["currency", "value"],
                              properties: {
                                currency: { type: "string", enum: ["INR"] },
                                value: { type: "number" }
                              }
                            }
                          }
                        },
                        collector: {
                          required: ["amount"],
                          properties: {
                            amount: {
                              required: ["currency", "value"],
                              properties: {
                                currency: { type: "string", enum: ["INR"] },
                                value: { type: "number" }
                              }
                            }
                          }
                        },
                        provider: {
                          required: ["id", "name", "bank_details", "amount"],
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            bank_details: {
                              required: ["account_no", "ifsc_code"],
                              properties: {
                                account_no: { type: "string" },
                                ifsc_code: { type: "string" }
                              }
                            },
                            amount: {
                              required: ["currency", "value"],
                              properties: {
                                currency: { type: "string", enum: ["INR"] },
                                value: { type: "number" }
                              }
                            }
                          }
                        },
                        self: {
                          required: ["amount"],
                          properties: {
                            amount: {
                              required: ["currency", "value"],
                              properties: {
                                currency: { type: "string", enum: ["INR"] },
                                value: { type: "number" }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          },
          additionalProperties: false
        }
      },
    },
  },  additionalProperties:false,
};

export default settleSchema;

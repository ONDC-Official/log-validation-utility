export const selectSchemaTRV_12  = {
  type: 'object',
  required: ['context', 'message'],
  properties: {
    context: {
      type: 'object',
      required: [
        'location',
        'domain',
        'timestamp',
        'bap_id',
        'transaction_id',
        'message_id',
        'version',
        'action',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'ttl',
      ],
      properties: {
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
                code: { type: 'string', pattern: '^std:\\d{3}$' },
              },
            },
          },
        },
        domain: { type: 'string', enum: ['ONDC:TRV12'] },
        timestamp: { type: 'string', format: 'date-time' },
        bap_id: { type: 'string' },
        transaction_id: { type: 'string', format: 'uuid' },
        message_id: { type: 'string', format: 'uuid' },
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        action: { type: 'string', enum: ['select'] },
        bap_uri: { type: 'string', format: 'uri' },
        bpp_id: { type: 'string' },
        bpp_uri: { type: 'string', format: 'uri' },
        ttl: { type: 'string', pattern: '^PT\\d+S$' },
      },
    },
    message: {
      type: 'object',
      required: ['order'],
      properties: {
        order: {
          type: 'object',
          required: ['provider', 'items', 'fulfillments'],
          properties: {
            provider: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' },
              },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  id: { type: 'string' },
                  parent_item_id: { type: 'string' },
                  quantity: {
                    type: 'object',
                    required: ['selected'],
                    properties: {
                      selected: {
                        type: 'object',
                        required: ['count'],
                        properties: {
                          count: { type: 'integer', minimum: 1 },
                        },
                      },
                    },
                  },
                  add_ons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'quantity'],
                      properties: {
                        id: { type: 'string' },
                        quantity: {
                          type: 'object',
                          required: ['selected'],
                          properties: {
                            selected: {
                              type: 'object',
                              required: ['count'],
                              properties: {
                                count: { type: 'integer', minimum: 1 },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            fulfillments: {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "stops": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        }
                      },
                      "required": ["id"]
                    }
                  },
                  "tags": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "descriptor": {
                          "type": "object",
                          "properties": {
                            "code": {
                              "type": "string",
                              "enum": ["INFO", "SEAT_GRID"]
                            },
                            "name": {
                              "type": "string"
                            }
                          },
                          "required": ["code"]
                        },
                        "display": {
                          "type": "boolean"
                        },
                        "list": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "descriptor": {
                                "type": "object",
                                "properties": {
                                  "code": {
                                    "type": "string"
                                  }
                                },
                                "required": ["code"]
                              },
                              "value": {
                                "type": "string"
                              }
                            },
                            "required": ["descriptor"]
                          }
                        }
                      },
                      "required": ["descriptor"]
                    }
                  },
                  "vehicle": {
                    "type": "object",
                    "properties": {
                      "category": {
                        "type": "string",
                        "enum": ["AIRLINE"]
                      },
                      "code": {
                        "type": "string"
                      }
                    },
                    "required": ["category", "code"]
                  }
                },
                "required": ["id"]
              }
            }
            ,
          },
        },
      },
    },
  },
};

export const onInitSchemaFIS10 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string" },
          "location": {
            "type": "object",
            "properties": {
              "city": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
              "country": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["on_init"] },
          "version": { "type": "string" },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp"]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "provider": { "type": "object", "properties": { "id": { "type": "string" } }, "required": ["id"] },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string" },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "contact": {
                            "type": "object",
                            "properties": {
                              "phone": { "type": "string" },
                              "email": { "type": "string", "format": "email" }
                            },
                            "required": ["phone", "email"]
                          },
                          "person": { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] }
                        },
                        "required": ["contact", "person"]
                      }
                    }
                  },
                  "required": ["id", "type", "stops"]
                }
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "price": {
                      "type": "object",
                      "properties": {
                        "currency": { "type": "string" },
                        "value": { "type": "string" },
                        "offered_value": { "type": "string" }
                      },
                      "required": ["currency", "value", "offered_value"]
                    },
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": { "type": "object", "properties": { "count": { "type": "integer" } }, "required": ["count"] }
                      },
                      "required": ["selected"]
                    },
                    "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                    "tags": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
                          "list": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
                                "value": { "type": "string" }
                              },
                              "required": ["descriptor", "value"]
                            }
                          }
                        },
                        "required": ["descriptor", "list"]
                      }
                    }
                  },
                  "required": ["id", "price", "quantity", "fulfillment_ids", "tags"]
                }
              }
            },
            "required": ["provider", "fulfillments", "items"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
  
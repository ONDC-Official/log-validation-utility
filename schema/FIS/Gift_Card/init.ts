export const InitSchemaFIS10 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string", "pattern": "^ONDC:FIS10$" },
          "location": {
            "type": "object",
            "properties": {
              "city": {
                "type": "object",
                "properties": { "code": { "type": "string" } },
                "required": ["code"]
              },
              "country": {
                "type": "object",
                "properties": { "code": { "type": "string" } },
                "required": ["code"]
              }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "pattern": "^init$" },
          "version": { "type": "string" },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string", "format": "uuid" },
          "message_id": { "type": "string", "format": "uuid" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ttl": { "type": "string" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp", "ttl"]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "provider": {
                "type": "object",
                "properties": { "id": { "type": "string" } },
                "required": ["id"]
              },
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
                              "phone": { "type": "string", "pattern": "^[0-9]{10}$" },
                              "email": { "type": "string", "format": "email" }
                            },
                            "required": ["phone", "email"]
                          },
                          "person": {
                            "type": "object",
                            "properties": { "name": { "type": "string" } },
                            "required": ["name"]
                          }
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
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": {
                          "type": "object",
                          "properties": { "count": { "type": "integer", "minimum": 1 } },
                          "required": ["count"]
                        }
                      },
                      "required": ["selected"]
                    },
                    "fulfillment_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    },
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
                  "required": ["id", "quantity", "fulfillment_ids", "tags"]
                }
              },
              "billing": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "address": { "type": "string" },
                  "city": {
                    "type": "object",
                    "properties": { "name": { "type": "string" }, "code": { "type": "string" } },
                    "required": ["name", "code"]
                  },
                  "state": {
                    "type": "object",
                    "properties": { "name": { "type": "string" }, "code": { "type": "string" } },
                    "required": ["name", "code"]
                  },
                  "email": { "type": "string", "format": "email" },
                  "phone": { "type": "string", "pattern": "^[0-9]{10}$" }
                },
                "required": ["name", "address", "city", "state", "email", "phone"]
              }
            },
            "required": ["provider", "fulfillments", "items", "billing"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
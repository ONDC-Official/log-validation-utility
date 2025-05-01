export const selectSchemaFIS10 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string", "enum": ["ONDC:FIS10"] },
          "location": {
            "type": "object",
            "properties": {
              "city": {
                "type": "object",
                "properties": {
                  "code": { "type": "string", "enum": ["std:080"] }
                },
                "required": ["code"]
              },
              "country": {
                "type": "object",
                "properties": {
                  "code": { "type": "string", "enum": ["IND"] }
                },
                "required": ["code"]
              }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["select"] },
          "version": { "type": "string", "enum": ["2.1.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string", "format": "uuid" },
          "message_id": { "type": "string", "format": "uuid" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ttl": { "type": "string" }
        },
        "required": [
          "domain",
          "location",
          "action",
          "version",
          "bap_id",
          "bap_uri",
          "bpp_id",
          "bpp_uri",
          "transaction_id",
          "message_id",
          "timestamp",
          "ttl"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "provider": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" }
                },
                "required": ["id"]
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "type": { "type": "string", "enum": ["BPP_ONLINE_EMAIL_SMS", "BPP_ONLINE_PORTAL", "BPP_ONLINE_OTHERS"] }
                  },
                  "required": ["type"]
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
                          "properties": {
                            "count": { "type": "integer", "minimum": 1 }
                          },
                          "required": ["count"]
                        }
                      },
                      "required": ["selected"]
                    },
                    "price": {
                      "type": "object",
                      "properties": {
                        "currency": { "type": "string", "enum": ["INR"] },
                        "offered_value": { "type": "string", "pattern": "^[0-9]+(\\.[0-9]{1,2})?$" }
                      },
                      "required": ["currency", "offered_value"]
                    }
                  },
                  "required": ["id", "quantity"]
                }
              },
              "offers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "item_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["id", "item_ids"]
                }
              }
            },
            "required": ["provider", "fulfillments", "items", "offers"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  };
  
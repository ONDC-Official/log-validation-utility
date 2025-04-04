export const onSearchSchemaFIS10 = {
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
              "city": { "type": "object", "properties": { "code": { "type": "string", "enum": ["std:080"] } }, "required": ["code"] },
              "country": { "type": "object", "properties": { "code": { "type": "string", "enum": ["IND"] } }, "required": ["code"] }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["on_search"] },
          "version": { "type": "string", "enum": ["2.1.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string", "format": "uuid" },
          "message_id": { "type": "string", "format": "uuid" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp"]
      },
      "message": {
        "type": "object",
        "properties": {
          "catalog": {
            "type": "object",
            "properties": {
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "type": {
                      "type": "string",
                      "enum": ["BPP_ONLINE_EMAIL_SMS", "BPP_ONLINE_EMAIL", "BPP_ONLINE_SMS", "BPP_OFFLINE", "BAP"]
                    }
                  },
                  "required": ["id", "type"]
                }
              },
              "descriptor": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "symbol": { "type": "string" },
                  "short_desc": { "type": "string" },
                  "long_desc": { "type": "string" },
                  "images": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "url": { "type": "string", "format": "uri" } }, "required": ["url"] }
                  }
                },
                "required": ["name", "symbol", "short_desc", "long_desc", "images"]
              },
              "providers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "ttl": { "type": "string" },
                    "time": {
                      "type": "object",
                      "properties": {
                        "label": { "type": "string", "enum": ["ENABLE", "VALID"] },
                        "timestamp": { "type": "string", "format": "date-time" }
                      },
                      "required": ["label", "timestamp"]
                    },
                    "categories": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string" },
                          "descriptor": {
                            "type": "object",
                            "properties": { "code": { "type": "string", "enum": ["CARD", "PROMO", "E_PAY", "E_RUPI"] } },
                            "required": ["code"]
                          }
                        },
                        "required": ["id", "descriptor"]
                      }
                    }
                  },
                  "required": ["id", "ttl", "categories"]
                }
              }
            },
            "required": ["fulfillments", "descriptor", "providers"]
          }
        },
        "required": ["catalog"]
      }
    },
    "required": ["context", "message"]
  }
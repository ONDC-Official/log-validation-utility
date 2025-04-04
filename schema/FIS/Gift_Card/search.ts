export const searchSchemaFIS10 = {
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
          "action": { "type": "string", "enum": ["on_search"] },
          "version": { "type": "string", "enum": ["2.1.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
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
          "transaction_id",
          "message_id",
          "timestamp",
          "ttl"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "intent": {
            "type": "object",
            "properties": {
              "category": {
                "type": "object",
                "properties": {
                  "descriptor": {
                    "type": "object",
                    "properties": {
                      "code": { "type": "string", "enum": ["CARD", "PROMO", "E_PAY", "E_RUPI"] }
                    },
                    "required": ["code"]
                  }
                },
                "required": ["descriptor"]
              },
              "payment": {
                "type": "object",
                "properties": {
                  "tags": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "descriptor": {
                          "type": "object",
                          "properties": {
                            "code": { "type": "string", "enum": ["BRAND_DETAILS", "VARIANT_FIELDS", "ITEM_DETAILS"] }
                          },
                          "required": ["code"]
                        },
                        "list": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "descriptor": {
                                "type": "object",
                                "properties": {
                                  "code": { "type": "string", "enum": ["BRAND_NAME", "OCCASION", "TERMS_CONDITION", "CATEGORY", "items.price.value"] }
                                },
                                "required": ["code"]
                              },
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
                "required": ["tags"]
              }
            },
            "required": ["category", "payment"]
          }
        },
        "required": ["intent"]
      }
    },
    "required": ["context", "message"]
  };
  
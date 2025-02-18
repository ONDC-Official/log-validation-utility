const updateSchemaTRV14 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "location": {
            "type": "object",
            "properties": {
              "country": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" }
                },
                "required": ["code"]
              },
              "city": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" }
                },
                "required": ["code"]
              }
            },
            "required": ["country", "city"]
          },
          "domain": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "bap_id": { "type": "string" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "version": { "type": "string" },
          "action": { "type": "string", "enum": ["update"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "ttl": { "type": "string" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" }
        },
        "required": [
          "location", "domain", "timestamp", "bap_id", "transaction_id", "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "update_target": { "type": "string" },
          "order": {
            "type": "object",
            "properties": {
              "cancellation": {
                "type": "object",
                "properties": {
                  "reason": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string" },
                      "descriptor": {
                        "type": "object",
                        "properties": {
                          "code": { "type": "string" }
                        },
                        "required": ["code"]
                      }
                    },
                    "required": ["id", "descriptor"]
                  }
                },
                "required": ["reason"]
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
                            "count": { "type": "integer", "minimum": 0 }
                          },
                          "required": ["count"]
                        }
                      },
                      "required": ["selected"]
                    }
                  },
                  "required": ["id", "quantity"]
                }
              }
            },
            "required": ["cancellation", "items"]
          }
        },
        "required": ["update_target", "order"]
      }
    },
    "required": ["context", "message"]
  }
  export default updateSchemaTRV14;
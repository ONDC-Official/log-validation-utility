export const cancelSchemaSRV19 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string", "enum": ["ONDC:SRV19"] },
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
          "action": { "type": "string", "enum": ["cancel"] },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ttl": { "type": "string" }
        },
        "required": [
          "domain", "location", "action", "version", "bap_id", "bap_uri", 
          "transaction_id", "message_id", "timestamp", "ttl"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "order_id": { "type": "string" },
          "cancellation_reason_id": { "type": "string" }
        },
        "required": ["order_id", "cancellation_reason_id"]
      }
    },
    "required": ["context", "message"]
}
  
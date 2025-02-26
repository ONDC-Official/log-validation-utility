const onUpdateSchemaTRV14 = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "location": {
            "type": "object",
            "properties": {
              "country": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
              "city": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] }
            },
            "required": ["country", "city"]
          },
          "domain": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "bap_id": { "type": "string" },
          "transaction_id": { "type": "string", "format": "uuid" },
          "message_id": { "type": "string", "format": "uuid" },
          "version": { "type": "string" },
          "action": { "type": "string", "enum": ["on_update"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "ttl": { "type": "string" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" }
        },
        "required": ["domain", "timestamp", "bap_id", "transaction_id", "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string" },
              "items": { "type": "array", "items": { "type": "object" } },
              "fulfillments": { "type": "array", "items": { "type": "object" } },
              "provider": { "type": "object" },
              "cancellation_terms": { "type": "array", "items": { "type": "object" } },
              "replacement_terms": { "type": "array", "items": { "type": "object" } },
              "billing": { "type": "object" },
              "quote": { "type": "object" },
              "payments": { "type": "array", "items": { "type": "object" } },
              "tags": { "type": "array", "items": { "type": "object" } },
              "created_at": { "type": "string", "format": "date-time" },
              "updated_at": { "type": "string", "format": "date-time" }
            },
            "required": ["id", "status", "items", "fulfillments", "provider", "quote", "created_at", "updated_at"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
export default onUpdateSchemaTRV14  

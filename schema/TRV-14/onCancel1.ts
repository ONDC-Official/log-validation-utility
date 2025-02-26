const onCancel1SchemaTRV14 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": [
          "location", "domain", "timestamp", "bap_id", "transaction_id",
          "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"
        ],
        "properties": {
          "location": {
            "type": "object",
            "required": ["country", "city"],
            "properties": {
              "country": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string", "enum": ["IND"] }
                }
              },
              "city": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string" }
                }
              }
            }
          },
          "domain": { "type": "string", "enum": ["ONDC:TRV14"] },
          "timestamp": { "type": "string", "format": "date-time" },
          "bap_id": { "type": "string" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "action": { "type": "string", "enum": ["on_cancel_1"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "ttl": { "type": "string", "pattern": "^PT\\d+S$" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" }
        }
      },
      "message": {
        "type": "object",
        "required": ["order"],
        "properties": {
          "order": {
            "type": "object",
            "required": ["id", "status", "items", "fulfillments", "provider", "quote", "payments"],
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string" },
              "items": { "type": "array", "items": { "type": "object" } },
              "fulfillments": { "type": "array", "items": { "type": "object" } },
              "provider": { "type": "object" },
              "quote": { "type": "object" },
              "payments": { "type": "array", "items": { "type": "object" } }
            }
          }
        }
      }
    }
  }
  export default onCancel1SchemaTRV14

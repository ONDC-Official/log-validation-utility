export const statusSchemaSRV19 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp", "ttl"],
        "properties": {
          "domain": { "type": "string", "enum": ["ONDC:SRV19"] },
          "location": {
            "type": "object",
            "required": ["city", "country"],
            "properties": {
              "city": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string" }
                }
              },
              "country": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string", "enum": ["IND"] }
                }
              }
            }
          },
          "action": { "type": "string", "enum": ["status"] },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ttl": { "type": "string" }
        }
      },
      "message": {
        "type": "object",
        "required": ["order_id"],
        "properties": {
          "order_id": { "type": "string" }
        }
      }
    }
  };
  
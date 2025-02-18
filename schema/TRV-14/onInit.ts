const onInitSchemaTRV14 = 
{
  "$schema": "http://json-schema.org/draft-07/schema#",
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
            "country": { "type": "object", "required": ["code"], "properties": { "code": { "type": "string" } } },
            "city": { "type": "object", "required": ["code"], "properties": { "code": { "type": "string" } } }
          }
        },
        "domain": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "bap_id": { "type": "string" },
        "transaction_id": { "type": "string" },
        "message_id": { "type": "string" },
        "version": { "type": "string" },
        "action": { "type": "string" },
        "bap_uri": { "type": "string", "format": "uri" },
        "ttl": { "type": "string" },
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
          "required": ["items", "fulfillments", "provider", "quote", "billing", "payments", "tags"],
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" },
                  "descriptor": { "type": "object" },
                  "parent_item_id": { "type": "string" },
                  "location_ids": { "type": "array", "items": { "type": "string" } },
                  "category_ids": { "type": "array", "items": { "type": "string" } },
                  "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } } },
                  "quantity": { "type": "object" },
                  "time": { "type": "object" },
                  "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                  "add_ons": { "type": "array", "items": { "type": "object" } },
                  "tags": { "type": "array", "items": { "type": "object" } }
                }
              }
            },
            "fulfillments": { "type": "array", "items": { "type": "object" } },
            "provider": { "type": "object" },
            "quote": { "type": "object" },
            "billing": { "type": "object" },
            "payments": { "type": "array", "items": { "type": "object" } },
            "tags": { "type": "array", "items": { "type": "object" } }
          }
        }
      }
    }
  }
}

  export default onInitSchemaTRV14

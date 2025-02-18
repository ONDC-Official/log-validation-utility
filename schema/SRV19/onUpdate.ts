export const onUpdateSchemaSRV19 = {
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
              "city": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
              "country": { "type": "object", "properties": { "code": { "type": "string", "enum": ["IND"] } }, "required": ["code"] }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["on_update"] },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp"]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string" },
              "provider": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" },
                  "locations": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "id": { "type": "string" } }, "required": ["id"] }
                  }
                },
                "required": ["id", "locations"]
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "location_ids": { "type": "array", "items": { "type": "string" } },
                    "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": { "type": "object", "properties": { "count": { "type": "integer" } }, "required": ["count"] }
                      },
                      "required": ["selected"]
                    }
                  },
                  "required": ["id", "location_ids", "fulfillment_ids", "quantity"]
                }
              },
              "billing": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "address": { "type": "string" },
                  "state": { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] },
                  "city": { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] },
                  "tax_id": { "type": "string" },
                  "email": { "type": "string", "format": "email" },
                  "phone": { "type": "string" }
                },
                "required": ["name", "address", "state", "city", "tax_id", "email", "phone"]
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string" },
                    "state": {
                      "type": "object",
                      "properties": {
                        "descriptor": {
                          "type": "object",
                          "properties": { "code": { "type": "string" } },
                          "required": ["code"]
                        }
                      },
                      "required": ["descriptor"]
                    }
                  },
                  "required": ["id", "type", "state"]
                }
              }
            },
            "required": ["id", "status", "provider", "items", "billing", "fulfillments"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
  
export const selectSchemaTRV12BUS = {
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
          "bap_uri": { "type": "string" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "version": { "type": "string" },
          "action": { "type": "string", "enum": ["select"] },
          "ttl": { "type": "string" }
        },
        "required": [
          "location",
          "domain",
          "timestamp",
          "bap_id",
          "bap_uri",
          "bpp_id",
          "bpp_uri",
          "transaction_id",
          "message_id",
          "version",
          "action",
          "ttl"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
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
                            "count": { "type": "integer" }
                          },
                          "required": ["count"]
                        }
                      },
                      "required": ["selected"]
                    }
                  },
                  "required": ["id", "quantity"]
                }
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string" },
                          "type": { "type": "string" }
                        },
                        "required": ["id", "type"]
                      }
                    }
                  },
                  "required": ["id", "stops"]
                }
              },
              "provider": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" }
                },
                "required": ["id"]
              }
            },
            "required": ["items", "fulfillments", "provider"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
  
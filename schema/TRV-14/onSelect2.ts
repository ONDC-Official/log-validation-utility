const onSelect2SchemaTRV14 = {
  "$schema": "http://json-schema.org/draft-07/schema#",
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
        "transaction_id": { "type": "string" },
        "message_id": { "type": "string" },
        "version": { "type": "string" },
        "action": { "type": "string" },
        "bap_uri": { "type": "string" },
        "ttl": { "type": "string" },
        "bpp_id": { "type": "string" },
        "bpp_uri": { "type": "string" }
      },
      "required": ["location", "domain", "timestamp", "bap_id", "transaction_id", "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"]
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
                  "descriptor": {
                    "type": "object",
                    "properties": {
                      "name": { "type": "string" },
                      "code": { "type": "string" },
                      "short_desc": { "type": "string" },
                      "long_desc": { "type": "string" },
                      "images": {
                        "type": "array",
                        "items": { "type": "object", "properties": { "url": { "type": "string" }, "size_type": { "type": "string" } }, "required": ["url", "size_type"] }
                      }
                    },
                    "required": ["name", "code", "short_desc", "long_desc", "images"]
                  },
                  "location_ids": { "type": "array", "items": { "type": "string" } },
                  "category_ids": { "type": "array", "items": { "type": "string" } },
                  "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } }, "required": ["currency", "value"] },
                  "quantity": { "type": "object", "properties": { "selected": { "type": "object", "properties": { "count": { "type": "integer" } }, "required": ["count"] } }, "required": ["selected"] },
                  "time": { "type": "object", "properties": { "label": { "type": "string" }, "duration": { "type": "string" } }, "required": ["label", "duration"] },
                  "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                  "add_ons": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string" }, "descriptor": { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] }, "quantity": { "type": "object", "properties": { "selected": { "type": "object", "properties": { "count": { "type": "integer" } }, "required": ["count"] } }, "required": ["selected"] }, "price": { "type": "object", "properties": { "value": { "type": "string" }, "currency": { "type": "string" } }, "required": ["value", "currency"] } }, "required": ["id", "descriptor", "quantity", "price"] } },
                  "tags": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] }, "list": { "type": "array", "items": { "type": "object", "properties": { "value": { "type": "string" } }, "required": ["value"] } } }, "required": ["descriptor", "list"] }
                  }
                },
                "required": ["id", "descriptor", "location_ids", "category_ids", "price", "quantity", "time", "fulfillment_ids", "tags"]
              }
            },
            "quote": {
              "type": "object",
              "properties": {
                "breakup": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "title": { "type": "string" },
                      "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } }, "required": ["currency", "value"] }
                    },
                    "required": ["title", "price"]
                  }
                },
                "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } }, "required": ["currency", "value"] }
              },
              "required": ["breakup", "price"]
            }
          },
          "required": ["items", "quote"]
        }
      },
      "required": ["order"]
    }
  },
  "required": ["context", "message"]
}

export default onSelect2SchemaTRV14

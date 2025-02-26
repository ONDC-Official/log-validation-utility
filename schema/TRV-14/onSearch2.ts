const onSearch2SchemaTRV14 = {
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
          "action": { "type": "string", "enum": ["on_search_2"] },
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
          "catalog": {
            "type": "object",
            "properties": {
              "descriptor": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "long_desc": { "type": "string" },
                  "images": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "url": { "type": "string" }, "size_type": { "type": "string" } }, "required": ["url", "size_type"] }
                  }
                },
                "required": ["name", "long_desc", "images"]
              },
              "providers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "descriptor": {
                      "type": "object",
                      "properties": {
                        "name": { "type": "string" },
                        "short_desc": { "type": "string" },
                        "images": {
                          "type": "array",
                          "items": { "type": "object", "properties": { "url": { "type": "string" }, "size_type": { "type": "string" } }, "required": ["url", "size_type"] }
                        }
                      },
                      "required": ["name", "short_desc", "images"]
                    },
                    "categories": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "descriptor": { "type": "object", "properties": { "name": { "type": "string" }, "code": { "type": "string" } }, "required": ["name"] },
                          "id": { "type": "string" },
                          "parent_category_id": { "type": "string" }
                        },
                        "required": ["descriptor", "id"]
                      }
                    },
                    "locations": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string" },
                          "gps": { "type": "string" },
                          "descriptor": {
                            "type": "object",
                            "properties": {
                              "name": { "type": "string" },
                              "short_desc": { "type": "string" },
                              "images": { "type": "array", "items": { "type": "object", "properties": { "url": { "type": "string" }, "size_type": { "type": "string" } }, "required": ["url", "size_type"] } }
                            },
                            "required": ["name", "short_desc", "images"]
                          }
                        },
                        "required": ["id", "gps", "descriptor"]
                      }
                    }
                  },
                  "required": ["id", "descriptor", "categories", "locations"]
                }
              }
            },
            "required": ["descriptor", "providers"]
          }
        },
        "required": ["catalog"]
      }
    },
    "required": ["context", "message"]
  }

export default onSearch2SchemaTRV14

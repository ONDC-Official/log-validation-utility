const onSearch1SchemaTRV14 = {
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
            "country": { "type": "object", "required": ["code"], "properties": { "code": { "type": "string", "enum": ["IND"] } } },
            "city": { "type": "object", "required": ["code"], "properties": { "code": { "type": "string" } } }
          }
        },
        "domain": { "type": "string", "enum": ["ONDC:TRV14"] },
        "timestamp": { "type": "string", "format": "date-time" },
        "bap_id": { "type": "string" },
        "transaction_id": { "type": "string" },
        "message_id": { "type": "string" },
        "version": { "type": "string", "enum": ["2.0.0"] },
        "action": { "type": "string", "enum": ["on_search_1"] },
        "bap_uri": { "type": "string", "format": "uri" },
        "ttl": { "type": "string", "pattern": "^PT\\d+S$" },
        "bpp_id": { "type": "string" },
        "bpp_uri": { "type": "string", "format": "uri" }
      }
    },
    "message": {
      "type": "object",
      "required": ["catalog"],
      "properties": {
        "catalog": {
          "type": "object",
          "required": ["descriptor", "providers", "tags"],
          "properties": {
            "descriptor": {
              "type": "object",
              "required": ["name", "long_desc", "images"],
              "properties": {
                "name": { "type": "string" },
                "long_desc": { "type": "string" },
                "images": {
                  "type": "array",
                  "items": { "type": "object", "required": ["url", "size_type"], "properties": { "url": { "type": "string", "format": "uri" }, "size_type": { "type": "string" } } }
                }
              }
            },
            "providers": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["id", "descriptor", "categories", "time", "locations", "payments"],
                "properties": {
                  "id": { "type": "string" },
                  "descriptor": {
                    "type": "object",
                    "required": ["name", "short_desc", "images"],
                    "properties": {
                      "name": { "type": "string" },
                      "short_desc": { "type": "string" },
                      "images": { "type": "array", "items": { "type": "object", "required": ["url", "size_type"], "properties": { "url": { "type": "string", "format": "uri" }, "size_type": { "type": "string" } } } }
                    }
                  },
                  "categories": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["id", "descriptor"],
                      "properties": {
                        "id": { "type": "string" },
                        "descriptor": {
                          "type": "object",
                          "required": ["name"],
                          "properties": {
                            "name": { "type": "string" },
                            "code": { "type": "string" }
                          }
                        },
                        "parent_category_id": { "type": "string" }
                      }
                    }
                  },
                  "time": { "type": "object", "required": ["range"], "properties": { "range": { "type": "object", "required": ["start", "end"], "properties": { "start": { "type": "string", "format": "date-time" }, "end": { "type": "string", "format": "date-time" } } } } },
                  "locations": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["id", "gps", "descriptor", "rating"],
                      "properties": {
                        "id": { "type": "string" },
                        "gps": { "type": "string" },
                        "descriptor": {
                          "type": "object",
                          "required": ["name", "short_desc", "images", "additional_desc"],
                          "properties": {
                            "name": { "type": "string" },
                            "short_desc": { "type": "string" },
                            "additional_desc": { "type": "object", "required": ["url", "content_type"], "properties": { "url": { "type": "string", "format": "uri" }, "content_type": { "type": "string" } } },
                            "images": { "type": "array", "items": { "type": "object", "required": ["url", "size_type"], "properties": { "url": { "type": "string", "format": "uri" }, "size_type": { "type": "string" } } } }
                          }
                        },
                        "rating": { "type": "string" }
                      }
                    }
                  },
                  "payments": { "type": "array", "items": { "type": "object", "required": ["collected_by"], "properties": { "collected_by": { "type": "string" } } } }
                }
              }
            },
            "tags": { "type": "array" }
          }
        }
      }
    }
  },
  "additionalProperties": false
}
  

  export default onSearch1SchemaTRV14
export const onSearchSchemaSRV19 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": [
          "location", "domain", "timestamp", "bap_id", "transaction_id", 
          "message_id", "version", "action", "bap_uri", "bpp_id", "bpp_uri"
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
          "domain": { "type": "string", "enum": ["ONDC:SRV19"] },
          "timestamp": { "type": "string", "format": "date-time" },
          "bap_id": { "type": "string" },
          "bpp_id": { "type": "string" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "action": { "type": "string", "enum": ["on_search"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_uri": { "type": "string", "format": "uri" }
        }
      },
      "message": {
        "type": "object",
        "required": ["catalog"],
        "properties": {
          "catalog": {
            "type": "object",
            "required": ["fulfillments", "payments", "descriptor", "providers"],
            "properties": {
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "type"],
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string" }
                  }
                }
              },
              "payments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "type"],
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string" }
                  }
                }
              },
              "descriptor": {
                "type": "object",
                "required": ["name", "short_desc", "long_desc", "images"],
                "properties": {
                  "name": { "type": "string" },
                  "short_desc": { "type": "string" },
                  "long_desc": { "type": "string" },
                  "images": {
                    "type": "array",
                    "items": { "type": "object", "properties": { "url": { "type": "string", "format": "uri" } } }
                  }
                }
              },
              "providers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "descriptor", "locations", "items"],
                  "properties": {
                    "id": { "type": "string" },
                    "descriptor": {
                      "type": "object",
                      "required": ["name", "code", "short_desc", "long_desc", "images"],
                      "properties": {
                        "name": { "type": "string" },
                        "code": { "type": "string" },
                        "short_desc": { "type": "string" },
                        "long_desc": { "type": "string" },
                        "images": {
                          "type": "array",
                          "items": { "type": "object", "properties": { "url": { "type": "string", "format": "uri" } } }
                        }
                      }
                    },
                    "locations": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["id", "gps", "address", "city", "state", "country"],
                        "properties": {
                          "id": { "type": "string" },
                          "gps": { "type": "string" },
                          "address": { "type": "string" },
                          "city": { "type": "object", "properties": { "code": { "type": "string" }, "name": { "type": "string" } } },
                          "state": { "type": "object", "properties": { "code": { "type": "string" } } },
                          "country": { "type": "object", "properties": { "code": { "type": "string" } } }
                        }
                      }
                    },
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["id", "descriptor", "price", "quantity"],
                        "properties": {
                          "id": { "type": "string" },
                          "descriptor": {
                            "type": "object",
                            "required": ["name", "code", "short_desc", "long_desc"],
                            "properties": {
                              "name": { "type": "string" },
                              "code": { "type": "string" },
                              "short_desc": { "type": "string" },
                              "long_desc": { "type": "string" }
                            }
                          },
                          "price": {
                            "type": "object",
                            "required": ["currency", "value"],
                            "properties": {
                              "currency": { "type": "string" },
                              "value": { "type": "string" }
                            }
                          },
                          "quantity": {
                            "type": "object",
                            "properties": {
                              "unitized": { "type": "object", "properties": { "measure": { "type": "object", "properties": { "unit": { "type": "string" }, "value": { "type": "string" } } } } }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "additionalProperties": false
  }
  
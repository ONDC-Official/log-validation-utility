export const initSchemaSRV19 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": [
          "location", "domain", "timestamp", "bap_id", "transaction_id",
          "message_id", "version", "action", "bap_uri", "bpp_id", "bpp_uri", "ttl"
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
          "action": { "type": "string", "enum": ["init"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "ttl": { "type": "string" }
        }
      },
      "message": {
        "type": "object",
        "required": ["order"],
        "properties": {
          "order": {
            "type": "object",
            "required": ["provider", "items", "fulfillments", "payments", "billing"],
            "properties": {
              "provider": {
                "type": "object",
                "required": ["id", "locations"],
                "properties": {
                  "id": { "type": "string" },
                  "locations": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["id"],
                      "properties": {
                        "id": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "location_ids", "fulfillment_ids", "quantity"],
                  "properties": {
                    "id": { "type": "string" },
                    "location_ids": { "type": "array", "items": { "type": "string" } },
                    "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                    "quantity": {
                      "type": "object",
                      "required": ["selected"],
                      "properties": {
                        "selected": {
                          "type": "object",
                          "required": ["count"],
                          "properties": {
                            "count": { "type": "integer", "minimum": 1 }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "billing": {
                "type": "object",
                "required": ["name", "address", "state", "city", "tax_id", "email", "phone"],
                "properties": {
                  "name": { "type": "string" },
                  "address": { "type": "string" },
                  "state": { "type": "object", "properties": { "name": { "type": "string" } } },
                  "city": { "type": "object", "properties": { "name": { "type": "string" } } },
                  "tax_id": { "type": "string" },
                  "email": { "type": "string" },
                  "phone": { "type": "string" }
                }
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "type", "stops"],
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string" },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["type", "time", "location"],
                        "properties": {
                          "type": { "type": "string" },
                          "time": {
                            "type": "object",
                            "required": ["label", "range", "days"],
                            "properties": {
                              "label": { "type": "string" },
                              "range": {
                                "type": "object",
                                "required": ["start", "end"],
                                "properties": {
                                  "start": { "type": "string", "format": "date-time" },
                                  "end": { "type": "string", "format": "date-time" }
                                }
                              },
                              "days": { "type": "string" }
                            }
                          },
                          "location": {
                            "type": "object",
                            "required": ["gps", "area_code"],
                            "properties": {
                              "gps": { "type": "string" },
                              "area_code": { "type": "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "payments": {
                "type": "array",
                "items": { "type": "object", "required": ["type", "collected_by"] }
              }
            }
          }
        }
      }
    },
    "additionalProperties": false
  }
  
const select2SchemaTRV14 = {
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
          "action": { "type": "string", "enum": ["select_2"] },
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
            "required": ["items", "fulfillments", "provider"],
            "properties": {
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "parent_item_id", "quantity"],
                  "properties": {
                    "id": { "type": "string" },
                    "parent_item_id": { "type": "string" },
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
                    },
                    "add_ons": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["id", "quantity"],
                        "properties": {
                          "id": { "type": "string" },
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
                    "xinput": {
                      "type": "object",
                      "required": ["form", "form_response"],
                      "properties": {
                        "form": {
                          "type": "object",
                          "required": ["id"],
                          "properties": {
                            "id": { "type": "string" }
                          }
                        },
                        "form_response": {
                          "type": "object",
                          "required": ["status", "submission_id"],
                          "properties": {
                            "status": { "type": "string", "enum": ["SUCCESS"] },
                            "submission_id": { "type": "string" }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "stops"],
                  "properties": {
                    "id": { "type": "string" },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["type", "time"],
                        "properties": {
                          "type": { "type": "string" },
                          "time": {
                            "type": "object",
                            "required": ["timestamp"],
                            "properties": {
                              "timestamp": { "type": "string", "format": "date-time" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "provider": {
                "type": "object",
                "required": ["id"],
                "properties": {
                  "id": { "type": "string" }
                }
              }
            }
          }
        }
      }
    },
    "additionalProperties": false
  }
export default select2SchemaTRV14  
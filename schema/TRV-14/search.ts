const searchSchemaTRV14 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": [
          "location",
          "domain",
          "timestamp",
          "bap_id",
          "transaction_id",
          "message_id",
          "version",
          "action",
          "bap_uri",
          "ttl"
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
          "action": { "type": "string", "enum": ["search"] },
          "bap_uri": { "type": "string", "format": "uri" },
          "ttl": { "type": "string", "pattern": "^PT\\d+S$" }
        }
      },
      "message": {
        "type": "object",
        "required": ["intent"],
        "properties": {
          "intent": {
            "type": "object",
            "required": ["category", "fulfillment", "payment", "tags"],
            "properties": {
              "category": {
                "type": "object",
                "required": ["descriptor"],
                "properties": {
                  "descriptor": {
                    "type": "object",
                    "required": ["code"],
                    "properties": {
                      "code": { "type": "string", "enum": ["CULTURE_HERITAGE"] }
                    }
                  }
                }
              },
              "fulfillment": {
                "type": "object",
                "required": ["stops", "vehicle"],
                "properties": {
                  "stops": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["type", "location", "time"],
                      "properties": {
                        "type": { "type": "string", "enum": ["START"] },
                        "location": {
                          "type": "object",
                          "required": ["city"],
                          "properties": {
                            "city": {
                              "type": "object",
                              "required": ["code"],
                              "properties": {
                                "code": { "type": "string" }
                              }
                            }
                          }
                        },
                        "time": {
                          "type": "object",
                          "required": ["timestamp"],
                          "properties": {
                            "timestamp": { "type": "string", "format": "date-time" }
                          }
                        }
                      }
                    }
                  },
                  "vehicle": {
                    "type": "object",
                    "required": ["category"],
                    "properties": {
                      "category": { "type": "string", "enum": ["SITE"] }
                    }
                  }
                }
              },
              "payment": {
                "type": "object",
                "required": ["collected_by"],
                "properties": {
                  "collected_by": { "type": "string", "enum": ["BAP"] }
                }
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["descriptor", "display", "list"],
                  "properties": {
                    "descriptor": {
                      "type": "object",
                      "required": ["code", "name"],
                      "properties": {
                        "code": { "type": "string", "enum": ["BAP_TERMS"] },
                        "name": { "type": "string", "enum": ["BAP Terms of Engagement"] }
                      }
                    },
                    "display": { "type": "boolean" },
                    "list": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["descriptor", "value"],
                        "properties": {
                          "descriptor": {
                            "type": "object",
                            "required": ["code"],
                            "properties": {
                              "code": { "type": "string" }
                            }
                          },
                          "value": { "type": "string" }
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

  export default searchSchemaTRV14;
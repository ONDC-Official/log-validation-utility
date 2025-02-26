export const searchSchemaSRV19 =  {
  "type": "object",
  "required": ["context", "message"],
  "properties": {
    "context": {
      "type": "object",
      "required": [
        "location", "domain", "timestamp", "bap_id", "transaction_id", 
        "message_id", "version", "action", "bap_uri", "ttl"
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
          "required": ["tags"],
          "properties": {
            "tags": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["descriptor", "display", "list"],
                "properties": {
                  "descriptor": {
                    "type": "object",
                    "required": ["code"],
                    "properties": {
                      "code": { "type": "string", "enum": ["BAP_TERMS"] }
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
                            "code": {
                              "type": "string",
                              "enum": ["FINDER_FEE_TYPE", "FINDER_FEE_AMOUNT"]
                            }
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

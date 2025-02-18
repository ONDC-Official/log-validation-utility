export const updateSchemaSRV19 = {
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
          "action": { "type": "string", "enum": ["update"] },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ttl": { "type": "string" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp"]
      },
      "message": {
        "type": "object",
        "properties": {
          "update_target": { "type": "string", "enum": ["fulfillments"] },
          "order": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string", "enum": ["Cancelled", "In-Progress", "Completed"] },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string", "enum": ["Buyer-Fulfilled"] },
                    "state": {
                      "type": "object",
                      "properties": {
                        "descriptor": {
                          "type": "object",
                          "properties": { "code": { "type": "string", "enum": ["Pending"] } },
                          "required": ["code"]
                        }
                      },
                      "required": ["descriptor"]
                    },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "type": { "type": "string", "enum": ["end"] },
                          "time": {
                            "type": "object",
                            "properties": {
                              "label": { "type": "string", "enum": ["selection"] },
                              "range": {
                                "type": "object",
                                "properties": {
                                  "start": { "type": "string", "format": "date-time" },
                                  "end": { "type": "string", "format": "date-time" }
                                },
                                "required": ["start", "end"]
                              },
                              "days": { "type": "string" }
                            },
                            "required": ["label", "range"]
                          },
                          "contact": { "type": "object", "properties": { "phone": { "type": "string" } }, "required": ["phone"] },
                          "location": {
                            "type": "object",
                            "properties": {
                              "gps": { "type": "string" },
                              "area_code": { "type": "string" }
                            },
                            "required": ["gps", "area_code"]
                          },
                          "instructions": {
                            "type": "object",
                            "properties": {
                              "name": { "type": "string" },
                              "short_desc": { "type": "string" }
                            },
                            "required": ["name", "short_desc"]
                          }
                        },
                        "required": ["type", "time", "contact", "location", "instructions"]
                      }
                    },
                    "customer": {
                      "type": "object",
                      "properties": {
                        "person": {
                          "type": "object",
                          "properties": { "name": { "type": "string" } },
                          "required": ["name"]
                        }
                      },
                      "required": ["person"]
                    }
                  },
                  "required": ["id", "type", "state", "stops", "customer"]
                }
              },
              "created_at": { "type": "string", "format": "date-time" },
              "updated_at": { "type": "string", "format": "date-time" }
            },
            "required": ["id", "status", "fulfillments", "created_at", "updated_at"]
          }
        },
        "required": ["update_target", "order"]
      }
    },
    "required": ["context", "message"]
  }
  
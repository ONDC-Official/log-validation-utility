export const onUpdateFIS10 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string" },
          "location": {
            "type": "object",
            "properties": {
              "city": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
              "country": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["on_update"] },
          "version": { "type": "string" },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp"]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string" },
              "provider": { "type": "object", "properties": { "id": { "type": "string" } }, "required": ["id"] },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "price": {
                      "type": "object",
                      "properties": {
                        "currency": { "type": "string" },
                        "value": { "type": "string" },
                        "offered_value": { "type": "string" }
                      },
                      "required": ["currency", "value", "offered_value"]
                    },
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": { "type": "object", "properties": { "count": { "type": "integer" } }, "required": ["count"] }
                      },
                      "required": ["selected"]
                    },
                    "fulfillment_ids": { "type": "array", "items": { "type": "string" } },
                    "tags": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
                          "list": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] },
                                "value": { "type": "string" }
                              },
                              "required": ["descriptor", "value"]
                            }
                          }
                        },
                        "required": ["descriptor", "list"]
                      }
                    }
                  },
                  "required": ["id", "price", "quantity", "fulfillment_ids"]
                }
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "state": {
                      "type": "object",
                      "properties": {
                        "descriptor": { "type": "object", "properties": { "code": { "type": "string" } }, "required": ["code"] }
                      },
                      "required": ["descriptor"]
                    },
                    "type": { "type": "string" },
                    "stops": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "contact": {
                            "type": "object",
                            "properties": {
                              "phone": { "type": "string" },
                              "email": { "type": "string", "format": "email" }
                            },
                            "required": ["phone", "email"]
                          },
                          "person": { "type": "object", "properties": { "name": { "type": "string" } }, "required": ["name"] },
                          "authorization": {
                            "type": "object",
                            "properties": {
                              "type": { "type": "string", "enum": ["CODE", "CODE_PIN"] },
                              "token": { "type": "string" }
                            },
                            "required": ["type", "token"]
                          }
                        },
                        "required": ["contact", "person", "authorization"]
                      }
                    }
                  },
                  "required": ["id", "state", "type", "stops"]
                }
              },
              "billing": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "address": { "type": "string" },
                  "city": { "type": "object", "properties": { "name": { "type": "string" }, "code": { "type": "string" } }, "required": ["name", "code"] },
                  "state": { "type": "object", "properties": { "name": { "type": "string" }, "code": { "type": "string" } }, "required": ["name", "code"] },
                  "email": { "type": "string", "format": "email" },
                  "phone": { "type": "string" }
                },
                "required": ["name", "address", "city", "state", "email", "phone"]
              },
              "quote": {
                "type": "object",
                "properties": {
                  "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } }, "required": ["currency", "value"] },
                  "breakup": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "item": { "type": "object", "properties": { "id": { "type": "string" } }, "required": ["id"] },
                        "title": { "type": "string" },
                        "price": { "type": "object", "properties": { "currency": { "type": "string" }, "value": { "type": "string" } }, "required": ["currency", "value"] }
                      },
                      "required": ["item", "title", "price"]
                    }
                  },
                  "ttl": { "type": "string" }
                },
                "required": ["price", "breakup", "ttl"]
              }
            },
            "required": ["id", "status", "provider", "items", "fulfillments", "billing", "quote"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  }
  
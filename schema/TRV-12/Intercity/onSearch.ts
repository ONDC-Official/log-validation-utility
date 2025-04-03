export const onSearchSchemaTRV12BUS = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "location": {
            "type": "object",
            "properties": {
              "country": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" }
                },
                "required": ["code"]
              },
              "city": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" }
                },
                "required": ["code"]
              }
            },
            "required": ["country", "city"]
          },
          "domain": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "version": { "type": "string" },
          "action": { "type": "string", "enum": ["on_search"] },
          "ttl": { "type": "string" }
        },
        "required": [
          "location",
          "domain",
          "timestamp",
          "bap_id",
          "bap_uri",
          "bpp_id",
          "bpp_uri",
          "transaction_id",
          "message_id",
          "version",
          "action",
          "ttl"
        ]
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
                  "images": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "url": { "type": "string" }
                      },
                      "required": ["url"]
                    }
                  }
                },
                "required": ["name", "images"]
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
                        "images": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "url": { "type": "string" }
                            },
                            "required": ["url"]
                          }
                        }
                      },
                      "required": ["name", "images"]
                    },
                    "fulfillments": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string" },
                          "type": { "type": "string" },
                          "stops": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "type": { "type": "string" },
                                "location": {
                                  "type": "object",
                                  "properties": {
                                    "descriptor": {
                                      "type": "object",
                                      "properties": {
                                        "name": { "type": "string" },
                                        "code": { "type": "string" }
                                      },
                                      "required": ["name", "code"]
                                    },
                                    "gps": { "type": "string" }
                                  },
                                  "required": ["descriptor", "gps"]
                                }
                              },
                              "required": ["type", "location"]
                            }
                          },
                          "vehicle": {
                            "type": "object",
                            "properties": {
                              "category": { "type": "string" },
                              "variant": { "type": "string" },
                              "capacity": { "type": "integer" },
                              "wheels_count": { "type": "string" },
                              "energy_type": { "type": "string" }
                            },
                            "required": ["category", "variant", "capacity", "wheels_count", "energy_type"]
                          }
                        },
                        "required": ["id", "type", "stops", "vehicle"]
                      }
                    },
                    "payments": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "collected_by": { "type": "string" },
                          "tags": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "descriptor": {
                                  "type": "object",
                                  "properties": {
                                    "code": { "type": "string" }
                                  },
                                  "required": ["code"]
                                },
                                "display": { "type": "boolean" },
                                "list": {
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "descriptor": {
                                        "type": "object",
                                        "properties": {
                                          "code": { "type": "string" }
                                        },
                                        "required": ["code"]
                                      },
                                      "value": { "type": "string" }
                                    },
                                    "required": ["descriptor", "value"]
                                  }
                                }
                              },
                              "required": ["descriptor", "display", "list"]
                            }
                          }
                        },
                        "required": ["collected_by", "tags"]
                      }
                    }
                  },
                  "required": ["id", "descriptor", "fulfillments", "payments"]
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
  
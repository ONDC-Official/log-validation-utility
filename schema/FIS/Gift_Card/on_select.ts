export const onSelectSchemaFIS10 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "context": {
        "type": "object",
        "properties": {
          "domain": { "type": "string", "enum": ["ONDC:FIS10"] },
          "location": {
            "type": "object",
            "properties": {
              "city": {
                "type": "object",
                "properties": {
                  "code": { "type": "string", "enum": ["std:080"] }
                },
                "required": ["code"]
              },
              "country": {
                "type": "object",
                "properties": {
                  "code": { "type": "string", "enum": ["IND"] }
                },
                "required": ["code"]
              }
            },
            "required": ["city", "country"]
          },
          "action": { "type": "string", "enum": ["on_select"] },
          "version": { "type": "string", "enum": ["2.1.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string", "format": "uuid" },
          "message_id": { "type": "string", "format": "uuid" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": [
          "domain",
          "location",
          "action",
          "version",
          "bap_id",
          "bap_uri",
          "bpp_id",
          "bpp_uri",
          "transaction_id",
          "message_id",
          "timestamp"
        ]
      },
      "message": {
        "type": "object",
        "properties": {
          "order": {
            "type": "object",
            "properties": {
              "provider": {
                "type": "object",
                "properties": {
                  "id": { "type": "string" }
                },
                "required": ["id"]
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "type": { "type": "string", "enum": ["BPP_ONLINE_EMAIL_SMS", "BPP_ONLINE_PORTAL", "BPP_ONLINE_OTHERS"] }
                  },
                  "required": ["id", "type"]
                }
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "price": {
                      "type": "object",
                      "properties": {
                        "currency": { "type": "string", "enum": ["INR"] },
                        "value": { "type": "string", "pattern": "^[0-9]+(\\.[0-9]{1,2})?$" },
                        "offered_value": { "type": "string", "pattern": "^[0-9]+(\\.[0-9]{1,2})?$" }
                      },
                      "required": ["currency", "value", "offered_value"]
                    },
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": {
                          "type": "object",
                          "properties": {
                            "count": { "type": "integer", "minimum": 1 }
                          },
                          "required": ["count"]
                        }
                      },
                      "required": ["selected"]
                    },
                    "fulfillment_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    },
                    "time": {
                      "type": "object",
                      "properties": {
                        "label": { "type": "string", "enum": ["VALIDITY"] },
                        "duration": { "type": "string" },
                        "timestamp": { "type": "string", "format": "date-time" }
                      },
                      "required": ["label", "duration", "timestamp"]
                    },
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
                              "required": ["descriptor"]
                            }
                          }
                        },
                        "required": ["descriptor", "list"]
                      }
                    }
                  },
                  "required": ["id", "price", "quantity", "fulfillment_ids", "time", "tags"]
                }
              },
              "offers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "item_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    },
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
                        "required": ["descriptor", "list"]
                      }
                    }
                  },
                  "required": ["id", "item_ids"]
                }
              },
              "quote": {
                "type": "object",
                "properties": {
                  "price": {
                    "type": "object",
                    "properties": {
                      "currency": { "type": "string", "enum": ["INR"] },
                      "value": { "type": "string", "pattern": "^[0-9]+(\\.[0-9]{1,2})?$" }
                    },
                    "required": ["currency", "value"]
                  },
                  "breakup": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "item": {
                          "type": "object",
                          "properties": {
                            "id": { "type": "string" },
                            "quantity": {
                              "type": "object",
                              "properties": {
                                "selected": {
                                  "type": "object",
                                  "properties": {
                                    "count": { "type": "integer", "minimum": 1 }
                                  },
                                  "required": ["count"]
                                }
                              },
                              "required": ["selected"]
                            },
                            "price": {
                              "type": "object",
                              "properties": {
                                "currency": { "type": "string", "enum": ["INR"] },
                                "value": { "type": "string" },
                                "offered_value": { "type": "string" }
                              },
                              "required": ["currency", "value", "offered_value"]
                            }
                          }
                        },
                        "title": { "type": "string" },
                        "price": {
                          "type": "object",
                          "properties": {
                            "currency": { "type": "string", "enum": ["INR"] },
                            "value": { "type": "string" }
                          },
                          "required": ["currency", "value"]
                        }
                      },
                      "required": ["item", "title", "price"]
                    }
                  },
                  "ttl": { "type": "string" }
                },
                "required": ["price", "breakup", "ttl"]
              }
            },
            "required": ["provider", "fulfillments", "items", "offers", "quote"]
          }
        },
        "required": ["order"]
      }
    },
    "required": ["context", "message"]
  };
  
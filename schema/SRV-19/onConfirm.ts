export const onConfirmSchemaSRV19 = {
    "type": "object",
    "required": ["context", "message"],
    "properties": {
      "context": {
        "type": "object",
        "required": ["domain", "location", "action", "version", "bap_id", "bap_uri", "bpp_id", "bpp_uri", "transaction_id", "message_id", "timestamp"],
        "properties": {
          "domain": { "type": "string", "enum": ["ONDC:SRV19"] },
          "location": {
            "type": "object",
            "required": ["city", "country"],
            "properties": {
              "city": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string" }
                }
              },
              "country": {
                "type": "object",
                "required": ["code"],
                "properties": {
                  "code": { "type": "string", "enum": ["IND"] }
                }
              }
            }
          },
          "action": { "type": "string", "enum": ["on_confirm"] },
          "version": { "type": "string", "enum": ["2.0.0"] },
          "bap_id": { "type": "string" },
          "bap_uri": { "type": "string", "format": "uri" },
          "bpp_id": { "type": "string" },
          "bpp_uri": { "type": "string", "format": "uri" },
          "transaction_id": { "type": "string" },
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" }
        }
      },
      "message": {
        "type": "object",
        "required": ["order"],
        "properties": {
          "order": {
            "type": "object",
            "required": ["id", "status", "provider", "items", "billing", "fulfillments", "quote", "payments"],
            "properties": {
              "id": { "type": "string" },
              "status": { "type": "string", "enum": ["Accepted"] },
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
                  "required": ["id", "location_ids", "fulfillment_ids"],
                  "properties": {
                    "id": { "type": "string" },
                    "location_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    },
                    "fulfillment_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    },
                    "quantity": {
                      "type": "object",
                      "properties": {
                        "selected": {
                          "type": "object",
                          "properties": {
                            "count": { "type": "integer" }
                          }
                        }
                      }
                    },
                    "price": {
                      "type": "object",
                      "properties": {
                        "currency": { "type": "string" },
                        "value": { "type": "string" }
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
                  "state": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                      "name": { "type": "string" }
                    }
                  },
                  "city": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                      "name": { "type": "string" }
                    }
                  },
                  "tax_id": { "type": "string" },
                  "email": { "type": "string" },
                  "phone": { "type": "string" }
                }
              },
              "fulfillments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "type", "stops", "customer"],
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
                          },
                          "contact": {
                            "type": "object",
                            "required": ["phone"],
                            "properties": {
                              "phone": { "type": "string" }
                            }
                          },
                          "instructions": {
                            "type": "object",
                            "required": ["name", "short_desc"],
                            "properties": {
                              "name": { "type": "string" },
                              "short_desc": { "type": "string" }
                            }
                          }
                        }
                      }
                    },
                    "customer": {
                      "type": "object",
                      "required": ["person"],
                      "properties": {
                        "person": {
                          "type": "object",
                          "required": ["name"],
                          "properties": {
                            "name": { "type": "string" }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "quote": {
                "type": "object",
                "required": ["price", "breakup", "ttl"],
                "properties": {
                  "price": {
                    "type": "object",
                    "required": ["currency", "value"],
                    "properties": {
                      "currency": { "type": "string" },
                      "value": { "type": "string" }
                    }
                  },
                  "breakup": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["title"],
                      "properties": {
                        "title": { "type": "string" },
                        "price": {
                          "type": "object",
                          "properties": {
                            "currency": { "type": "string" },
                            "value": { "type": "string" }
                          }
                        },
                        "item": {
                          "type": "object",
                          "required": ["id"],
                          "properties": {
                            "id": { "type": "string" },
                            "quantity": {
                              "type": "object",
                              "properties": {
                                "selected": {
                                  "type": "object",
                                  "properties": {
                                    "count": { "type": "integer" }
                                  }
                                }
                              }
                            },
                            "price": {
                              "type": "object",
                              "properties": {
                                "currency": { "type": "string" },
                                "value": { "type": "string" }
                              }
                            }
                          }
                        },
                        "tags": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "required": ["descriptor", "list"],
                            "properties": {
                              "descriptor": {
                                "type": "object",
                                "required": ["code"],
                                "properties": {
                                  "code": { "type": "string" }
                                }
                              },
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
                  },
                  "ttl": { "type": "string" }
                }
              },
              "payments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["id", "collected_by", "params", "status", "type", "tags"],
                  "properties": {
                    "id": { "type": "string" },
                    "collected_by": { "type": "string" },
                    "params": {
                      "type": "object",
                      "required": ["amount", "currency", "bank_account_number", "virtual_payment_address"],
                      "properties": {
                        "amount": { "type": "string" },
                        "currency": { "type": "string" },
                        "bank_account_number": { "type": "string" },
                        "virtual_payment_address": { "type": "string" }
                      }
                    },
                    "status": { "type": "string", "enum": ["PAID"] },
                    "type": { "type": "string", "enum": ["PRE-FULFILLMENT"] },
                    "tags": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["descriptor", "list"],
                        "properties": {
                          "descriptor": {
                            "type": "object",
                            "required": ["code"],
                            "properties": {
                              "code": { "type": "string" }
                            }
                          },
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
                    },
                    "created_at": { "type": "string", "format": "date-time" },
                    "updated_at": { "type": "string", "format": "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  
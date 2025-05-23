const onInitSchemaTRV14 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "ONDC Travel Order OnInit",
    type: "object",
    properties: {
      context: {
        type: "object",
        properties: {
          location: {
            type: "object",
            properties: {
              country: {
                type: "object",
                properties: {
                  code: { type: "string" }
                },
                required: ["code"]
              },
              city: {
                type: "object",
                properties: {
                  code: { type: "string" }
                },
                required: ["code"]
              }
            },
            required: ["country", "city"]
          },
          domain: { type: "string" },
          timestamp: { type: "string" },
          bap_id: { type: "string" },
          transaction_id: { type: "string" },
          message_id: { type: "string" },
          version: { type: "string" },
          action: { type: "string" },
          bap_uri: { type: "string" },
          ttl: { type: "string" },
          bpp_id: { type: "string" },
          bpp_uri: { type: "string" }
        },
        required: [
          "location", "domain", "timestamp", "bap_id", 
          "transaction_id", "message_id", "version", 
          "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"
        ]
      },
      message: {
        type: "object",
        properties: {
          order: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string",minLength:1  },
                    descriptor: {
                      type: "object",
                      properties: {
                        name: { type: "string" ,minLength:1  },
                        code: { type: "string" ,minLength:1 },
                        short_desc: { type: "string" ,minLength:1  },
                        long_desc: { type: "string" ,minLength:1  },
                        images: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              url: { type: "string" },
                              size_type: { type: "string" }
                            },
                            required: ["url"]
                          }
                        }
                      },
                      required: ["name", "code"]
                    },
                    parent_item_id: { type: "string" ,minLength:1 },
                    location_ids: {
                      type: "array",
                      items: { type: "string" ,minLength:1 }
                    },
                    category_ids: {
                      type: "array",
                      items: { type: "string" ,minLength:1 }
                    },
                    price: {
                      type: "object",
                      properties: {
                        currency: { type: "string" },
                        value: { type: "string" ,minLength:1 }
                      },
                      required: ["currency", "value"]
                    },
                    quantity: {
                      type: "object",
                      properties: {
                        selected: {
                          type: "object",
                          properties: {
                            count: { type: "number" }
                          },
                          required: ["count"]
                        }
                      },
                      required: ["selected"]
                    },
                    time: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        duration: { type: "string" }
                      }
                    },
                    fulfillment_ids: {
                      type: "array",
                      items: { type: "string" ,minLength:1 }
                    },
                    add_ons: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" ,minLength:1 },
                          descriptor: {
                            type: "object",
                            properties: {
                              name: { type: "string" ,minLength:1 }
                            }
                          },
                          quantity: {
                            type: "object",
                            properties: {
                              selected: {
                                type: "object",
                                properties: {
                                  count: { type: "number" }
                                }
                              }
                            }
                          },
                          price: {
                            type: "object",
                            properties: {
                              value: { type: "string" },
                              currency: { type: "string" }
                            }
                          }
                        }
                      }
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: { type: "string" }
                            }
                          },
                          list: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                descriptor: {
                                  type: "object",
                                  properties: {
                                    code: { type: "string" }
                                  }
                                },
                                value: { type: "string" }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  required: ["id", "descriptor"]
                }
              },
              fulfillments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" ,minLength:1 },
                    type: { type: "string" , enum:["VISIT"] },
                    stops: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          type: { type: "string" },
                          instructions: {
                            type: "object",
                            properties: {
                              additional_desc: {
                                type: "object",
                                properties: {
                                  url: { type: "string" },
                                  content_type: { type: "string" }
                                }
                              }
                            }
                          },
                          time: {
                            type: "object",
                            properties: {
                              timestamp: { type: "string" }
                            }
                          }
                        }
                      }
                    },
                    agent: {
                      type: "object",
                      required:["organization"],
                      properties: {
                        organization: {
                          type: "object",
                          required:["contact"],
                          properties: {
                            contact: {
                              type: "object",
                              required:["phone","email"],
                              properties: {
                                phone: { type: "string" , minlength:1},
                                email: { type: "string" , minlength:1 }
                              }
                            }
                          }
                        }
                      }
                    },
                    vehicle: {
                      type: "object",
                      properties: {
                        category: { type: "string" ,minLength:1 }
                      }
                    }
                  },
                  required: ["id", "type","agent","vehicle"],
                  additionalProperties: false,
                }
              },
              provider: {
                type: "object",
                properties: {
                  id: { type: "string" ,minLength:1 },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: { type: "string" ,minLength:1 },
                      images: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            url: { type: "string" },
                            size_type: { type: "string" }
                          }
                        }
                      }
                    }
                  },
                  locations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" ,minLength:1 },
                        gps: { type: "string" },
                        descriptor: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            short_desc: { type: "string" },
                            additional_desc: {
                              type: "object",
                              properties: {
                                url: { type: "string" },
                                content_type: { type: "string" }
                              }
                            },
                            images: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  url: { type: "string" },
                                  size_type: { type: "string" }
                                }
                              }
                            }
                          }
                        },
                        rating: { type: "string" }
                      },
                      required: ["id", "gps", "descriptor"]
                    }
                  }
                },
                required: ["id", "descriptor", "locations"]
              },
              cancellation_terms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cancellation_fee: {
                      type: "object",
                      properties: {
                        percentage: { type: "string" }
                      }
                    },
                    fulfillment_state: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: { type: "string" }
                          }
                        }
                      }
                    },
                    cancel_by: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        duration: { type: "string" }
                      }
                    },
                    cancellation_eligible: { type: "boolean" },
                    external_ref: {
                      type: "object",
                      properties: {
                        mimetype: { type: "string" },
                        url: { type: "string" }
                      }
                    }
                  }
                }
              },
              replacement_terms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    external_ref: {
                      type: "object",
                      properties: {
                        mimetype: { type: "string" },
                        url: { type: "string" }
                      }
                    }
                  }
                }
              },
              quote: {
                type: "object",
                properties: {
                  breakup: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        item: {
                          type: "object",
                          properties: {
                            id: { type: "string" ,minLength:1 },
                            price: {
                              type: "object",
                              properties: {
                                currency: { type: "string" },
                                value: { type: "string" }
                              }
                            },
                            quantity: {
                              type: "object",
                              properties: {
                                selected: {
                                  type: "object",
                                  properties: {
                                    count: { type: "number" }
                                  }
                                }
                              }
                            },
                            add_ons: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "string" }
                                }
                              }
                            }
                          }
                        },
                        price: {
                          type: "object",
                          properties: {
                            currency: { type: "string" },
                            value: { type: "string" }
                          }
                        }
                      }
                    }
                  },
                  price: {
                    type: "object",
                    properties: {
                      currency: { type: "string" },
                      value: { type: "string" }
                    }
                  }
                },
                required: ["breakup", "price"]
              },
              billing: {
                type: "object",
                properties: {
                  name: { type: "string" ,minLength:1 },
                  email: { type: "string" ,minLength:1 },
                  phone: { type: "string" ,minLength:1 }
                }
              },
              payments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" ,minLength:1 },
                    collected_by: { type: "string",enum:["BAP","BPP"] },
                    status: { type: "string" ,enum:["PAID","NOT-PAID"]},
                    type: { type: "string",enum:["PRE-ORDER","POST-FULFILLMENT","ON-FUlFILLMENT"] }
                  },
                  required: ["id", "collected_by", "status", "type"]
                }
              },
              tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        code: { type: "string" },
                        name: { type: "string" }
                      }
                    },
                    display: { type: "boolean" },
                    list: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: { type: "string" }
                            }
                          },
                          value: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            required: [
              "items", "fulfillments", "provider", 
              "quote", "payments"
            ],
            additionalProperties: false,
          }
        },
        required: ["order"]
      }
    },
    required: ["context", "message"]
}

export default onInitSchemaTRV14

const onUpdateSchemaTRV14 = {
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
          action: { 
            type: "string",
            enum: ["on_update"]
          },
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
              id: { type: "string" },
              status: { 
                type: "string",
                enum: ["SOFT_CANCEL"]
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    descriptor: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        code: { type: "string" },
                        short_desc: { type: "string" },
                        long_desc: { type: "string" },
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
                      },
                      required: ["name", "code"]
                    },
                    parent_item_id: { type: "string" },
                    location_ids: {
                      type: "array",
                      items: { type: "string" }
                    },
                    category_ids: {
                      type: "array",
                      items: { type: "string" }
                    },
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
                    time: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        duration: { type: "string" }
                      }
                    },
                    fulfillment_ids: {
                      type: "array",
                      items: { type: "string" }
                    },
                    add_ons: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          descriptor: {
                            type: "object",
                            properties: {
                              name: { type: "string" }
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
                    id: { type: "string" },
                    type: { type: "string" },
                    state: {
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
                    stops: {
                      type: "array",
                      items: {
                        type: "object",
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
                              timestamp: { type: "string", format: "date-time" },
                              range: {
                                type: 'object',
                                required: ['start', 'end'],
                                properties: {
                                  start: { type: 'string', format: 'date-time' },
                                  end: { type: 'string', format: 'date-time' },
                                },
                              },
                            }
                          },
                          authorization: {
                            type: "object",
                            properties: {
                              type: { type: "string" },
                              token: { type: "string" },
                              valid_to: { type: "string" },
                              status: { type: "string" }
                            }
                          }
                        }
                      }
                    },
                    agent: {
                      type: "object",
                      properties: {
                        organization: {
                          type: "object",
                          properties: {
                            contact: {
                              type: "object",
                              properties: {
                                phone: { type: "string" },
                                email: { type: "string" }
                              }
                            }
                          }
                        }
                      }
                    },
                    vehicle: {
                      type: "object",
                      properties: {
                        category: { type: "string" }
                      }
                    }
                  },
                  required: ["id", "type", "state"]
                }
              },
              provider: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
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
                        id: { type: "string" },
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
                      }
                    }
                  }
                },
                required: ["id", "descriptor"]
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
              billing: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" }
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
                            id: { type: "string" },
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
                                  id: { type: "string" },
                                  price: {
                                    type: "object",
                                    properties: {
                                      currency: { type: "string" },
                                      value: { type: "string" }
                                    }
                                  }
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
                }
              },
              payments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    collected_by: { type: "string" },
                    status: { 
                      type: "string",
                      enum: ["PAID"]
                    },
                    type: { type: "string" },
                    params: {
                      type: "object",
                      properties: {
                        transaction_id: { type: "string" },
                        amount: { type: "string" },
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
              },
              created_at: { type: "string" },
              updated_at: { type: "string" }
            },
            required: [
              "id", "status", "items", "fulfillments", 
              "provider", "payments", "quote"
            ]
          }
        },
        required: ["order"]
      }
    },
    required: ["context", "message"]
}
export default onUpdateSchemaTRV14

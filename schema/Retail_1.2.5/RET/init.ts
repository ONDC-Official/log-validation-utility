export const initSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          minLength: 1,
        },
        action: {
          type: 'string',
          const: 'init',
        },
        core_version: {
          type: 'string',
          enum: ['1.2.5'],
          minLength: 1,
        },
        bap_id: {
          type: 'string',
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          format: 'url',
        },
        bpp_id: {
          type: 'string',
          minLength: 1,
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        country: {
          type: 'string',
          minLength: 1,
          const: 'IND',
        },
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
      },
      required: [
        'domain',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'city',
        'country',
        'timestamp',
        'ttl',
      ],
    },
    message: {
      type: 'object',
      properties: {
        order: {
          type: 'object',
          properties: {
            provider: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['id'],
                  },
                },
              },
              required: ['id', 'locations'],
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  fulfillment_id: {
                    type: 'string',
                    minLength: 1,
                  },
                  quantity: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'integer',
                      },
                    },
                    required: ['count'],
                  },
                  parent_item_id: {
                    type: 'string',
                    minLength: 1,
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                        },
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                              },
                              value: {
                                type: 'string',
                              },
                            },
                            required: ['code', 'value'],
                          },
                        },
                      },
                      required: ['code', 'list'],
                    },
                  },
                },
                required: ['id', 'fulfillment_id', 'quantity'],
              },
            },
            offers: {
              type: 'array',
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string"
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string"
                              },
                              value: {
                                type: "string",
                              }
                            },
                            required: ["code", "value"]
                          }
                        }
                      },
                      required: ["code", "list"]
                    }
                  }
                },
                required: ["id"]
              },
            },
            billing: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                address: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 1,
                    },
                    building: {
                      type: 'string',
                    },
                    locality: {
                      type: 'string',
                    },
                    city: {
                      type: 'string',
                      minLength: 1,
                    },
                    state: {
                      type: 'string',
                      minLength: 1,
                    },
                    country: {
                      type: 'string',
                      minLength: 1,
                    },
                    area_code: {
                      type: 'string',
                      maxLength: 6,
                      minLength: 1,
                    },
                  },
                  required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                },
                tax_number: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                phone: {
                  type: 'string',
                  minLength: 10,
                  maxLength: 11,
                },
                created_at: {
                  type: 'string',
                  format: 'rfc3339-date-time',
                },
                updated_at: {
                  type: 'string',
                  format: 'rfc3339-date-time',
                },
              },
              required: ['name', 'address', 'phone', 'created_at', 'updated_at'],
            },
            fulfillments: {
              type: 'array',
               minItems: 1,
               maxItems: 1,
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    enum: ['Delivery','Self-Pickup','Buyer-Delivery']
                  },
                  end: {
                    type: 'object',
                    properties: {
                      location: {
                        type: 'object',
                        properties: {
                          gps: {
                            type: 'string',
                            minLength: 1,
                          },
                          address: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                                minLength: 3,
                              },
                              building: {
                                type: 'string',
                                minLength: 3,
                              },
                              locality: {
                                type: 'string',
                              },
                              city: {
                                type: 'string',
                              },
                              state: {
                                type: 'string',
                                minLength: 1,
                              },
                              country: {
                                type: 'string',
                                minLength: 1,
                              },
                              area_code: {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['name', 'building', 'locality', 'city', 'state', 'country', 'area_code'],
                          },
                        },
                        required: ['gps', 'address'],
                      },
                      contact: {
                        type: 'object',
                        properties: {
                          phone: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 11,
                          },
                        },
                        required: ['phone'],
                      },
                    },
                    required: ['location', 'contact'],
                  },
                },
                required: ['id', 'type', 'end'],
              },
            },
            cancellation_terms: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  fulfillment_state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            minLength: 1
                          },
                          short_desc: {
                            type: "string",
                            minLength: 1
                          }
                        },
                        required: ["code", "short_desc"]
                      }
                    },
                    required: ["descriptor"]
                  },
                  cancellation_fee: {
                    type: "object",
                    properties: {
                      percentage: {
                        type: "string",
                        pattern: "^(100(\\.00?)?|\\d{1,2}(\\.\\d{1,2})?)$"
                      },
                      amount: {
                        type: "object",
                        properties: {
                          currency: {
                            type: "string",
                            enum: ["INR"]
                          },
                          value: {
                            type: "string",
                            pattern: "^\\d+(\\.\\d{1,2})?$"
                          }
                        },
                        required: ["currency", "value"]
                      }
                    },
                    required: ["percentage", "amount"]
                  }
                },
                required: ["fulfillment_state", "cancellation_fee"]
              }
            }
          },
          required: ['provider', 'items', 'billing', 'fulfillments'],
        },
      },
      required: ['order'],
    },
  },
  required: ['context', 'message'],
}

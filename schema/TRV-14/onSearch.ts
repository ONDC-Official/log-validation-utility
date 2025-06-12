const onSearchSchemaTRV14 ={
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
          timestamp: { type: "string", format: "date-time" },
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
          "location", "domain", "timestamp", "bap_id", "transaction_id",
          "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"
        ]
      },
      message: {
        type: "object",
        properties: {
          catalog: {
            type: "object",
            properties: {
              descriptor: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  short_desc: { type: "string" },
                  long_desc: { type: "string" },
                  images: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        url: { type: "string" },
                        size_type: { type: "string" }
                      },
                      required: ["url", "size_type"]
                    }
                  }
                },
                required: ["name", "images"]
              },
              providers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    descriptor: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        short_desc: { type: "string" },
                        images: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              url: { type: "string" },
                              size_type: { type: "string" }
                            },
                            required: ["url", "size_type"]
                          }
                        }
                      },
                      required: ["name", "images"]
                    },
                    categories: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          parent_category_id: { type: "string" },
                          descriptor: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              code: { type: "string" }
                            },
                            required: ["name"]
                          }
                        },
                        required: ["id", "descriptor"]
                      }
                    },
                    time: {
                      type: "object",
                      properties: {
                        range: {
                          type: "object",
                          properties: {
                            start: { type: "string", format: "date-time" },
                            end: { type: "string", format: "date-time" }
                          },
                          required: ["start", "end"]
                        }
                      },
                      required: ["range"]
                    },
                    locations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          gps: { type: "string" },
                          rating: { type: "string" },
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
                                },
                                required: ["url", "content_type"]
                              },
                              images: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    url: { type: "string" },
                                    size_type: { type: "string" }
                                  },
                                  required: ["url", "size_type"]
                                }
                              }
                            },
                            required: ["name", "images"]
                          }
                        },
                        required: ["id", "gps", "descriptor", "rating"]
                      }
                    },
                    payments: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          collected_by: { type: "string" }
                        },
                        required: ["collected_by"]
                      }
                    }
                  },
                  required: ["id", "descriptor", "categories", "time", "locations", "payments"]
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
                      },
                      required: ["code", "name"]
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
                            },
                            required: ["code"]
                          },
                          value: { type: "string" }
                        },
                        required: ["descriptor", "value"]
                      }
                    }
                  },
                  required: ["descriptor", "list"]
                }
              }
            },
            required: ["descriptor", "providers", "tags"]
          }
        },
        required: ["catalog"]
      }
    },
    required: ["context", "message"]
  };
  
  export default onSearchSchemaTRV14

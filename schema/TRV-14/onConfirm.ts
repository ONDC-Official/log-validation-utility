const onConfirmSchemaTRV14 = {
  type: "object",
  required: ["context", "message"],
  properties: {
    context: {
      type: "object",
      required: [
        "location", "domain", "timestamp", "bap_id", "transaction_id",
        "message_id", "version", "action", "bap_uri", "ttl", "bpp_id", "bpp_uri"
      ],
      properties: {
        location: {
          type: "object",
          required: ["country", "city"],
          properties: {
            country: {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string", enum: ["IND"] }
              }
            },
            city: {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string" }
              }
            }
          }
        },
        domain: { type: "string", enum: ["ONDC:TRV14"] },
        timestamp: { type: "string", format: "date-time" },
        bap_id: { type: "string" },
        transaction_id: { type: "string" },
        message_id: { type: "string" },
        version: { type: "string" },
        action: { type: "string", enum: ["on_confirm"] },
        bap_uri: { type: "string", format: "uri" },
        ttl: { type: "string" },
        bpp_id: { type: "string" },
        bpp_uri: { type: "string", format: "uri" }
      }
    },
    message: {
      type: "object",
      required: ["order"],
      properties: {
        order: {
          type: "object",
          required: ["id", "status", "items", "billing", "fulfillments", "provider", "quote", "payments"],
          properties: {
            id: { type: "string" },
            status: { type: "string" },
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
                            url: { type: "string", format: "uri" },
                            size_type: { type: "string" }
                          }
                        }
                      }
                    }
                  },
                  location_ids: { type: "array", items: { type: "string" } },
                  category_ids: { type: "array", items: { type: "string" } },
                  fulfillment_ids: { type: "array", items: { type: "string" } },
                  time: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      duration: { type: "string" }
                    }
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
                          count: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            },
            billing: { type: "object" },
            fulfillments: { type: "array", items: { type: "object" } },
            provider: { type: "object" },
            quote: { type: "object" },
            payments: { type: "array", items: { type: "object" } }
          }
        }
      }
    }
  }
};

export default onConfirmSchemaTRV14;
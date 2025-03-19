const on_reconSchema = {
  type: "object",
  required: ["context", "message"],
  properties: {
    context: {
      type: "object",
      required: [
        "domain",
        "location",
        "version",
        "action",
        "bap_id",
        "bap_uri",
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl"
      ],
      properties: {
        domain: { type: "string", const: "ONDC:NTS10" },
        location: {
          type: "object",
          required: ["country", "city"],
          properties: {
            country: {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string", const: "IND" }
              }
            },
            city: {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string", const: "*" }
              }
            }
          }
        },
        version: { type: "string", const: "2.0.0" },
        action: { type: "string", const: "on_recon" },
        bap_id: { type: "string" },
        bap_uri: { type: "string", format: "uri" },
        bpp_id: { type: "string" },
        bpp_uri: { type: "string", format: "uri" },
        transaction_id: { type: "string" },
        message_id: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
        ttl: { type: "string"}
      }
    },
    message: {
      type: "object",
      required: ["orders"],
      properties: {
        orders: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "amount", "recon_accord", "settlements"],
            properties: {
              id: { type: "string" },
              amount: {
                type: "object",
                required: ["currency", "value"],
                properties: {
                  currency: { type: "string", const: "INR" },
                  value: { type: "string" }
                }
              },
              recon_accord: { type: "boolean" },
              settlements: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "payment_id", "status", "amount", "commission", "withholding_amount", "tcs", "tds", "updated_at"],
                  properties: {
                    id: { type: "string" },
                    payment_id: { type: "string" },
                    status: { type: "string", enum: ["PENDING", "SETTLED", "TO-BE-INITIATED"] },
                    settlement_ref_no: { type: "string" },
                    amount: {
                      type: "object",
                      required: ["currency", "value"],
                      properties: {
                        currency: { type: "string", const: "INR" },
                        value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }
                      }
                    },
                    commission: {
                      type: "object",
                      required: ["currency", "value"],
                      properties: {
                        currency: { type: "string", const: "INR" },
                        value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }
                      }
                    },
                    withholding_amount: {
                      type: "object",
                      required: ["currency", "value"],
                      properties: {
                        currency: { type: "string", const: "INR" },
                        value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }
                      }
                    },
                    tcs: {
                      type: "object",
                      required: ["currency", "value"],
                      properties: {
                        currency: { type: "string", const: "INR" },
                        value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }
                      }
                    },
                    tds: {
                      type: "object",
                      required: ["currency", "value"],
                      properties: {
                        currency: { type: "string", const: "INR" },
                        value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }
                      }
                    },
                    updated_at: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default on_reconSchema;
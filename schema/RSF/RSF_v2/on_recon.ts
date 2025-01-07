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
          "ttl",
        ],
        properties: {
          domain: { type: "string", enum: ["ONDC:NTS10"] },
          location: {
            type: "object",
            required: ["country", "city"],
            properties: {
              country: {
                type: "object",
                required: ["code"],
                properties: {
                  code: { type: "string", enum: ["IND"] },
                },
              },
              city: {
                type: "object",
                required: ["code"],
                properties: {
                  code: { type: "string", enum: ["*"] },
                },
              },
            },
          },
          version: { type: "string", enum: ["2.0.0"] },
          action: { type: "string", enum: ["on_recon"] },
          bap_id: { type: "string" },
          bap_uri: { type: "string", format: "uri" },
          bpp_id: { type: "string" },
          bpp_uri: { type: "string", format: "uri" },
          transaction_id: { type: "string" },
          message_id: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
          ttl: { type: "string", pattern: "^P\\d+D$" }, // ISO8601 Duration (e.g., P1D for 1 day)
        },
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
                    currency: { type: "string", enum: ["INR"] },
                    value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                  },
                },
                recon_accord: { type: "boolean" },
                settlements: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["id", "payment_id", "status", "amount", "updated_at"],
                    properties: {
                      id: { type: "string" },
                      payment_id: { type: "string" },
                      status: { type: "string", enum: ["PENDING", "SETTLED", "TO-BE-INITIATED"] },
                      due_date: { type: "string", format: "date" },
                      amount: {
                        type: "object",
                        required: ["currency", "value"],
                        properties: {
                          currency: { type: "string", enum: ["INR"] },
                          value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                          diff_value: { type: "string", pattern: "^\\d+\\.\\d{2}$" }, // Optional
                        },
                      },
                      commission: {
                        type: "object",
                        required: ["currency", "value"],
                        properties: {
                          currency: { type: "string", enum: ["INR"] },
                          value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        },
                      },
                      withholding_amount: {
                        type: "object",
                        required: ["currency", "value"],
                        properties: {
                          currency: { type: "string", enum: ["INR"] },
                          value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        },
                      },
                      tcs: {
                        type: "object",
                        required: ["currency", "value"],
                        properties: {
                          currency: { type: "string", enum: ["INR"] },
                          value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        },
                      },
                      tds: {
                        type: "object",
                        required: ["currency", "value"],
                        properties: {
                          currency: { type: "string", enum: ["INR"] },
                          value: { type: "string", pattern: "^\\d+\\.\\d{2}$" },
                        },
                      },
                      settlement_ref_no: { type: "string" },
                      updated_at: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    additionalProperties: false,
  };
  
  export default on_reconSchema;
  
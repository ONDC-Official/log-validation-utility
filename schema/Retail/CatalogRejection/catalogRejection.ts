export const catalogRejectionSchema = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          minLength: 1,
        },
        action: {
          type: "string",
          const: "catalog_rejection",
        },
        core_version: {
          type: "string",
          minLength: 1,
          const: "1.2.0",
        },
        bap_id: {
          type: "string",
          minLength: 1,
        },
        bap_uri: {
          type: "string",
          minLength: 1,
          format: "url",
        },
        bpp_id: {
          type: "string",
          minLength: 1,
        },
        bpp_uri: {
          type: "string",
          minLength: 1,
          format: "url",
        },
        transaction_id: {
          type: "string",
          minLength: 1,
        },
        message_id: {
          type: "string",
          minLength: 1,
        },
        city: {
          type: "string",
          minLength: 1,
        },
        country: {
          type: "string",
          const: "IND",
        },
        timestamp: {
          type: "string",
          minLength: 1,
          format: "rfc3339-date-time",
        },
        ttl: {
          type: "string",
          minLength: 1,
          format: "duration",
        },
      },
      required: [
        "domain",
        "action",
        "core_version",
        "bap_id",
        "bap_uri",
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "city",
        "country",
        "timestamp",
        "ttl",
      ],
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          code: {
            type: "string",
            pattern: "^\\d{5}$",
          },
          type: {
            type: "string",
            enum: [
              "ITEM-ERROR",
              "PROVIDER-ERROR",
              "INTEGRATION-ERROR",
              "BPP-ERROR",
            ],
          },
          path: {
            type: "string",
            minLength: 1,
          },
          message: {
            type: "string",
            minLength: 1,
          },
        },
        required: ["code", "type", "path", "message"],
      },
    },
  },
  required: ["context", "errors"],
};

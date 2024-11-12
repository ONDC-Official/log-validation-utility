import { fnbCategories } from '../../../utils/enum'

export const FnBonSearchSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          const: 'ONDC:RET11',
        },
        action: {
          type: 'string',
          const: 'on_search',
        },
        country: {
          type: 'string',
          const: 'IND',
        },
        city: {
          type: 'string',
          minLength: 1,
          not: {
            pattern: '\\*',
          },
          errorMessage: `City Code can't be * for on_search request`,
        },
        core_version: {
          type: 'string',
          const: '1.2.0',
        },
        bap_id: {
          type: 'string',
        },
        bap_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
        },
        message_id: {
          type: 'string',
        },
        timestamp: {
          format: 'rfc3339-date-time',
        },
        ttl: {
          type: 'string',
          format: 'duration',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
      },
      required: [
        'domain',
        'country',
        'city',
        'action',
        'core_version',
        'bap_id',
        'bap_uri',
        'bpp_id',
        'bpp_uri',
        'transaction_id',
        'message_id',
        'timestamp',
      ],
    },
    message: {
      type: 'object',
      properties: {
        catalog: {
          type: 'object',
          properties: {
            'bpp/fulfillments': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['Delivery', 'Self-Pickup'],
                  },
                },
                required: ['id', 'type'],
              },
            },
            'bpp/descriptor': {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                symbol: {
                  type: 'string',
                },
                short_desc: {
                  type: 'string',
                },
                long_desc: {
                  type: 'string',
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        enum: ['bpp_terms'],
                      },
                      list: {
                        type: 'array',
                        items: {
                          oneOf: [
                            {
                              if: {
                                properties: {
                                  code: { const: 'np_type' },
                                },
                              },
                              then: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    enum: ['np_type'],
                                  },
                                  value: {
                                    type: 'string',
                                    enum: ['MSN', 'ISN'],
                                  },
                                },
                                required: ['code', 'value'],
                                additionalProperties: false,
                              },
                            },
                            {
                              if: {
                                properties: {
                                  code: { const: 'accept_bap_terms' },
                                },
                              },
                              then: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    enum: ['accept_bap_terms'],
                                  },
                                  value: {
                                    type: 'string',
                                    enum: ['Y', 'N'],
                                  },
                                },
                                required: ['code', 'value'],
                                additionalProperties: false,
                              },
                            },
                            {
                              if: {
                                properties: {
                                  code: { const: 'collect_payment' },
                                },
                              },
                              then: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    enum: ['collect_payment'],
                                  },
                                  value: {
                                    type: 'string',
                                    enum: ['Y', 'N'],
                                  },
                                },
                                required: ['code', 'value'],
                                additionalProperties: false,
                              },
                            },
                          ],
                        },
                        minItems: 1,
                      },
                    },
                    required: ['code', 'list'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['name', 'symbol', 'short_desc', 'long_desc', 'images', 'tags'],
            },
            'bpp/providers': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  time: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        enum: ['enable', 'disable'],
                      },
                      timestamp: {
                        type: 'string',
                        format: 'rfc3339-date-time',
                      },
                    },
                    required: ['label', 'timestamp'],
                  },
                  fulfillments: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'string',
                        },
                        type: {
                          type: 'string',
                          enum: ['Delivery', 'Self-Pickup'],
                        },
                        contact: {
                          type: 'object',
                          properties: {
                            phone: {
                              type: 'string',
                              minLength: 10,
                              maxLength: 11,
                            },
                            email: {
                              type: 'string',
                              format: 'email',
                            },
                          },
                          required: ['phone', 'email'],
                        },
                      },
                      required: ['id', 'type', 'contact'],
                      additionalProperties: false,
                    },
                  },
                  descriptor: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      symbol: {
                        type: 'string',
                      },
                      short_desc: {
                        type: 'string',
                      },
                      long_desc: {
                        type: 'string',
                      },
                      images: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    },
                    required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
                  },
                  '@ondc/org/fssai_license_no': {
                    type: 'string',
                    minLength: 14,
                    maxLength: 14,
                  },
                  ttl: {
                    type: 'string',
                    format: 'duration',
                  },
                  locations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                              enum: ['enable', 'disable'],
                            },
                            timestamp: {
                              type: 'string',
                              format: 'rfc3339-date-time',
                            },
                            days: {
                              type: 'string',
                            },
                            schedule: {
                              type: 'object',
                              properties: {
                                holidays: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                    format: 'date',
                                  },
                                },
                                frequency: {
                                  type: 'string',
                                },
                                times: {
                                  type: 'array',
                                  minItems: 1,
                                  items: {
                                    type: 'string',
                                    minLength: 4,
                                    maxLength: 4,
                                  },
                                },
                              },
                              required: ['holidays'],
                            },
                            range: {
                              type: 'object',
                              properties: {
                                start: {
                                  type: 'string',
                                },
                                end: {
                                  type: 'string',
                                },
                              },
                              required: ['start', 'end'],
                            },
                          },
                          required: ['label', 'timestamp', 'days', 'schedule'],
                        },
                        gps: {
                          type: 'string',
                        },
                        address: {
                          type: 'object',
                          properties: {
                            locality: {
                              type: 'string',
                            },
                            street: {
                              type: 'string',
                            },
                            city: {
                              type: 'string',
                            },
                            area_code: {
                              type: 'string',
                              minLength: 6,
                              maxLength: 6,
                            },
                            state: {
                              type: 'string',
                            },
                          },
                          required: ['locality', 'street', 'city', 'area_code', 'state'],
                          additionalProperties: false,
                        },
                        circle: {
                          type: 'object',
                          properties: {
                            gps: {
                              type: 'string',

                              errorMessage:
                                'The gps co-ordinates should be precise atleast upto 6 digits after decimal',
                            },
                            radius: {
                              type: 'object',
                              properties: {
                                unit: {
                                  type: 'string',
                                  const: 'km',
                                },
                                value: {
                                  type: 'string',
                                },
                              },
                              required: ['unit', 'value'],
                            },
                          },
                          required: ['gps', 'radius'],
                        },
                      },
                      required: ['id', 'time', 'gps', 'address'],
                    },
                  },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          pattern:'^[a-zA-Z0-9]{1-12}$',
                          errorMessage: 'categories.id should be alphanumeric and upto 12 characters',
                        },
                        parent_category_id: {
                          type: 'string',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                            short_desc: {
                              type: 'string',
                            },
                            long_desc: {
                              type: 'string',
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                format: 'url',
                              },
                            },
                          },
                          required: ['name'],
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
                      required: ['id', 'tags'],
                    },
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                              enum: ['enable', 'disable'],
                            },
                            timestamp: {
                              type: 'string',
                              format: 'rfc3339-date-time',
                            },
                          },
                          required: ['label', 'timestamp'],
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                            symbol: {
                              type: 'string',
                            },
                            short_desc: {
                              type: 'string',
                            },
                            long_desc: {
                              type: 'string',
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                              },
                            },
                          },
                          required: ['name'],
                        },
                        quantity: {
                          type: 'object',
                          properties: {
                            unitized: {
                              type: 'object',
                              properties: {
                                measure: {
                                  type: 'object',
                                  properties: {
                                    unit: {
                                      type: 'string',
                                      enum: ['unit', 'dozen', 'gram', 'kilogram', 'tonne', 'litre', 'millilitre'],
                                    },
                                    value: {
                                      type: 'string',
                                      pattern: '^[0-9]+(.[0-9]+)?$',
                                      errorMessage: 'enter a valid number',
                                    },
                                  },
                                  required: ['unit', 'value'],
                                },
                              },
                              required: ['measure'],
                            },
                            available: {
                              type: 'object',
                              properties: {
                                count: {
                                  type: 'string',
                                  enum: ['99', '0'],
                                  errorMessage: 'available count must be either 99 or 0 only',
                                },
                              },
                              required: ['count'],
                            },
                            maximum: {
                              type: 'object',
                              properties: {
                                count: {
                                  type: 'string',
                                  pattern: '^[0-9]+$',
                                  errorMessage: 'maximum count must be in stringified number format. ',
                                },
                              },
                              required: ['count'],
                            },
                          },
                          required: ['available', 'maximum'],
                        },
                        price: {
                          type: 'object',
                          properties: {
                            currency: {
                              type: 'string',
                              const: 'INR',
                            },
                            value: {
                              type: 'string',
                              pattern: '^[-+]?[0-9]+(\.[0-9]{1,2})?$',
                              errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                            },
                            maximum_value: {
                              type: 'string',
                              pattern: '^[0-9]+(\.[0-9]{1,2})?$',
                              errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                            },
                            tags: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  code: {
                                    type: 'string',
                                    enum: ['range', 'default_selection'],
                                  },
                                  list: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      properties: {
                                        code: {
                                          type: 'string',
                                          enum: ['lower', 'upper', 'value', 'maximum_value'],
                                        },
                                        value: {
                                          type: 'string',
                                          pattern: '^[0-9]+(\.[0-9]{1,2})?$',
                                          errorMessage: 'enter a valid number with exactly two decimal places.',
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          required: ['currency', 'value', 'maximum_value'],
                        },
                        category_id: {
                          type: 'string',
                          enum: fnbCategories,
                          errorMessage: 'Invalid category ID found for item for on_search ',
                        },
                        category_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                            pattern: '^[a-zA-Z0-9]{1,12}:[a-zA-Z0-9]{1,12}$',
                            errorMessage: 'format of category_ids must be followed as per API contract',
                          },
                        },
                        fulfillment_id: {
                          type: 'string',
                        },
                        location_id: {
                          type: 'string',
                        },
                        related: {
                          type: 'boolean',
                        },
                        recommended: {
                          type: 'boolean',
                        },
                        '@ondc/org/returnable': {
                          type: 'boolean',
                        },
                        '@ondc/org/cancellable': {
                          type: 'boolean',
                        },
                        '@ondc/org/return_window': {
                          type: ['string', 'null'],
                          format: 'duration',
                        },
                        '@ondc/org/seller_pickup_return': {
                          type: 'boolean',
                        },
                        '@ondc/org/time_to_ship': {
                          type: 'string',
                          pattern: '^PT(?:(?:60|[1-5]?[0-9]|60)M|1H)$',
                          errorMessage: 'time to ship should be within PT0M-PT59M or PT1H',
                        },
                        '@ondc/org/available_on_cod': {
                          type: 'boolean',
                        },
                        '@ondc/org/contact_details_consumer_care': {
                          type: 'string',
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
                      required: ['id', 'descriptor', 'quantity', 'price', 'category_id', 'tags'],
                    },
                  },
                  offers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              enum: ['disc_pct', 'disc_amt', 'buyXgetY', 'freebie'],
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                              },
                            },
                          },
                          required: ['code', 'images'],
                        },
                        location_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        item_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                            },
                            range: {
                              type: 'object',
                              properties: {
                                start: {
                                  type: 'string',
                                  format: 'rfc3339-date-time',
                                },
                                end: {
                                  type: 'string',
                                  format: 'rfc3339-date-time',
                                },
                              },
                            },
                          },
                          required: ['label', 'range'],
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
                      required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags'],
                    },
                  },
                  tags: {
                    type: 'array',
                    items: {
                      allOf: [
                        {
                          if: {
                            properties: {
                              code: {
                                const: 'timing',
                              },
                            },
                          },
                          then: {
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'type',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                            enum: ['Self-Pickup', 'Order', 'Delivery', 'All'],
                                            errorMessage:
                                              "timing for fulfillment type, enum - 'Order' (online order processing timings 'Delivery' (order shipment timings, will be same as delivery timings for hyperlocal), 'Self-Pickup' (self-pickup timings)",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'location',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'day_from',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^[1-7]$',
                                            errorMessage:
                                              "Value for 'day_from' must be numeric characters only from 1 to 7",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'day_to',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^[1-7]$',
                                            errorMessage:
                                              "Value for 'day_to' must be numeric characters only from 1 to 7",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'time_from',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^([01][0-9]|2[0-3])[0-5][0-9]$',
                                            errorMessage:
                                              "Value for 'time_from' must be a 4-digit numeric value in HHMM format",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'time_to',
                                          },
                                        },
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^(2[0-3]|[01]?[0-9]|24)[0-5]?[0-9]$',
                                            errorMessage:
                                              "Value for 'time_to' must be a 4-digit numeric value in HHMM format",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
                        {
                          if: {
                            properties: {
                              code: {
                                const: 'serviceability',
                              },
                            },
                          },
                          then: {
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      enum: ['location', 'category', 'type', 'val', 'unit'],
                                      errorMessage:
                                        "Serviceability must have these values 'location', 'category', 'type', 'val', 'unit'",
                                    },
                                    value: {
                                      type: 'string',
                                    },
                                  },
                                  required: ['code', 'value'],
                                  additionalProperties: false,
                                },
                                minItems: 5,
                                maxItems: 5,
                                uniqueItems: true,
                                errorMessage: {
                                  minItems: 'Serviceability must have minimum 5 values',
                                  maxItems: 'Serviceability must have maximum 5 values',
                                  uniqueItems: 'Serviceability must have unique items',
                                  _: "Serviceability must have these values 'location', 'category', 'type', 'val', 'unit' and no duplicacy or other elements allowed",
                                },
                              },
                            },
                          },
                        },
                        {
                          if: {
                            properties: {
                              code: {
                                const: 'catalog_link',
                              },
                            },
                          },
                          then: {
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'type_validity',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            format: 'duration',
                                            errorMessage: 'Duration must be RFC3339 duration.',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'last_update',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            description: 'RFC3339 UTC timestamp format',
                                            format: 'rfc3339-date-time',
                                            errorMessage: 'Time must be RFC3339 UTC timestamp format.',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'type_value',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            format: 'url',
                                            errorMessage: 'Type value must be url',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'last_update',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            description: 'RFC3339 UTC timestamp format',
                                            format: 'rfc3339-date-time',
                                            errorMessage: 'Time must be RFC3339 UTC timestamp format.',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'type',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            enum: ['inline', 'link'],
                                            errorMessage:
                                              "Type value must be 'inline'(items array in inline response, which is the default today) or 'link'(link to zip file for items array for the provider)",
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
                        {
                          if: {
                            properties: {
                              code: {
                                const: 'order_value',
                              },
                            },
                          },
                          then: {
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        properties: {
                                          code: {
                                            const: 'min_value',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        properties: {
                                          value: {
                                            pattern: '^[0-9]+(?:\.[0-9]{1,2})?$',
                                            errorMessage: 'min_value must be number with exactly two decimal places',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                required: [
                  'id',
                  'time',
                  'fulfillments',
                  'descriptor',
                  '@ondc/org/fssai_license_no',
                  'ttl',
                  'locations',
                  'categories',
                  'items',
                  'tags',
                ],
              },
            },
          },
          required: ['bpp/providers', 'bpp/descriptor'],
        },
      },
      required: ['catalog'],
    },
  },
  required: ['context', 'message'],
}

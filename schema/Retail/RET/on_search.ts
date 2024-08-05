import { combinedCategory } from '../../../utils/enum'

export const onSearchSchema = {
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
            type: 'string',
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
          minLength: 1,
        },
        bap_uri: {
          type: 'string',
          minLength: 1,
          format: 'url',
        },
        bpp_id: {
          type: 'string',
        },
        bpp_uri: {
          type: 'string',
          format: 'url',
        },
        transaction_id: {
          type: 'string',
          minLength: 1,
        },
        message_id: {
          type: 'string',
          minLength: 1,
        },
        timestamp: {
          type: 'string',
          format: 'rfc3339-date-time',
          errorMessage: 'Time must be RFC3339 UTC timestamp format.',
        },
        ttl: {
          type: 'string',
          format: 'duration',
          errorMessage: 'Duration must be RFC3339 duration.',
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
                  format: 'url',
                  errorMessage: 'descriptor/symbol should be URLs or can be empty strings as well',
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
                    pattern: '^$|^https?:\\/\\/[^\\s]*',
                    errorMessage: 'descriptor/images [] should be URLs or can be empty strings as well',
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
                                type: 'object',
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
                                type: 'object',
                                properties: {
                                  code: {
                                    const: 'accept_bap_terms',
                                  },
                                },
                                required: ['code'],
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
                                type: 'object',
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
              required: ['name', 'short_desc', 'long_desc', 'tags'],
              additionalProperties: true,
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
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        type: {
                          type: 'string',
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
                  ttl: {
                    type: 'string',
                    format: 'duration',
                    errorMessage: 'Duration must be RFC3339 duration.',
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
                              enum: ['enable', 'disable', 'open', 'close'],
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
                          required: ['label', 'timestamp', 'schedule'],
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
                            },
                            radius: {
                              type: 'object',
                              properties: {
                                unit: {
                                  type: 'string',
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
                      required: ['id', 'descriptor', 'tags'],
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
                        parent_item_id: {
                          type: 'string',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                            code: {
                              type: 'string',
                              oneOf: [
                                {
                                  type: 'string',
                                  pattern: '^(1|2|3|4|5):[a-zA-Z0-9]+$',
                                  errorMessage:
                                    'item/descriptor/code should be in this format - "type:code" where type is 1 - EAN, 2 - ISBN, 3 - GTIN, 4 - HSN, 5 - others',
                                },
                                {
                                  if: {
                                    type: 'object',
                                    properties: { domain: { enum: ['ONDC:RET1A', 'ONDC:AGR10'] } },
                                  },
                                  then: {
                                    type: 'string',
                                  },
                                },
                              ],
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
                                      errorMessage: 'value should be stringified number',
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
                                  errorMessage: 'maximum count must be numbers only in string ',
                                },
                              },
                              required: ['count'],
                            },
                          },
                          required: ['unitized', 'available', 'maximum'],
                        },
                        price: {
                          type: 'object',
                          properties: {
                            currency: {
                              type: 'string',
                            },
                            value: {
                              type: 'string',
                              pattern: '^[0-9]+(.[0-9]{1,2})?$',
                              errorMessage: 'Price value should be a number in string with upto 2 decimal places',
                            },
                            maximum_value: {
                              type: 'string',
                            },
                          },
                          required: ['currency', 'value', 'maximum_value'],
                        },
                        category_id: {
                          type: 'string',
                          enum: combinedCategory,
                          errorMessage: `Invalid category ID found for item for on_search`,
                        },
                        fulfillment_id: {
                          type: 'string',
                        },
                        location_id: {
                          type: 'string',
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
                          format: 'duration',
                        },
                        '@ondc/org/available_on_cod': {
                          type: 'boolean',
                        },
                        '@ondc/org/contact_details_consumer_care': {
                          type: 'string',
                        },
                        '@ondc/org/statutory_reqs_packaged_commodities': {
                          type: 'object',
                          properties: {
                            manufacturer_or_packer_name: {
                              type: 'string',
                            },
                            manufacturer_or_packer_address: {
                              type: 'string',
                            },
                            common_or_generic_name_of_commodity: {
                              type: 'string',
                            },
                            month_year_of_manufacture_packing_import: {
                              type: 'string',
                            },
                          },
                          required: [
                            'manufacturer_or_packer_name',
                            'manufacturer_or_packer_address',
                            'common_or_generic_name_of_commodity',
                            'month_year_of_manufacture_packing_import',
                          ],
                        },
                        '@ondc/org/statutory_reqs_prepackaged_food': {
                          type: 'object',
                          properties: {
                            nutritional_info: {
                              type: 'string',
                            },
                            additives_info: {
                              type: 'string',
                            },
                            brand_owner_FSSAI_license_no: {
                              type: 'string',
                            },
                            other_FSSAI_license_no: {
                              type: 'string',
                            },
                            importer_FSSAI_license_no: {
                              type: 'string',
                            },
                            ingredients_info: {
                              type: 'string',
                            },
                          },
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
                            if: {
                              type: 'object',
                              properties: { code: { const: 'origin' } },
                            },
                            then: {
                              type: 'object',
                              properties: {
                                list: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      value: {
                                        type: 'string',
                                        pattern:
                                          '/^A(BW|FG|GO|IA|L[AB]|ND|R[EGM]|SM|T[AFG]|U[ST]|ZE)|B(DI|E[LNS]|FA|G[DR]|H[RS]|IH|L[MRZ]|MU|OL|R[ABN]|TN|VT|WA)|C(A[FN]|CK|H[ELN]|IV|MR|O[DGKLM]|PV|RI|U[BW]|XR|Y[MP]|ZE)|D(EU|JI|MA|NK|OM|ZA)|E(CU|GY|RI|S[HPT]|TH)|F(IN|JI|LK|R[AO]|SM)|G(AB|BR|EO|GY|HA|I[BN]|LP|MB|N[BQ]|R[CDL]|TM|U[FMY])|H(KG|MD|ND|RV|TI|UN)|I(DN|MN|ND|OT|R[LNQ]|S[LR]|TA)|J(AM|EY|OR|PN)|K(AZ|EN|GZ|HM|IR|NA|OR|WT)|L(AO|B[NRY]|CA|IE|KA|SO|TU|UX|VA)|M(A[CFR]|CO|D[AGV]|EX|HL|KD|L[IT]|MR|N[EGP]|OZ|RT|SR|TQ|US|WI|Y[ST])|N(AM|CL|ER|FK|GA|I[CU]|LD|OR|PL|RU|ZL)|OMN|P(A[KN]|CN|ER|HL|LW|NG|OL|R[IKTY]|SE|YF)|QAT|R(EU|OU|US|WA)|S(AU|DN|EN|G[PS]|HN|JM|L[BEV]|MR|OM|PM|RB|SD|TP|UR|V[KN]|W[EZ]|XM|Y[CR])|T(C[AD]|GO|HA|JK|K[LM]|LS|ON|TO|U[NRV]|WN|ZA)|U(GA|KR|MI|RY|SA|ZB)|V(AT|CT|EN|GB|IR|NM|UT)|W(LF|SM)|YEM|Z(AF|MB|WE)$/ix',
                                        errorMessage:
                                          'Country must be in ISO 3166-1 format (three-letter country code)',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      required: [
                        'id',
                        'time',
                        'descriptor',
                        'quantity',
                        'price',
                        'category_id',
                        'fulfillment_id',
                        'location_id',
                        '@ondc/org/returnable',
                        '@ondc/org/cancellable',
                        '@ondc/org/return_window',
                        '@ondc/org/seller_pickup_return',
                        '@ondc/org/time_to_ship',
                        '@ondc/org/available_on_cod',
                        '@ondc/org/contact_details_consumer_care',
                        'tags',
                      ],
                    },
                  },
                  tags: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      allOf: [
                        {
                          if: {
                            type: 'object',
                            properties: {
                              code: {
                                const: 'timing',
                              },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'type',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            enum: ['Self-Pickup', 'Order', 'Delivery', 'All'],
                                            errorMessage:
                                              "timing for fulfillment type, enum - 'Order' (online order processing timings 'Delivery' (order shipment timings, will be same as delivery timings for hyperlocal), 'Self-Pickup' (self-pickup timings), All",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'location',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
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
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'day_from',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^[0-7]+$',
                                            errorMessage:
                                              "Value for 'day_from' must be numeric characters only from 1 to 7",
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'day_to',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
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
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'time_from',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^([01][0-9]|2[0-3])[0-5][0-9]$',
                                            errorMessage:
                                              "Value for 'time_from' must be a 4-digit numeric value in HHMM format",
                                            minLength: 4,
                                          },
                                        },
                                        required: ['code', 'value'],
                                      },
                                    },
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'time_to',
                                          },
                                        },
                                      },
                                      then: {
                                        type: 'object',
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
                            type: 'object',
                            properties: {
                              code: {
                                const: 'serviceability',
                              },
                            },
                          },
                          then: {
                            type: 'object',
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
                            type: 'object',
                            properties: {
                              code: {
                                const: 'catalog_link',
                              },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'type_validity',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            format: 'duration',
                                            errorMessage: 'Duration must be RFC3339 duration.',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'last_update',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
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
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'type_value',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            format: 'url',
                                            errorMessage: 'Type value must be url',
                                          },
                                        },
                                        required: ['value'],
                                      },
                                    },
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'last_update',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
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
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'type',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
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
                            type: 'object',
                            properties: {
                              code: {
                                const: 'order_value',
                              },
                            },
                          },
                          then: {
                            type: 'object',
                            properties: {
                              list: {
                                type: 'array',
                                items: {
                                  allOf: [
                                    {
                                      if: {
                                        type: 'object',
                                        properties: {
                                          code: {
                                            const: 'min_value',
                                          },
                                        },
                                        required: ['code'],
                                      },
                                      then: {
                                        type: 'object',
                                        properties: {
                                          value: {
                                            type: 'string',
                                            pattern: '^[0-9]+(?:.[0-9]{1,2})?$',
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
                required: ['id', 'time', 'fulfillments', 'descriptor', 'ttl', 'locations', 'items', 'tags'],
              },
            },
          },
          required: ['bpp/descriptor', 'bpp/providers'],
        },
      },
      required: ['catalog'],
    },
  },
  required: ['context', 'message'],
}

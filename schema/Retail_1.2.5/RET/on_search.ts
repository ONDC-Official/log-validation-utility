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
          const: '1.2.5',
          minLength: 1,
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
      additionalProperties: false,
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
                    enum: ['Delivery', 'Self-Pickup', 'Buyer-Delivery'],
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
                                    const: 'np_type',
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
                required: ['name', 'symbol','short_desc', 'long_desc'],
                additionalProperties: true,
              },
            },
            'bpp/providers': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  rating: {
                    type: 'number',
                    minimum: 1,
                    maximum: 5,
                    default: null,
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
                          pattern: '^[a-zA-Z0-9-]{1,12}$',
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
                        },
                        tags: {
                          type: 'array',
                          items: {
                            oneOf: [
                              {
                                type: 'object',
                                if: {
                                  properties: {
                                    code: {
                                      const: 'np_fees',
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
                                            enum: ['channel_margin_type', 'channel_margin_value'],
                                          },
                                          value: {
                                            type: 'string',
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              {
                                type: 'object',
                                if: {
                                  not: {
                                    properties: {
                                      code: {
                                        const: 'np_fees',
                                      },
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
                                          },
                                          value: {
                                            type: 'string',
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                      },
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
                        replacement_terms: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              replace_within: {
                                type: 'object',
                                properties: {
                                  duration: {
                                    type: 'string',
                                    pattern: '^P(\\d+D|\\d+W|\\d+M|\\d+Y)$',
                                  },
                                },
                                required: ['duration'],
                              },
                            },
                            required: ['replace_within'],
                          },
                          optional: true,
                        },
                        rating: {
                          type: 'number',

                          minimum: 1,
                          maximum: 5,
                          default: null,
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
                                  errorMessage: 'maximum count must be in stringified number format. ',
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
                        'rating',
                        'tags',
                      ],
                    },
                  },
                  creds: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'Unique identifier for the credential, format: ESG-XXXXXXXX (8 digits).',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              description: 'Code of the credential, format: ESG-XXXXXXXX (8 digits).',
                            },
                            short_desc: {
                              type: 'string',
                              description: 'Short description of the credential.',
                            },
                            name: {
                              type: 'string',
                              description: 'Name of the credential.',
                            },
                          },
                          required: ['code', 'short_desc', 'name'],
                          additionalProperties: false,
                        },
                        url: {
                          type: 'string',
                          format: 'uri',
                          description: 'URL to the credential or badge image.',
                        },
                        tags: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                description: "Code representing the tag (e.g., 'verification').",
                              },
                              list: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      description: "Code representing the specific tag value (e.g., 'verify_url').",
                                    },
                                    value: {
                                      type: 'string',
                                      format: 'uri',
                                      description: 'URL or other values associated with the tag.',
                                    },
                                  },
                                  required: ['code', 'value'],
                                  additionalProperties: false,
                                },
                                description: 'List of key-value pairs for additional tag data.',
                              },
                            },
                            required: ['code', 'list'],
                            additionalProperties: false,
                          },
                          description: 'Tags associated with the credential, including verification details.',
                        },
                      },
                      required: ['id', 'descriptor'],
                      additionalProperties: false,
                    },
                  },
                  // offers: {
                  //   type: 'array',
                  //   items: {
                  //     anyOf: [
                  //       // Discount offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'discount' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'discount' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['percent', 'amount']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Benefit tag must contain value_type and value'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // BuyXgetY offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'buyXgetY' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'buyXgetY' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 1,
                  //                           errorMessage: 'Qualifier tag must contain item_count'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_id' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_id' },
                  //                                     value: { type: 'string' }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 1,
                  //                           errorMessage: 'Benefit tag must contain item_count'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // Freebie offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'freebie' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'freebie' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_count' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_id' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_id' },
                  //                                     value: { type: 'string' }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'item_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 3,
                  //                           errorMessage: 'Benefit tag must contain item_count, item_id, and item_value'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // Slab offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'slab' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'slab' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['percent', 'amount']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 3,
                  //                           errorMessage: 'Benefit tag must contain value_type, value, and value_cap'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // Combo offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'combo' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'combo' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Benefit tag must contain value and value_cap'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // Delivery offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'delivery' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'delivery' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['percent', 'amount']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_cap' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Benefit tag must contain value_type and value'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       },
                  //       // Exchange offer validation
                  //       {
                  //         if: {
                  //           type: 'object',
                  //           properties: {
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'exchange' }
                  //               }
                  //             }
                  //           }
                  //         },
                  //         then: {
                  //           type: 'object',
                  //           properties: {
                  //             id: { type: 'string' },
                  //             descriptor: {
                  //               type: 'object',
                  //               properties: {
                  //                 code: { const: 'exchange' },
                  //                 images: {
                  //                   type: 'array',
                  //                   items: { type: 'string', format: 'uri' }
                  //                 }
                  //               },
                  //               required: ['code', 'images']
                  //             },
                  //             location_ids: { type: 'array', items: { type: 'string' } },
                  //             item_ids: { type: 'array', items: { type: 'string' } },
                  //             time: {
                  //               type: 'object',
                  //               properties: {
                  //                 label: { type: 'string' },
                  //                 range: {
                  //                   type: 'object',
                  //                   properties: {
                  //                     start: { type: 'string', format: 'date-time' },
                  //                     end: { type: 'string', format: 'date-time' }
                  //                   },
                  //                   required: ['start', 'end']
                  //                 }
                  //               },
                  //               required: ['label', 'range']
                  //             },
                  //             tags: {
                  //               type: 'array',
                  //               items: {
                  //                 oneOf: [
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'qualifier' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'min_value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           }
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'benefit' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value_type' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['percent', 'amount']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'value' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       pattern: '^-?[0-9]+(\\.[0-9]{1,2})?$'
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Benefit tag must contain value_type and value'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   },
                  //                   {
                  //                     if: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' }
                  //                       }
                  //                     },
                  //                     then: {
                  //                       type: 'object',
                  //                       properties: {
                  //                         code: { const: 'meta' },
                  //                         list: {
                  //                           type: 'array',
                  //                           items: {
                  //                             oneOf: [
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'additive' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               },
                  //                               {
                  //                                 if: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' }
                  //                                   }
                  //                                 },
                  //                                 then: {
                  //                                   type: 'object',
                  //                                   properties: {
                  //                                     code: { const: 'auto' },
                  //                                     value: {
                  //                                       type: 'string',
                  //                                       enum: ['yes', 'no']
                  //                                     }
                  //                                   },
                  //                                   required: ['code', 'value']
                  //                                 }
                  //                               }
                  //                             ]
                  //                           },
                  //                           minItems: 2,
                  //                           errorMessage: 'Meta tag must contain both additive and auto'
                  //                         }
                  //                       },
                  //                       required: ['code', 'list']
                  //                     }
                  //                   }
                  //                 ]
                  //               },
                  //               minItems: 3,
                  //               errorMessage: 'Tags must contain qualifier, benefit, and meta'
                  //             }
                  //           },
                  //           required: ['id', 'descriptor', 'location_ids', 'item_ids', 'time', 'tags']
                  //         }
                  //       }
                  //     ]
                  //   }
                  // },
                  offers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'Unique identifier for the offer.',
                        },
                        descriptor: {
                          type: 'object',
                          properties: {
                            code: {
                              type: 'string',
                              description: 'Type of the offer (e.g., discount, buyXgetY, freebie).',
                              enum: [
                                'discount',
                                'buyXgetY',
                                'freebie',
                                'slab',
                                'combo',
                                'delivery',
                                'exchange',
                                'financing',
                              ],
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                format: 'uri',
                                description: 'URL to images related to the offer.',
                              },
                            },
                          },
                          required: ['code', 'images'],
                        },
                        location_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                            description: 'List of location identifiers where the offer is valid.',
                          },
                        },
                        item_ids: {
                          type: 'array',
                          items: {
                            type: 'string',
                            description: 'List of item identifiers applicable for the offer.',
                          },
                        },
                        time: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                              description: 'Label for the time validity of the offer (e.g., valid).',
                            },
                            range: {
                              type: 'object',
                              properties: {
                                start: {
                                  type: 'string',
                                  format: 'date-time',
                                  description: 'Start date and time for the offer.',
                                },
                                end: {
                                  type: 'string',
                                  format: 'date-time',
                                  description: 'End date and time for the offer.',
                                },
                              },
                              required: ['start', 'end'],
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
                                description: 'Type of the tag (e.g., qualifier, benefit, meta).',
                                enum: ['qualifier', 'benefit', 'meta'],
                              },
                              list: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                      description: 'Code representing the specific tag property.',
                                      enum: [
                                        'min_value',
                                        'value_type',
                                        'value',
                                        'additive',
                                        'item_count',
                                        'item_id',
                                        'item_value',
                                      ],
                                    },
                                    value: {
                                      type: 'string',
                                      description: 'Value for the tag property.',
                                    },
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
                  required: ['id', 'time', 'fulfillments', 'descriptor', 'ttl', 'locations', 'items', 'tags', 'rating'],
                },
              },
            },
            required: ['bpp/descriptor', 'bpp/providers'],
          },
        },
      },
      required: ['catalog'],
    },
  },
  required: ['context', 'message'],
}

export const onUpdateForeclosureSchema = {
    type: "object",
    properties: {
      context: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            const: "ONDC:FIS12"
          },
          action: {
            type: "string",
            const: "on_update"
          },
          location: {
            type: "object",
            properties: {
              country: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    const: "IND"
                  }
                },
                required: ["code"]
              },
              city: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    const: "*"
                  }
                },
                required: ["code"]
              }
            },
            required: ["country", "city"]
          },
          bap_id: {
            type: "string",
            minLength: 1
          },
          bap_uri: {
            type: "string",
            minLength: 1,
            format: "uri"
          },
          bpp_id: {
            type: "string",
            minLength: 1
          },
          bpp_uri: {
            type: "string",
            minLength: 1,
            format: "uri"
          },
          transaction_id: {
            type: "string",
            minLength: 1
          },
          message_id: {
            type: "string",
            minLength: 1
          },
          timestamp: {
            type: "string",
            format: "date-time"
          },
          version: {
            type: "string",
            const: "2.3.0"
          },
          ttl: {
            type: "string",
            pattern: "^PT30M$"
          }
        },
        required: [
          "domain",
          "action",
          "location",
          "bap_id",
          "bap_uri",
          "bpp_id",
          "bpp_uri",
          "transaction_id",
          "message_id",
          "timestamp",
          "version",
          "ttl"
        ]
      },
      message: {
        type: "object",
        properties: {
          order: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              ref_order_ids: {
                type: "array",
                items: {
                  type: "string"
                }
              },
              status: {
                type: "string",
                enum: ["ACTIVE"]
              },
              provider: {
                type: "object",
                properties: {
                  id: {
                    type: "string"
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      images: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            size_type: {
                              type: "string",
                              const: "sm"
                            },
                            url: {
                              type: "string",
                              format: "uri"
                            }
                          },
                          required: ["size_type", "url"]
                        }
                      },
                      long_desc: {
                        type: "string"
                      },
                      name: {
                        type: "string"
                      },
                      short_desc: {
                        type: "string"
                      }
                    },
                    required: ["name", "short_desc"]
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum: ["LSP_INFO", "CONTACT_INFO"]
                            },
                            name: {
                              type: "string"
                            }
                          },
                          required: ["code", "name"]
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              descriptor: {
                                type: "object",
                                properties: {
                                  code: {
                                    type: "string",
                                    enum: [
                                      "LSP_NAME",
                                      "LSP_EMAIL",
                                      "LSP_CONTACT_NUMBER",
                                      "LSP_ADDRESS",
                                      "GRO_NAME",
                                      "GRO_EMAIL",
                                      "GRO_CONTACT_NUMBER",
                                      "CUSTOMER_SUPPORT_LINK",
                                      "CUSTOMER_SUPPORT_CONTACT_NUMBER",
                                      "CUSTOMER_SUPPORT_EMAIL"
                                    ]
                                  },
                                  name: {
                                    type: "string"
                                  }
                                },
                                required: ["code"]
                              },
                              value: {
                                type: "string"
                              }
                            },
                            required: ["descriptor", "value"]
                          }
                        }
                      },
                      required: ["list"]
                    },
                    minItems: 1
                  }
                },
                required: ["id"]
              },
              quote: {
                type: "object",
                properties: {
                  id: {
                    type: "string"
                  },
                  price: {
                    type: "object",
                    properties: {
                      currency: {
                        type: "string",
                        const: "INR"
                      },
                      value: {
                        type: "string"
                      }
                    },
                    required: ["currency", "value"]
                  },
                  breakup: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          enum: [
                            "WOKRKING_CAPITAL_LIMIT",
                            "CURRENT_UTLIZATION",
                            "PROCESSING_FEE",
                            "INSURANCE_CHARGES",
                            "OTHER_UPFRONT_CHARGES",
                            "OTHER_CHARGES",
                            "FORCLOSUER_CHARGES",
                            "OUTSTANDING_INTEREST"
                          ]
                        },
                        price: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string"
                            },
                            currency: {
                              type: "string",
                              const: "INR"
                            }
                          },
                          required: ["value", "currency"]
                        }
                      },
                      required: ["title", "price"]
                    }
                  },
                  ttl: {
                    type: "string",
                    pattern: "^P5D$"
                  }
                },
                required: ["id", "price"]
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    parent_item_id: {
                      type: "string"
                    },
                    descriptor: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                          const: "LOAN"
                        },
                        name: {
                          type: "string"
                        }
                      },
                      required: ["code", "name"]
                    },
                    category_ids: {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    },
                    fulfillment_ids: {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    },
                    price: {
                      type: "object",
                      properties: {
                        currency: {
                          type: "string",
                          const: "INR"
                        },
                        value: {
                          type: "string"
                        }
                      },
                      required: ["currency", "value"]
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: ["INFO", "CHECKLISTS", "LINKED_ORDER_IDS"]
                              },
                              name: {
                                type: "string"
                              }
                            },
                            required: ["code", "name"]
                          },
                          list: {
                            type: "array",
                            items: {
                              type: "object",
                              anyOf: [
                                {
                                  properties: {
                                    descriptor: {
                                      type: "object",
                                      properties: {
                                        code: {
                                          type: "string",
                                          enum: [
                                            "WORKING_CAPITAL_LIMIT",
                                            "INTEREST_RATE",
                                            "PROCESSING_FEE",
                                            "INSURANCE_CHARGES",
                                            "OTHER_UPFRONT_CHARGES",
                                            "TERM",
                                            "REPAYMENT_FREQUENCY",
                                            "RATE_ANNUALISED_PENAL_CHARGES",
                                            "OTHER_CHARGES",
                                            "COOL_OFF_PERIOD",
                                            "KYC_MODE",
                                            "CO_APPLICANT",
                                            "INDIVIDUAL_KYC",
                                            "BUSINESS_KYC",
                                            "PERSONAL_DISCUSSION",
                                            "PHYSICAL_VERIFICATION",
                                            "ENACH",
                                            "ESIGN"
                                          ]
                                        },
                                        name: {
                                          type: "string"
                                        },
                                        short_desc: {
                                          type: "string"
                                        }
                                      },
                                      required: ["code"]
                                    },
                                    value: {
                                      type: "string"
                                    }
                                  },
                                  required: [ "value"]
                                },
                                {
                                  properties: {
                                    value: {
                                      type: "string"
                                    }
                                  },
                                  required: ["value"]
                                }
                              ]
                            }
                          },
                          display: {
                            type: "boolean"
                          }
                        },
                        required: ["descriptor", "list"]
                      }
                    }
                  },
                  required: ["id", "descriptor", "price"]
                }
              },
              payments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    collected_by: {
                      type: "string",
                      enum: ["BPP", "MERCHANT"]
                    },
                    url: {
                      type: "string",
                      format: "uri"
                    },
                    params: {
                      type: "object",
                      properties: {
                        amount: {
                          type: "string"
                        },
                        currency: {
                          type: "string",
                          const: "INR"
                        },
                        transaction_id: {
                          type: "string"
                        },
                        bank_account_number: {
                          type: "string"
                        },
                        bank_code: {
                          type: "string"
                        },
                        source_bank_account_number: {
                          type: "string"
                        },
                        source_bank_code: {
                          type: "string"
                        }
                      },
                      required: ["amount", "currency"]
                    },
                    status: {
                      type: "string",
                      enum: ["PAID", "NOT-PAID"]
                    },
                    time: {
                      type: "object",
                      properties: {
                        label: {
                          type: "string",
                          enum: ["FORECLOSURE", "INSTALLMENT"]
                        },
                        range: {
                          type: "object",
                          properties: {
                            start: {
                              type: "string",
                              format: "date-time"
                            },
                            end: {
                              type: "string",
                              format: "date-time"
                            }
                          },
                          required: ["start", "end"]
                        },
                        timestamp: {
                          type: "string",
                          format: "date-time"
                        }
                      }
                    },
                    type: {
                      type: "string",
                      enum: ["PRE-ORDER", "ON-ORDER", "POST-FULFILLMENT"]
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                const: "BREAKUP"
                              },
                              name: {
                                type: "string"
                              }
                            },
                            required: ["code", "name"]
                          },
                          list: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                descriptor: {
                                  type: "object",
                                  properties: {
                                    code: {
                                      type: "string",
                                      enum: ["PRINCIPAL_AMOUNT", "INTEREST_AMOUNT"]
                                    },
                                    name: {
                                      type: "string"
                                    }
                                  },
                                  required: ["code"]
                                },
                                value: {
                                  type: "string"
                                }
                              },
                              required: ["descriptor", "value"]
                            }
                          }
                        },
                        required: ["descriptor", "list"]
                      }
                    }
                  },
                  required: ["id", "params", "status", "type"]
                }
              },
              cancellation_terms: {
                type: "array",
                items: {
                  type: "object",
                  anyOf: [
                    {
                      properties: {
                        fulfillment_state: {
                          type: "object",
                          properties: {
                            descriptor: {
                              type: "object",
                              properties: {
                                code: {
                                  type: "string",
                                  const: "SANCTIONED"
                                }
                              },
                              required: ["code"]
                            }
                          },
                          required: ["descriptor"]
                        },
                        cancellation_fee: {
                          type: "object",
                          properties: {
                            percentage: {
                              type: "string"
                            }
                          },
                          required: ["percentage"]
                        }
                      },
                      required: ["fulfillment_state", "cancellation_fee"]
                    },
                    {
                      properties: {
                        external_ref: {
                          type: "object",
                          properties: {
                            mimetype: {
                              type: "string"
                            },
                            url: {
                              type: "string",
                              format: "uri"
                            }
                          },
                          required: ["mimetype", "url"]
                        }
                      },
                      required: ["external_ref"]
                    }
                  ]
                }
              },
              documents: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                          enum: ["LOAN_AGREEMENT", "LOAN_CANCELLATION"]
                        },
                        name: {
                          type: "string"
                        },
                        short_desc: {
                          type: "string"
                        },
                        long_desc: {
                          type: "string"
                        }
                      },
                      required: ["code", "name"]
                    },
                    mime_type: {
                      type: "string"
                    },
                    url: {
                      type: "string",
                      format: "uri"
                    }
                  },
                  required: ["descriptor", "mime_type", "url"]
                }
              },
              fulfillments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string"
                    },
                    customer: {
                      type: "object",
                      properties: {
                        person: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string"
                            },
                            dob: {
                              type: "string"
                            },
                            gender: {
                              type: "string"
                            },
                            creds: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: {
                                    type: "string"
                                  },
                                  type: {
                                    type: "string"
                                  }
                                },
                                required: ["id", "type"]
                              }
                            }
                          },
                          required: ["name"]
                        },
                        contact: {
                          type: "object",
                          properties: {
                            email: {
                              type: "string"
                            },
                            phone: {
                              type: "string"
                            }
                          },
                          required: ["email", "phone"]
                        }
                      },
                      required: ["person", "contact"]
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                const: "CHECKLISTS"
                              },
                              name: {
                                type: "string"
                              }
                            },
                            required: ["code", "name"]
                          },
                          list: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                descriptor: {
                                  type: "object",
                                  properties: {
                                    code: {
                                      type: "string",
                                      enum: ["KYC", "E_SIGN"]
                                    },
                                    name: {
                                      type: "string"
                                    }
                                  },
                                  required: ["code"]
                                },
                                value: {
                                  type: "string"
                                }
                              },
                              required: ["descriptor", "value"]
                            }
                          }
                        },
                        required: ["descriptor", "list"]
                      }
                    }
                  },
                  required: ["id", "customer", "tags"]
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
                        code: {
                          type: "string",
                          enum: ["BAP_TERMS", "BPP_TERMS"]
                        },
                        name: {
                          type: "string"
                        }
                      },
                      required: ["code", "name"]
                    },
                    list: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: [
                                  "BUYER_FINDER_FEES_TYPE",
                                  "BUYER_FINDER_FEES_PERCENTAGE",
                                  "SETTLEMENT_TYPE",
                                  "DELAY_INTEREST",
                                  "STATIC_TERMS",
                                  "OFFLINE_CONTRACT",
                                  "SETTLEMENT_WINDOW",
                                  "SETTLEMENT_BASIS",
                                  "MANDATORY_ARBITRATION",
                                  "COURT_JURISDICTION",
                                  "SETTLEMENT_AMOUNT"
                                ]
                              }
                            },
                            required: ["code"]
                          },
                          value: {
                            type: "string"
                          }
                        },
                        required: ["descriptor", "value"]
                      }
                    },
                    display: {
                      type: "boolean"
                    }
                  },
                  required: ["descriptor", "list"]
                }
              },
              created_at: {
                type: "string",
                format: "date-time"
              },
              updated_at: {
                type: "string",
                format: "date-time"
              }
            },
            required: ["id", "status", "provider", "quote", "items", "payments"]
          }
        },
        required: ["order"]
      }
    },
    required: ["context", "message"]
  };
export const onUpdateFIS14Schema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
        context: {
            type: 'object',
            required: [
                'domain', 'location', 'version', 'action', 'bap_id', 'bap_uri',
                'bpp_id', 'bpp_uri', 'transaction_id', 'message_id', 'timestamp', 'ttl'
            ],
            properties: {
                domain: { type: 'string', enum: ['ONDC:FIS14'] },
                location: {
                    type: 'object',
                    required: ['country', 'city'],
                    properties: {
                        country: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: { type: 'string' }
                            }
                        },
                        city: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: { type: 'string' }
                            }
                        }
                    }
                },
                version: { type: 'string' },
                action: { type: 'string', enum: ['on_update'] },
                bap_id: { type: 'string' },
                bap_uri: { type: 'string', format: 'uri' },
                bpp_id: { type: 'string' },
                bpp_uri: { type: 'string', format: 'uri' },
                transaction_id: { type: 'string' },
                message_id: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                ttl: { type: 'string', format: 'duration' }
            }
        },
        message: {
            type: 'object',
            required: ['order'],
            properties: {
                order: {
                    type: 'object',
                    required: ['id', 'status', 'provider', 'items', 'fulfillments', 'created_at', 'updated_at'],
                    properties: {
                        id: { type: 'string' },
                        ref_order_ids: { 
                            type: 'array',
                            items: { type: 'string' }
                        },
                        status: { 
                            type: 'string', 
                            enum: ['ACCEPTED', 'COMPLETED', 'CANCELLED'] 
                        },
                        provider: {
                            type: 'object',
                            required: ['id', 'descriptor'],
                            properties: {
                                id: { type: 'string' },
                                descriptor: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: { type: 'string' }
                                    }
                                }
                            }
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id', 'descriptor', 'quantity', 'fulfillment_ids', 'tags'],
                                properties: {
                                    id: { type: 'string' },
                                    parent_item_id: { type: 'string' },
                                    descriptor: {
                                        type: 'object',
                                        required: ['name', 'code'],
                                        properties: {
                                            name: { type: 'string' },
                                            code: { type: 'string' }
                                        }
                                    },
                                    quantity: {
                                        type: 'object',
                                        required: ['selected'],
                                        properties: {
                                            selected: {
                                                type: 'object',
                                                required: ['measure'],
                                                properties: {
                                                    measure: {
                                                        type: 'object',
                                                        required: ['value', 'unit'],
                                                        properties: {
                                                            value: { type: 'string' },
                                                            unit: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            },
                                            allocated: {
                                                type: 'object',
                                                properties: {
                                                    measure: {
                                                        type: 'object',
                                                        required: ['value', 'unit'],
                                                        properties: {
                                                            value: { type: 'string' },
                                                            unit: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    fulfillment_ids: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                    payment_ids: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                    tags: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            required: ['descriptor', 'list'],
                                            properties: {
                                                display: { type: 'boolean' },
                                                descriptor: {
                                                    type: 'object',
                                                    required: ['name', 'code'],
                                                    properties: {
                                                        name: { type: 'string' },
                                                        code: { type: 'string' }
                                                    }
                                                },
                                                list: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        required: ['descriptor', 'value'],
                                                        properties: {
                                                            descriptor: {
                                                                type: 'object',
                                                                properties: {
                                                                    name: { type: 'string' },
                                                                    code: { type: 'string' }
                                                                }
                                                            },
                                                            value: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    price: {
                                        type: 'object',
                                        properties: {
                                            currency: { type: 'string' },
                                            value: { type: 'string' },
                                            listed_value: { type: 'string' }
                                        }
                                    },
                                    time: {
                                        type: 'object',
                                        properties: {
                                            label: { type: 'string' },
                                            timestamp: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        },
                        fulfillments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id', 'type', 'customer', 'state'],
                                properties: {
                                    id: { type: 'string' },
                                    type: { 
                                        type: 'string',
                                        enum: ['SIP', 'SIP_INSTALMENT', 'LUMPSUM', 'REDEMPTION']
                                    },
                                    customer: {
                                        type: 'object',
                                        required: ['person', 'contact'],
                                        properties: {
                                            person: {
                                                type: 'object',
                                                required: ['id'],
                                                properties: {
                                                    id: { type: 'string' },
                                                    creds: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            required: ['id', 'type'],
                                                            properties: {
                                                                id: { type: 'string' },
                                                                type: { type: 'string' }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            contact: {
                                                type: 'object',
                                                required: ['phone'],
                                                properties: {
                                                    phone: { type: 'string' }
                                                }
                                            }
                                        }
                                    },
                                    agent: {
                                        type: 'object',
                                        properties: {
                                            person: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string' }
                                                }
                                            },
                                            organization: {
                                                type: 'object',
                                                properties: {
                                                    creds: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            required: ['id', 'type'],
                                                            properties: {
                                                                id: { type: 'string' },
                                                                type: { type: 'string' }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    stops: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                time: {
                                                    type: 'object',
                                                    properties: {
                                                        schedule: {
                                                            type: 'object',
                                                            properties: {
                                                                frequency: { type: 'string' }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    state: {
                                        type: 'object',
                                        required: ['descriptor'],
                                        properties: {
                                            descriptor: {
                                                type: 'object',
                                                required: ['name', 'code'],
                                                properties: {
                                                    name: { type: 'string' },
                                                    code: { type: 'string' }
                                                }
                                            }
                                        }
                                    },
                                    tags: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                display: { type: 'boolean' },
                                                descriptor: {
                                                    type: 'object',
                                                    required: ['name', 'code'],
                                                    properties: {
                                                        name: { type: 'string' },
                                                        code: { type: 'string' }
                                                    }
                                                },
                                                list: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            descriptor: {
                                                                type: 'object',
                                                                properties: {
                                                                    name: { type: 'string' },
                                                                    code: { type: 'string' }
                                                                }
                                                            },
                                                            value: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        payments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id', 'collected_by', 'status', 'type'],
                                properties: {
                                    id: { type: 'string' },
                                    collected_by: { type: 'string' },
                                    status: { 
                                        type: 'string',
                                        enum: ['PAID', 'NOT-PAID', 'FAILED']
                                    },
                                    url: { type: 'string' },
                                    params: {
                                        type: 'object',
                                        properties: {
                                            amount: { type: 'string' },
                                            currency: { type: 'string' },
                                            source_bank_code: { type: 'string' },
                                            source_bank_account_number: { type: 'string' },
                                            source_bank_account_name: { type: 'string' },
                                            transaction_id: { type: 'string' }
                                        }
                                    },
                                    type: { type: 'string' },
                                    tags: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                descriptor: {
                                                    type: 'object',
                                                    properties: {
                                                        name: { type: 'string' },
                                                        code: { type: 'string' }
                                                    }
                                                },
                                                list: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            descriptor: {
                                                                type: 'object',
                                                                properties: {
                                                                    name: { type: 'string' },
                                                                    code: { type: 'string' }
                                                                }
                                                            },
                                                            value: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        quote: {
                            type: 'object',
                            required: ['id', 'price', 'breakup'],
                            properties: {
                              id: { type: 'string' },
                              price: {
                                type: 'object',
                                required: ['currency', 'value'],
                                properties: {
                                  currency: { type: 'string' },
                                  value: { type: 'string' }
                                },
                                additionalProperties: false
                              },
                              breakup: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  required: ['item', 'title', 'price'],
                                  properties: {
                                    item: {
                                      type: 'object',
                                      required: ['id', 'fulfillment_ids'],
                                      properties: {
                                        id: { type: 'string' },
                                        fulfillment_ids: {
                                          type: 'array',
                                          items: { type: 'string' }
                                        }
                                      },
                                      additionalProperties: false
                                    },
                                    title: { type: 'string' },
                                    price: {
                                      type: 'object',
                                      required: ['currency', 'value'],
                                      properties: {
                                        currency: { type: 'string' },
                                        value: { type: 'string' }
                                      },
                                      additionalProperties: false
                                    }
                                  },
                                  additionalProperties: false
                                }
                              }
                            },
                            additionalProperties: false
                          },
                          created_at: { type: 'string', format: 'date-time' },
                          updated_at: { type: 'string', format: 'date-time' }
                        },
                        additionalProperties: false
                      }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              };
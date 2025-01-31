const newReconPayloadSchema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
        context: {
            type: 'object',
            required: [
                'domain',
                'location',
                'action',
                'version',
                'bap_id',
                'bap_uri',
                'bpp_id',
                'bpp_uri',
                'transaction_id',
                'message_id',
                'timestamp',
                'ttl',
                'key',
            ],
            properties: {
                domain: {
                    type: 'string',
                },
                location: {
                    type: 'object',
                    required: ['country', 'city'],
                    properties: {
                        country: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: {
                                    type: 'string',
                                    enum: ['IND'],
                                },
                            },
                        },
                        city: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
                action: {
                    type: 'string',
                },
                version: {
                    type: 'string',
                },
                bap_id: {
                    type: 'string',
                },
                bap_uri: {
                    type: 'string',
                    format: 'uri',
                    errorMessage: 'Invalid BAP URI format',
                },
                bpp_id: {
                    type: 'string',
                },
                bpp_uri: {
                    type: 'string',
                    format: 'uri',
                    errorMessage: 'Invalid BPP URI format',
                },
                transaction_id: {
                    type: 'string',
                },
                message_id: {
                    type: 'string',
                },
                timestamp: {
                    type: 'string',
                    format: 'rfc3339-date-time',
                    errorMessage: 'Timestamp must be in RFC3339 format',
                },
                ttl: {
                    type: 'string',
                },
                key: {
                    type: 'string',
                },
            },
        },
        message: {
            type: 'object',
            required: ['orders'],
            properties: {
                orders: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['id', 'amount', 'recon_accord', 'settlements'],
                        properties: {
                            id: {
                                type: 'string',
                            },
                            amount: {
                                type: 'object',
                                required: ['currency', 'value'],
                                properties: {
                                    currency: {
                                        type: 'string',
                                        enum: ['INR'],
                                    },
                                    value: {
                                        type: 'string',
                                    },
                                },
                            },
                            recon_accord: {
                                type: 'boolean',
                            },
                            settlements: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    required: [
                                        'id',
                                        'payment_id',
                                        'status',
                                        'amount',
                                        'commission',
                                        'withholding_amount',
                                        'tcs',
                                        'tds',
                                        'updated_at',
                                        'settlement_ref_no',
                                    ],
                                    properties: {
                                        id: {
                                            type: 'string',
                                        },
                                        payment_id: {
                                            type: 'string',
                                        },
                                        status: {
                                            type: 'string',
                                        },
                                        amount: {
                                            type: 'object',
                                            required: ['diff_value', 'currency', 'value'],
                                            properties: {
                                                diff_value: {
                                                    type: 'string',
                                                },
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        commission: {
                                            type: 'object',
                                            required: ['diff_value', 'currency', 'value'],
                                            properties: {
                                                diff_value: {
                                                    type: 'string',
                                                },
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        withholding_amount: {
                                            type: 'object',
                                            required: ['diff_value', 'currency', 'value'],
                                            properties: {
                                                diff_value: {
                                                    type: 'string',
                                                },
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        tcs: {
                                            type: 'object',
                                            required: ['diff_value', 'currency', 'value'],
                                            properties: {
                                                diff_value: {
                                                    type: 'string',
                                                },
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        tds: {
                                            type: 'object',
                                            required: ['diff_value', 'currency', 'value'],
                                            properties: {
                                                diff_value: {
                                                    type: 'string',
                                                },
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                        updated_at: {
                                            type: 'string',
                                            format: 'rfc3339-date-time',
                                            errorMessage: 'Invalid date-time format',
                                        },
                                        settlement_ref_no: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                        minItems: 1,
                    },
                },
            },
        },
    },
    additionalProperties: false, 
};

export default newReconPayloadSchema;

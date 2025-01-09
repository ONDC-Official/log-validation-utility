const newPayloadSchema = {
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
                },
                bpp_id: {
                    type: 'string',
                },
                bpp_uri: {
                    type: 'string',
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
                    errorMessage: 'Timestamp must be in RFC3339 format.',
                },
                ttl: {
                    type: 'string',
                    format: 'duration', 
                    errorMessage: 'TTL must be in RFC3339 duration format.',
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
                        required: ['id', 'amount', 'settlements'],
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
                                        pattern: '^[0-9]+(\\.[0-9]{1,2})?$', 
                                    },
                                },
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
                                            required: ['currency', 'value'],
                                            properties: {
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                                                },
                                            },
                                        },
                                        commission: {
                                            type: 'object',
                                            required: ['currency', 'value'],
                                            properties: {
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                                                },
                                            },
                                        },
                                        withholding_amount: {
                                            type: 'object',
                                            required: ['currency', 'value'],
                                            properties: {
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                                                },
                                            },
                                        },
                                        tcs: {
                                            type: 'object',
                                            required: ['currency', 'value'],
                                            properties: {
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                                                },
                                            },
                                        },
                                        tds: {
                                            type: 'object',
                                            required: ['currency', 'value'],
                                            properties: {
                                                currency: {
                                                    type: 'string',
                                                    enum: ['INR'],
                                                },
                                                value: {
                                                    type: 'string',
                                                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                                                },
                                            },
                                        },
                                        updated_at: {
                                            type: 'string',
                                            format: 'rfc3339-date-time', 
                                        },
                                        settlement_ref_no: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default newPayloadSchema;

const onReportSchema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
        context: {
            type: 'object',
            required: [
                'domain',
                'action',
                'country',
                'core_version',
                'bap_id',
                'bap_uri',
                'bpp_id',
                'bpp_uri',
                'transaction_id',
                'message_id',
                'timestamp',
                'ttl',
                'city',
            ],
            properties: {
                domain: {
                    type: 'string',
                    enum: ['ONDC:NTS10'],
                },
                action: {
                    type: 'string',
                    enum: ['on_report'],
                },
                country: {
                    type: 'string',
                    enum: ['IND'],
                },
                core_version: {
                    type: 'string',
                    enum: ['2.0.0'],
                },
                bap_id: {
                    type: 'string',
                    enum: ['collectorapp.com'],
                },
                bap_uri: {
                    type: 'string',
                    format: 'uri',
                },
                bpp_id: {
                    type: 'string',
                    enum: ['sa_nocs.nbbl.com'],
                },
                bpp_uri: {
                    type: 'string',
                    format: 'uri',
                },
                transaction_id: {
                    type: 'string',
                },
                message_id: {
                    type: 'string',
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                },
                ttl: {
                    type: 'string',
                },
                city: {
                    type: 'string',
                    enum: ['*'],
                },
            },
        },
        message: {
            type: 'object',
            required: ['collector_app_id', 'receiver_app_id', 'settlement'],
            properties: {
                collector_app_id: {
                    type: 'string',
                    enum: ['collectorapp.com'],
                },
                receiver_app_id: {
                    type: 'string',
                    enum: ['receiverapp.com'],
                },
                settlement: {
                    oneOf: [
                        {
                            if: {
                                properties: { type: { const: 'NIL' } },
                            },
                            then: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', const: 'NIL' },
                                },
                                required: ['type'],
                            },
                        },
                        {
                            if: {
                                properties: { type: { enum: ['NP-NP', 'MISC'] } },
                            },
                            then: {
                                type: 'object',
                                required: ['type', 'id', 'orders'],
                                properties: {
                                    type: { type: 'string', enum: ['NP-NP', 'MISC'] },
                                    id: { type: 'string' },
                                    orders: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            required: ['id', 'inter_participant', 'collector', 'provider', 'self'],
                                            properties: {
                                                id: { type: 'string' },
                                                inter_participant: {
                                                    type: 'object',
                                                    required: ['settled_amount', 'amount', 'status', 'reference_no', 'error'],
                                                    properties: {
                                                        settled_amount: {
                                                            type: 'object',
                                                            required: ['currency', 'value'],
                                                            properties: {
                                                                currency: { type: 'string', enum: ['INR'] },
                                                                value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
                                                            },
                                                        },
                                                        amount: {
                                                            type: 'object',
                                                            required: ['currency', 'value'],
                                                            properties: {
                                                                currency: { type: 'string', enum: ['INR'] },
                                                                value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
                                                            },
                                                        },
                                                        status: { type: 'string' },
                                                        reference_no: { type: 'string' },
                                                        error: {
                                                            type: 'object',
                                                            required: ['code', 'message'],
                                                            properties: {
                                                                code: { type: 'string' },
                                                                message: { type: 'string' },
                                                            },
                                                        },
                                                    },
                                                },
                                                collector: {
                                                    type: 'object',
                                                    required: ['amount'],
                                                    properties: {
                                                        amount: {
                                                            type: 'object',
                                                            required: ['currency', 'value'],
                                                            properties: {
                                                                currency: { type: 'string', enum: ['INR'] },
                                                                value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
                                                            },
                                                        },
                                                    },
                                                },
                                                provider: {
                                                    type: 'object',
                                                    required: ['id', 'amount', 'status', 'reference_no', 'error'],
                                                    properties: {
                                                        id: { type: 'string' },
                                                        amount: {
                                                            type: 'object',
                                                            required: ['currency', 'value'],
                                                            properties: {
                                                                currency: { type: 'string', enum: ['INR'] },
                                                                value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
                                                            },
                                                        },
                                                        status: { type: 'string' },
                                                        error: {
                                                            type: 'object',
                                                            required: ['code', 'message'],
                                                            properties: {
                                                                code: { type: 'string' },
                                                                message: { type: 'string' },
                                                            },
                                                        },
                                                        reference_no: { type: 'string' },
                                                    },
                                                },
                                                self: {
                                                    type: 'object',
                                                    required: ['amount', 'status', 'reference_no', 'error'],
                                                    properties: {
                                                        amount: {
                                                            type: 'object',
                                                            required: ['currency', 'value'],
                                                            properties: {
                                                                currency: { type: 'string', enum: ['INR'] },
                                                                value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
                                                            },
                                                        },
                                                        status: { type: 'string' },
                                                        reference_no: { type: 'string' },
                                                        error: {
                                                            type: 'object',
                                                            required: ['code', 'message'],
                                                            properties: {
                                                                code: { type: 'string' },
                                                                message: { type: 'string' },
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
                    ],
                },
            },
        },
    },
    additionalProperties: false,
};

export default onReportSchema;

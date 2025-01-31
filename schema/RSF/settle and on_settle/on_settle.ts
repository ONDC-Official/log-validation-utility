const currencyValueObject = {
    type: 'object',
    required: ['currency', 'value'],
    properties: {
        currency: { type: 'string', enum: ['INR'] },
        value: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
    },
};

const errorObject = {
    type: 'object',
    required: ['code', 'message'],
    properties: {
        code: { type: 'string' },
        message: { type: 'string' },
    },
};

const onSettleSchema = {
    type: 'object',
    required: ['context', 'message'],
    properties: {
        context: {
            type: 'object',
            required: [
                'domain', 'location', 'core_version', 'action', 'bap_id', 'bap_uri',
                'bpp_id', 'bpp_uri', 'transaction_id', 'message_id', 'timestamp', 'ttl'
            ],
            properties: {
                domain: { type: 'string', enum: ['ONDC:NTS10'] },
                location: {
                    type: 'object',
                    required: ['country', 'city'],
                    properties: {
                        country: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: { type: 'string', enum: ['IND'] },
                            },
                        },
                        city: {
                            type: 'object',
                            required: ['code'],
                            properties: {
                                code: { type: 'string', enum: ['*'] },
                            },
                        },
                    },
                },
                core_version: { type: 'string', enum: ['2.0.0'] },
                action: { type: 'string', enum: ['on_settle'] },
                bap_id: { type: 'string' },
                bap_uri: { type: 'string' },
                bpp_id: { type: 'string' },
                bpp_uri: { type: 'string' },
                transaction_id: { type: 'string' },
                message_id: { type: 'string' },
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
        },
        message: {
            type: 'object',
            properties: {
                collector_app_id: { type: 'string' },
                receiver_app_id: { type: 'string' },
                settlement: {
                    oneOf: [
                        {
                            if: { properties: { type: { const: 'NIL' } } },
                            then: {
                                type: 'object',
                                properties: { type: { type: 'string', const: 'NIL' } },
                                required: ['type'],
                            },
                        },
                        {
                            if: { properties: { type: { enum: ['NP-NP', 'MISC'] } } },
                            then: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', enum: ['NP-NP', 'MISC'] },
                                    id: { type: 'string' },
                                    orders: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                provider: {
                                                    type: 'object',
                                                    required: ['id', 'name', 'bank_details', 'amount'],
                                                    properties: {
                                                        id: { type: 'string' },
                                                        name: { type: 'string' },
                                                        bank_details: {
                                                            type: 'object',
                                                            required: ['account_no', 'ifsc_code'],
                                                            properties: {
                                                                account_no: {
                                                                    type: 'string',
                                                                    pattern: '^[0-9]{9,18}$',
                                                                },
                                                                ifsc_code: {
                                                                    type: 'string',
                                                                    pattern: '^[A-Z]{4}0[A-Z0-9]{6}$',
                                                                },
                                                            },
                                                        },
                                                        amount: currencyValueObject,
                                                    },
                                                },
                                                inter_participant: {
                                                    type: 'object',
                                                    required: ['amount'],
                                                    properties: {
                                                        amount: currencyValueObject,
                                                    },
                                                },
                                                collector: {
                                                    type: 'object',
                                                    required: ['amount'],
                                                    properties: {
                                                        amount: currencyValueObject,
                                                    },
                                                },
                                                self: {
                                                    type: 'object',
                                                    required: ['amount', 'status', 'reference_no'],
                                                    properties: {
                                                        amount: currencyValueObject,
                                                        status: { type: 'string', enum: ['SETTLED', 'NOT-SETTLED'] },
                                                        reference_no: { type: 'string' },
                                                        error: errorObject,
                                                    },
                                                },
                                            },
                                            required: ['id', 'self'],
                                        },
                                    },
                                },
                                required: ['type', 'id', 'orders'],
                            },
                        },
                    ],
                },
            },
        },
    },
};

export default onSettleSchema;

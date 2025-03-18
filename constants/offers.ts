// to be utilized

export const offers = {
    discount: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: false,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value: true,
            value_type: true,
            value_cap: false,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },
    buyXgetY: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: true,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value: false,
            value_type: false,
            value_cap: false,
            item_count: true,
            item_id: false,
            item_value: false,
        },
    },
    freebie: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: false,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value: false,
            value_type: false,
            value_cap: false,
            item_count: true,
            item_id: true,
            item_value: false,
        },
    },
    slab: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: true,
            item_count_upper: true,
            item_id: false,
        },
        benefit: {
            value: true,
            value_type: true,
            value_cap: true,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },
    combo: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: true,
            item_count_upper: false,
            item_id: true,
        },
        benefit: {
            value: true,
            value_type: true,
            value_cap: true,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },
    delivery: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: false,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value: true,
            value_type: true,
            value_cap: false,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },
    exchange: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: false,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value:false,
            value_type: false,
            value_cap: false,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },
    financing: {
        mandatory: true,
        qualifier: {
            min_value: false,
            item_count: false,
            item_count_upper: false,
            item_id: false,
        },
        benefit: {
            value:false,
            value_type: false,
            value_cap: false,
            item_count: false,
            item_id: false,
            item_value: false,
        },
    },  
}
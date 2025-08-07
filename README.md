# ONDC Log Validation Utility

The ONDC Log Validation Utility is a comprehensive tool designed to validate transaction logs across multiple domains on the ONDC (Open Network for Digital Commerce) network. This utility ensures the accuracy and integrity of transaction data by validating API payloads against ONDC specifications.

## Supported Domains

The utility supports validation for the following ONDC domains:

- **Retail (RET10-19)**: E-commerce transactions with versions 1.2.0 and 1.2.5
- **Finance (FIS10-14)**: Credit, loans, insurance, and mutual funds
- **Travel (TRV10-14)**: Mobility, metro, hotels, airlines, and bus services
- **IGM**: Issue & Grievance Management (versions 1.0.0 and 2.0.0)
- **RSF**: Reconciliation & Settlement Framework (versions 1.0.0 and 2.0.0)

## Log Validation Service

The service is hosted at [https://log-validation.ondc.org](https://log-validation.ondc.org) and provides API endpoints for validating transaction logs across all supported domains.

## Retail Domain

### Supported Versions

### Retail Version 1.2.0

- **Basic e-commerce flows**: Standard order lifecycle management
- **Supported flows**: 1, 2, 2A, 3, 4, 5, 6, 7, 8, 9
- **Status tracking**: Basic fulfillment states
- **No routing type concept**

### Retail Version 1.2.5

- **All v1.2.0 features** plus enhanced capabilities
- **30+ supported flows**: Including special order flows, offer flows, and advanced scenarios
- **Routing types**: P2P (hyperlocal) and P2H2P (intercity) delivery models
- **Enhanced status tracking**: Granular fulfillment states based on routing type
- **Additional flows**:
  - Special order flows: 002, 005, 010, 011, 012, 015, 017, 019, 01D, 01E, 00C, 00D, 00F
  - Offer flows: 0091-0098
  - Other flows: 001, 003, 004, 008, 00A, 00B, 00E, 016, 01C, 01F, 020, 022, 025

## Log Validation Service Usage

The service is hosted at [https://log-validation.ondc.org](https://log-validation.ondc.org). You can validate API logs using curl or Postman requests.

### Example for Version 1.2.0

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "2"
}'
```

### Example for Version 1.2.5

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_agent_assigned": {},
        "on_status_at_pickup": {},
        "on_status_out_for_pickup": {},
        "on_status_pickup_failed": {},
        "on_status_picked": {},
        "on_status_at_delivery": {},
        "on_status_in_transit": {},
        "on_status_at_destination_hub": {},
        "on_status_out_for_delivery": {},
        "on_status_delivery_failed": {},
        "on_status_delivered": {}
    },
    "flow": "2"
}'
```

**Important for v1.2.5**: Include ALL possible `on_status_*` calls in the payload. The validation utility will automatically validate only the required states based on the routing type (P2P or P2H2P) specified in the order.

## Flow Reference by Version

### Version 1.2.0 Supported Flows

| Flow ID | Name                          | Description                                       |
| ------- | ----------------------------- | ------------------------------------------------- |
| 1       | Search and Incremental Search | Full catalog refresh and incremental updates      |
| 2       | Complete Order with Delivery  | Standard e-commerce order from search to delivery |
| 2A      | Complete Order with COD       | Similar to Flow 2 with COD payment                |
| 3       | Out of Stock Recovery         | Handle out of stock items and reselection         |
| 4       | Order Cancellation            | Cancel order before fulfillment                   |
| 5       | RTO with Partial Cancellation | Return to origin after partial cancellation       |
| 6       | Liquidated Order              | Handle liquidation/disposal of orders             |
| 7       | Catalog Rejection             | Reject catalog after search                       |
| 8       | Search Only                   | Check if catalog fixed                            |
| 9       | Incremental Search Rejection  | Reject incremental catalog update                 |

### Version 1.2.5 Additional Flows

Version 1.2.5 supports all v1.2.0 flows plus the following:

| Flow ID   | Name                           | Description                               |
| --------- | ------------------------------ | ----------------------------------------- |
| 001-025   | Various Special Flows          | Additional business scenarios             |
| 002       | Self-Pickup                    | Customer picks up order from store        |
| 005       | Force Cancel                   | Seller-initiated cancellation             |
| 010       | Delivery with Authentication   | OTP/code verification at delivery         |
| 011       | Update Delivery Instructions   | Modify delivery details post-confirmation |
| 012       | Cash on Delivery (COD)         | Payment on delivery                       |
| 015       | Simple Liquidation             | Basic liquidation without reverse QC      |
| 017       | Post-Delivery Update           | Updates after delivery completion         |
| 019       | P2P with Tracking              | Hyperlocal with live tracking             |
| 01D       | Order Till Pending             | Pre-orders or awaiting inventory          |
| 01E       | Orders with Cancellation Terms | Mandatory cancellation terms              |
| 00C       | Replacement                    | Replace defective items                   |
| 00D       | Post-Delivery Cancellation     | Returns process                           |
| 00F       | Scheduled Delivery             | Time slot based delivery                  |
| 0091-0098 | Offer Flows                    | Various promotional offers                |

## Retail 1.2.5 Routing Types and Fulfillment States

Starting from retail version 1.2.5, the ONDC network supports two routing types for order fulfillment:

### P2P (Point-to-Point) - Hyperlocal Delivery

P2P routing is used for hyperlocal deliveries where orders are delivered directly from pickup to delivery location without intermediate hubs.

**Required States:**

- `Pending` - Order is confirmed and pending processing
- `Packed` - Order items are packed and ready
- `Order-picked-up` - Order has been picked up by delivery agent
- `Order-delivered` - Order has been delivered to customer

**Optional States:**

- `Agent-assigned` - Delivery agent has been assigned
- `At-pickup` - Delivery agent has arrived at pickup location
- `At-delivery` - Delivery agent has arrived at delivery location

**Forbidden States:**

- `Out-for-pickup`, `Pickup-failed`, `In-transit`, `At-destination-hub`, `Out-for-delivery`, `Delivery-failed`

### P2H2P (Point-to-Hub-to-Point) - Intercity Delivery

P2H2P routing is used for intercity deliveries where orders go through intermediate hubs.

**Required States:**

- `Pending` - Order is confirmed and pending processing
- `Packed` - Order items are packed and ready
- `Order-picked-up` - Order has been picked up from seller
- `In-transit` - Order is in transit to destination hub
- `At-destination-hub` - Order has reached destination hub
- `Out-for-delivery` - Order is out for final delivery
- `Order-delivered` - Order has been delivered to customer

**Optional States:**

- `Agent-assigned` - Delivery agent has been assigned
- `Out-for-pickup` - Agent is out to pickup the order
- `Pickup-failed` - Pickup attempt failed
- `Delivery-failed` - Delivery attempt failed

**Forbidden States:**

- `At-pickup`, `At-delivery`

### Routing Type Determination

The routing type is extracted from the delivery fulfillment's tags:

```json
{
  "fulfillments": [{
    "type": "Delivery",
    "tags": [{
      "code": "routing",
      "list": [{
        "code": "type",
        "value": "P2P"  // or "P2H2P"
      }]
    }]
  }]
}
```

**Default Routing:**

- **RET11 (Food & Beverage):** Defaults to P2P (hyperlocal)
- **All other retail domains:** Default to P2H2P (intercity)

## Complete Retail Flow Reference

### Understanding Flow-Based Validation with Routing Types

**Important:** The validation system is flow-based, where each flow defines a specific sequence of API calls. For version 1.2.5, the `on_status` validation within each flow uses routing types (P2P or P2H2P) to determine which status updates are valid.

- **Flows** define the sequence of APIs (search → on_search → select → on_select → init → on_init → confirm → on_confirm → status updates)
- **Routing types** (P2P/P2H2P) determine which `on_status` calls are validated within each flow
- All flows should include ALL possible `on_status_*` calls in the payload; the utility validates only the appropriate ones based on routing

### Standard Flows (1-9)

**Flow 1 - Search and Incremental Search**

- Purpose: Full catalog refresh and incremental updates
- Sequence: `search` → `on_search` → `search_inc` → `on_search_inc`

**Flow 2 - Complete Order with Delivery**

- Purpose: Standard e-commerce order from search to delivery
- Sequence: `search` → `on_search` → `select` → `on_select` → `init` → `on_init` → `confirm` → `on_confirm` → all `on_status_*` calls → `track` → `on_track`

**Flow 3 - Out of Stock Recovery**

- Purpose: Handle out of stock items and reselection
- Sequence: `search` → `on_search` → `select_out_of_stock` → `on_select_out_of_stock` → `select` → `on_select` → `init` → `on_init` → `confirm` → `on_confirm` → all `on_status_*` calls → `track` → `on_track`

**Flow 4 - Order Cancellation**

- Purpose: Cancel order before fulfillment
- Sequence: `search` → `on_search` → `select` → `on_select` → `init` → `on_init` → `confirm` → `on_confirm` → `cancel` → `on_cancel`

**Flow 5 - RTO with Partial Cancellation**

- Purpose: Return to origin after partial cancellation
- Sequence: Full order flow + `on_update_part_cancel` → `update_settlement_part_cancel` → delivery statuses → `on_cancel` → `on_status_rto_delivered`

**Flow 6 - Liquidated Order**

- Purpose: Handle liquidation/disposal of orders
- Sequence: Full order flow + `update_liquidated` → `on_update_interim_liquidated` → `on_update_liquidated` → `update_settlement_liquidated`

**Flow 7 - Catalog Rejection**

- Purpose: Reject catalog after search
- Sequence: `search` → `on_search` → `catalog_rejection`

**Flow 8 - Search Only**

- Purpose: Browse catalog without ordering
- Sequence: `search` → `on_search`

**Flow 9 - Incremental Search Rejection**

- Purpose: Reject incremental catalog update
- Sequence: `search_inc` → `on_search_inc` → `catalog_rejection`

### Special Order Flows

**Flow 012 - Cash on Delivery (COD)**

- Purpose: Payment on delivery
- Sequence: Standard order flow with payment status updates in `on_status_delivered`
- Special: Payment settlement details provided in `confirm` instead of `on_init`

**Flow 002 - Self-Pickup**

- Purpose: Customer picks up order (kerbside/store pickup)
- Sequence: Order flow ending at `on_status_picked` (Order-picked-up state)

**Flow 005 - Force Cancel**

- Purpose: Seller-initiated cancellation
- Sequence: Order flow + `cancel` → `force_cancel` → `on_cancel`

**Flow 010 - Delivery with Authentication**

- Purpose: OTP/authentication required at delivery
- Sequence: Order flow + `on_update_delivery_auth` before `on_status_delivered`

**Flow 011 - Update Delivery Instructions**

- Purpose: Modify delivery instructions after order confirmation
- Sequence: Order flow + `update_instructions` → `on_update_instructions`

**Flow 015 - Simple Liquidation**

- Purpose: Basic liquidation flow
- Sequence: Complete delivery + liquidation updates

**Flow 017 - Post-Delivery Update**

- Purpose: Update order after delivery
- Sequence: Complete delivery + `on_update` → `on_cancel`

**Flow 019 - P2P with Tracking**

- Purpose: Hyperlocal delivery with live tracking
- Sequence: Uses `on_status_at_pickup` and `on_status_at_delivery` with `track`/`on_track`

**Flow 00C - Replacement (Partial)**

- Purpose: Item replacement flow
- Sequence: Complete delivery + `update_replacement` (commented sequences for full replacement)

**Flow 00D - Post-Delivery Return Cancellation**

- Purpose: Cancel return after delivery
- Sequence: Complete delivery + `cancel` → `on_cancel`

**Flow 00F - Scheduled Delivery**

- Purpose: Delivery with specific time slots
- Sequence: Standard order with scheduled fulfillment times

**Flow 01D - Options for multi-fulfillment orders**

- Purpose: Create order with options for multi-fulfillment orders
- Sequence: Order creation ending at `on_status_pending`

**Flow 01E - Orders with Cancellation Terms**

- Purpose: Orders requiring cancellation terms
- Special: `cancellation_terms` mandatory in `on_init`

### Offer Flows (0091-0098)

- **0091**: Discount offers
- **0092**: Freebie offers
- **0093**: Buy X Get Y offers
- **0094**: Delivery charge offers
- **0095**: Slab-based offers
- **0096**: Combo offers
- **0097**: Exchange offers
- **0098**: Financing offers

### P2P (Hyperlocal) Example - Food Delivery

This example shows a typical P2P flow for RET11 (Food & Beverage) domain where delivery happens directly from restaurant to customer:

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET11",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {
            "message": {
                "order": {
                    "fulfillments": [{
                        "type": "Delivery",
                        "tags": [{
                            "code": "routing",
                            "list": [{
                                "code": "type",
                                "value": "P2P"
                            }]
                        }]
                    }]
                }
            }
        },
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_agent_assigned": {},
        "on_status_at_pickup": {},
        "on_status_picked": {},
        "on_status_at_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "2"
}'
```

**Note for P2P**: The validation will accept `At-pickup` and `At-delivery` states but will reject `Out-for-pickup`, `Pickup-failed`, `In-transit`, `At-destination-hub`, `Out-for-delivery`, and `Delivery-failed` states.

### P2H2P (Intercity) Example - Fashion/Electronics Delivery

This example shows a typical P2H2P flow for RET12 (Fashion) or RET13 (Electronics) domain where delivery goes through hubs:

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET12",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {
            "message": {
                "order": {
                    "fulfillments": [{
                        "type": "Delivery",
                        "tags": [{
                            "code": "routing",
                            "list": [{
                                "code": "type",
                                "value": "P2H2P"
                            }]
                        }]
                    }]
                }
            }
        },
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_agent_assigned": {},
        "on_status_out_for_pickup": {},
        "on_status_pickup_failed": {},
        "on_status_picked": {},
        "on_status_in_transit": {},
        "on_status_at_destination_hub": {},
        "on_status_out_for_delivery": {},
        "on_status_delivery_failed": {},
        "on_status_delivered": {}
    },
    "flow": "2"
}'
```

**Note for P2H2P**: The validation will accept `Out-for-pickup`, `Pickup-failed`, `In-transit`, `At-destination-hub`, `Out-for-delivery`, and `Delivery-failed` states but will reject `At-pickup` and `At-delivery` states.

## Specific Flow Curl Examples

### Understanding the Curl Examples

**Important**: The examples below show the required API sequence for each flow with empty dictionaries (`{}`) as placeholders for the actual payload data.

**Key Points**:

1. **Empty Dictionaries**: Each `{}` represents where you need to insert the complete API payload with context and message objects
2. **API Sequence**: The validation utility primarily checks that APIs are called in the correct order for each flow
3. **Required Fields**: While shown as `{}`, each API call must include:
   - Complete `context` object with all required fields
   - Complete `message` object with flow-appropriate data
4. **Flow-Specific Data**: Some flows require specific data in certain API calls (highlighted in examples)
5. **Version 1.2.5**: Always include ALL `on_status_*` calls; the utility validates based on routing type

**Payload Structure**: Each `{}` should be replaced with:

```json
{
    "context": {
        "domain": "ONDC:RET10",
        "country": "IND",
        "city": "std:080",
        "action": "[action_name]",
        "core_version": "1.2.0",
        "bap_id": "buyer-app.ondc.org",
        "bap_uri": "https://buyer-app.ondc.org",
        "bpp_id": "seller-app.ondc.org",
        "bpp_uri": "https://seller-app.ondc.org",
        "transaction_id": "unique-transaction-id",
        "message_id": "unique-message-id",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "ttl": "PT30S"
    },
    "message": {
        // Flow-specific message content
    }
}
```

### Flow 2 - Complete Order with P2P Delivery (Hyperlocal) [v1.2.0, v1.2.5]

**Purpose**: Standard e-commerce order from search to delivery using hyperlocal (P2P) routing**When to use**: For orders delivered directly from store to customer without intermediate hubs**Key characteristics**:

- Uses P2P routing for hyperlocal delivery
- Includes optional states like `at_pickup` and `at_delivery`
- Complete order lifecycle with tracking

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET11",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_agent_assigned": {},
        "on_status_at_pickup": {},
        "on_status_picked": {},
        "on_status_at_delivery": {},
        "on_status_delivered": {},
        "track": {},
        "on_track": {}
    },
    "flow": "2"
}'
```

**Important Notes**:

- The `on_confirm` payload must include routing type as "P2P" in fulfillments tags
- P2P allows `at_pickup` and `at_delivery` states but forbids intercity states
- Track/on_track calls are optional but recommended for live tracking

### Flow 1 - Search and Incremental Search [v1.2.0, v1.2.5]

**Purpose**: Full catalog refresh followed by incremental catalog updates**When to use**: Initial catalog discovery and subsequent catalog updates**Key characteristics**:

- No order creation, only catalog browsing
- Supports both full and incremental search
- Used for keeping buyer app catalogs in sync

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "search_inc_refresh": {},
        "on_search_inc_refresh": {}
    },
    "flow": "1"
}'
```

**Important Notes**:

- `search_full_catalog_refresh` is for full catalog refresh (all products)
- `search_inc_refresh` is for incremental updates (changed products only)
- No order-related APIs in this flow
- Used to sync catalog without purchase intent

### Flow 012 - Cash on Delivery (COD) [v1.2.5 only]

**Purpose**: Order with payment collection at the time of delivery**When to use**: When customer chooses to pay in cash upon receiving the order**Key characteristics**:

- Payment type is "ON-FULFILLMENT"
- Settlement details provided in `confirm`, not `on_init`
- Payment status updated to "PAID" in `on_status_delivered`

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "012"
}'
```

**Important Notes**:

- `on_init` must have payment type as "ON-FULFILLMENT" but NO settlement details
- `confirm` must include complete settlement details
- `on_status_delivered` must update payment status to "PAID"
- This is the only flow where settlement details are in `confirm` instead of `on_init`

### Flow 002 - Self-Pickup (Kerbside/Store Pickup) [v1.2.5 only]

**Purpose**: Customer picks up the order from store/kerbside instead of delivery**When to use**: When customer prefers to collect order themselves**Key characteristics**:

- Fulfillment type is "Self-Pickup"
- Order completes at "Order-picked-up" state
- No delivery-related status updates

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {}
    },
    "flow": "002"
}'
```

**Important Notes**:

- `confirm` must specify fulfillment type as "Self-Pickup"
- Flow ends at `on_status_picked` with state "Order-picked-up"
- No delivery states (out_for_delivery, delivered) in this flow
- Order state becomes "Completed" when picked up

### Flow 01E - Orders with Cancellation Terms [v1.2.5 only]

**Purpose**: Orders that require explicit cancellation terms and fees**When to use**: For high-value items or custom orders where cancellation fees apply**Key characteristics**:

- Cancellation terms are MANDATORY in `on_init`
- Defines fees for cancellation at different fulfillment states
- Terms cannot be modified once set

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET13",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "01E"
}'
```

**Important Notes**:

- `on_init` MUST include `cancellation_terms` array
- Each term specifies fulfillment state and associated cancellation fee
- For other flows, cancellation terms are optional
- Once provided, terms must remain consistent across all subsequent calls

### Flow 4 - Order Cancellation [v1.2.0, v1.2.5]

**Purpose**: Cancel an order before fulfillment**When to use**: Customer wants to cancel order after confirmation but before delivery**Key characteristics**:

- Can be initiated by buyer (CONSUMER) or seller
- Requires valid cancellation reason code
- No status updates after cancellation

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "cancel": {},
        "on_cancel": {}
    },
    "flow": "4"
}'
```

**Important Notes**:

- `cancel` must include order_id and cancellation_reason_id
- `on_cancel` confirms cancellation and updates order state to "Cancelled"
- Cancellation may incur fees based on fulfillment state (see Flow 01E)
- No fulfillment status updates in this flow

### Flow 3 - Out of Stock Recovery [v1.2.0, v1.2.5]

**Purpose**: Handle scenarios where selected items are out of stock**When to use**: When items become unavailable between search and selection**Key characteristics**:

- Uses special `select_out_of_stock` API to handle unavailable items
- Allows re-selection with available items
- Complete order flow after stock resolution

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select_out_of_stock": {},
        "on_select_out_of_stock": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "track": {},
        "on_track": {}
    },
    "flow": "3"
}'
```

**Important Notes**:

- `on_select_out_of_stock` returns items with quantity 0 for out-of-stock items
- Requires a second `select` call with available items only
- Rest of the flow proceeds normally after stock resolution
- Useful for handling real-time inventory changes

### Flow 5 - RTO with Partial Cancellation [v1.2.0, v1.2.5]

**Purpose**: Return to origin after partial order cancellation**When to use**: When part of the order is cancelled and remaining items need to be returned**Key characteristics**:

- Includes partial cancellation before delivery
- RTO (Return to Origin) process for undelivered items
- Settlement updates for cancelled portions

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_update_part_cancel": {},
        "update_settlement_part_cancel": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_cancel": {},
        "on_status_rto_delivered": {}
    },
    "flow": "5"
}'
```

**Important Notes**:

- `on_update_part_cancel` handles partial item cancellation
- `update_settlement_part_cancel` adjusts payment for cancelled items
- Flow includes `on_cancel` for cancelled portion
- Ends with `on_status_rto_delivered` when items return to seller

### Flow 6 - Reverse QC (Liquidation) [v1.2.0, v1.2.5]

**Purpose**: Handle quality issues and liquidation of delivered orders**When to use**: When delivered items fail quality check and need liquidation**Key characteristics**:

- Post-delivery quality check process
- Multiple update cycles for approval and liquidation
- Settlement adjustments for liquidated items

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_update_part_cancel": {},
        "update_settlement_part_cancel": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "update_reverse_qc": {},
        "on_update_interim_reverse_qc": {},
        "on_update_approval": {},
        "on_update_picked": {},
        "update_settlement_reverse_qc": {},
        "on_update_delivered": {},
        "update_liquidated": {},
        "on_update_interim_liquidated": {},
        "on_update_liquidated": {},
        "update_settlement_liquidated": {}
    },
    "flow": "6"
}'
```

**Important Notes**:

- `update_reverse_qc` initiates quality check with item details and reason
- Multiple interim updates track the reverse QC process
- Liquidation process includes approval, pickup, and final settlement
- Complex flow with multiple settlement adjustments

### Flow 7 - Catalog Rejection [v1.2.0, v1.2.5]

**Purpose**: Reject a catalog after viewing search results**When to use**: When buyer app rejects seller's catalog due to policy or quality issues**Key characteristics**:

- No order creation
- Immediate rejection after search
- Helps maintain catalog quality standards

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "catalog_rejection": {}
    },
    "flow": "7"
}'
```

**Important Notes**:

- `catalog_rejection` must include reason for rejection
- No further interaction with rejected catalog
- Helps filter low-quality or non-compliant sellers

### Flow 8 - Search Only [v1.2.0, v1.2.5]

**Purpose**: Browse catalogs without ordering**When to use**: Window shopping or price comparison**Key characteristics**:

- Simplest flow with only search
- No order intent
- Used for catalog browsing

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {}
    },
    "flow": "8"
}'
```

**Important Notes**:

- Only search and on_search calls required
- No selection or order creation
- Useful for catalog discovery

### Flow 9 - Incremental Search Rejection [v1.2.0, v1.2.5]

**Purpose**: Reject incremental catalog updates**When to use**: When incremental updates don't meet quality standards**Key characteristics**:

- Rejects only incremental updates
- Maintains previous catalog state
- Quality control for catalog changes

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_inc_refresh": {},
        "on_search_inc_refresh": {},
        "catalog_rejection": {}
    },
    "flow": "9"
}'
```

**Important Notes**:

- Uses `search_inc_refresh` for incremental updates
- Rejection only affects incremental changes
- Previous catalog state remains valid

### Flow 005 - Force Cancel [v1.2.5 only]

**Purpose**: Seller-initiated order cancellation**When to use**: When seller cannot fulfill order due to inventory or operational issues**Key characteristics**:

- Seller (BPP) initiates cancellation
- Includes force_cancel API
- May trigger penalties for seller

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "cancel": {},
        "force_cancel": {},
        "on_cancel": {}
    },
    "flow": "005"
}'
```

**Important Notes**:

- `force_cancel` is seller-initiated unlike regular `cancel`
- Must include valid reason for force cancellation
- May affect seller ratings and incur penalties
- Order state becomes "Cancelled" with cancelled_by as seller

### Flow 010 - Delivery with Authentication [v1.2.5 only]

**Purpose**: Orders requiring authentication (OTP/code) at delivery**When to use**: High-value items or secure delivery requirements**Key characteristics**:

- Includes delivery authentication update
- OTP/code verification before handover
- Enhanced security for delivery

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_update_delivery_auth": {},
        "on_status_delivered": {}
    },
    "flow": "010"
}'
```

**Important Notes**:

- `on_update_delivery_auth` provides OTP/authentication code
- Delivery agent must verify code before handover
- Common for high-value electronics, jewelry orders
- Enhances delivery security and reduces fraud

### Flow 011 - Update Delivery Instructions [v1.2.5 only]

**Purpose**: Modify delivery instructions after order confirmation**When to use**: Customer needs to update delivery details or instructions**Key characteristics**:

- Allows post-confirmation updates
- Updates delivery instructions only
- No changes to items or pricing

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "update_instructions": {},
        "on_update_instructions": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "011"
}'
```

**Important Notes**:

- `update_instructions` can modify delivery notes, landmarks
- Cannot change delivery address or time slots
- Updates must be before order dispatch
- Useful for adding gate codes, specific instructions

### Flow 015 - Simple Liquidation [v1.2.5 only]

**Purpose**: Basic liquidation without complex reverse QC**When to use**: Direct liquidation of unsold/damaged inventory**Key characteristics**:

- Simpler than Flow 6
- Direct liquidation process
- Fewer update cycles

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "update_liquidated": {},
        "on_update_liquidated": {},
        "update_settlement_liquidated": {}
    },
    "flow": "015"
}'
```

**Important Notes**:

- Direct liquidation without reverse QC process
- Fewer API calls than Flow 6
- Used for bulk liquidation or clearance sales
- Simpler settlement process

### Flow 017 - Post-Delivery Update [v1.2.5 only]

**Purpose**: Update order details after delivery completion**When to use**: Feedback, ratings, or post-delivery service requests**Key characteristics**:

- Updates after order completion
- Can trigger cancellation/returns
- Supports feedback and ratings

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "on_update": {},
        "on_cancel": {}
    },
    "flow": "017"
}'
```

**Important Notes**:

- `on_update` after delivery for feedback/issues
- Can lead to `on_cancel` for returns
- Supports post-delivery services
- Useful for customer satisfaction tracking

### Flow 019 - P2P with Tracking [v1.2.5 only]

**Purpose**: Hyperlocal delivery with enhanced live tracking**When to use**: Food delivery, urgent deliveries requiring live tracking**Key characteristics**:

- Includes at_pickup and at_delivery states
- Multiple track/on_track calls
- Real-time location updates

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET11",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_agent_assigned": {},
        "on_status_at_pickup": {},
        "track": {},
        "on_track": {},
        "on_status_picked": {},
        "on_status_at_delivery": {},
        "track": {},
        "on_track": {},
        "on_status_delivered": {}
    },
    "flow": "019"
}'
```

**Important Notes**:

- Uses P2P-specific states: at_pickup, at_delivery
- Multiple track calls for live location
- Common in food delivery (RET11)
- Enhanced customer experience with real-time updates

### Flow 00C - Replacement (Partial) [v1.2.5 only]

**Purpose**: Replace defective or wrong items after delivery**When to use**: Customer received wrong/damaged items needing replacement**Key characteristics**:

- Post-delivery replacement process
- Can be partial or full replacement
- Includes reverse pickup and new delivery

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "update_replacement": {}
    },
    "flow": "00C"
}'
```

**Important Notes**:

- `update_replacement` initiates replacement with item details
- Triggers reverse pickup for defective items
- New fulfillment created for replacement items
- No additional charges for genuine replacement cases

### Flow 00D - Post-Delivery Cancellation [v1.2.5 only]

**Purpose**: Cancel order after delivery (returns)**When to use**: Customer wants to return delivered items**Key characteristics**:

- Cancellation after successful delivery
- Initiates return process
- Refund processing included

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {},
        "cancel": {},
        "on_cancel": {}
    },
    "flow": "00D"
}'
```

**Important Notes**:

- `cancel` after delivery initiates return
- Must include return reason and comply with return policy
- Triggers reverse pickup process
- Refund processed after item verification

### Flow 00F - Scheduled Delivery [v1.2.5 only]

**Purpose**: Orders with specific delivery time slots**When to use**: Customer needs delivery at specific time**Key characteristics**:

- Delivery scheduled for specific time window
- Common for groceries, large appliances
- Time slot selection during order

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "00F"
}'
```

**Important Notes**:

- Fulfillment includes scheduled delivery time range
- `on_select` shows available time slots
- Customer selects preferred slot in `init`
- Delivery happens within selected time window

### Flow 01D - Order Till Pending [v1.2.5 only]

**Purpose**: Create order but hold at pending state**When to use**: Pre-orders or orders awaiting inventory**Key characteristics**:

- Order created but not processed
- Stays in pending state
- Processing triggered later

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {}
    },
    "flow": "01D"
}'
```

**Important Notes**:

- Flow ends at `on_status_pending`
- Order remains in "Pending" state
- Used for pre-orders or awaiting stock
- Processing resumes when conditions are met

### Offer Flows (0091-0098)

### Flow 0091 - Discount Offers [v1.2.5 only]

**Purpose**: Apply percentage or amount-based discounts**When to use**: Promotional discounts on products or cart**Key characteristics**:

- Discount details in offers array
- Can be item-level or cart-level
- Automatic application based on conditions

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0091"
}'
```

**Important Notes**:

- Offers visible in `on_search` with discount details
- Applied automatically when conditions met
- Reflected in quote breakup
- Can be percentage or fixed amount discount

### Flow 0092 - Freebie Offers [v1.2.5 only]

**Purpose**: Free items with purchase**When to use**: Buy X Get Y free promotions**Key characteristics**:

- Free items added to order
- Linked to specific purchase conditions
- No charge for freebie items

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0092"
}'
```

**Important Notes**:

- Freebie items shown with zero price
- Automatically added when conditions met
- Cannot be selected independently
- Linked to primary purchase items

### Flow 0093 - Buy X Get Y Offers [v1.2.5 only]

**Purpose**: Conditional offers based on quantity**When to use**: Buy 2 Get 1 Free type promotions**Key characteristics**:

- Quantity-based triggers
- Additional items at reduced/zero price
- Encourages bulk purchase

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0093"
}'
```

**Important Notes**:

- Offer triggers when minimum quantity selected
- Additional items added automatically
- Price adjustment in quote breakup
- Common in FMCG and retail

### Flow 0094 - Delivery Charge Offers [v1.2.5 only]

**Purpose**: Free or reduced delivery charges**When to use**: Promotions on delivery fees**Key characteristics**:

- Waives or reduces delivery charges
- Based on cart value or specific items
- Encourages higher cart value

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0094"
}'
```

**Important Notes**:

- Delivery charge reduction shown in quote
- May require minimum order value
- Applied automatically when conditions met
- Visible in fulfillment charges breakdown

### Flow 0095 - Slab-based Offers [v1.2.5 only]

**Purpose**: Tiered discounts based on cart value**When to use**: Progressive discounts for higher purchases**Key characteristics**:

- Multiple discount tiers
- Higher discounts for larger carts
- Encourages increased spending

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0095"
}'
```

**Important Notes**:

- Different discount slabs defined (e.g., 5% off >₹500, 10% off >₹1000)
- Highest applicable slab automatically applied
- Encourages cart value increase
- Clear slab details in offer description

### Flow 0096 - Combo Offers [v1.2.5 only]

**Purpose**: Bundled products at special prices**When to use**: Product bundles and meal deals**Key characteristics**:

- Pre-defined product combinations
- Special bundle pricing
- Cannot modify bundle items

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0096"
}'
```

**Important Notes**:

- Combo items must be selected together
- Special combo price lower than individual sum
- Common in food delivery (meal combos)
- Bundle components cannot be customized

### Flow 0097 - Exchange Offers [v1.2.5 only]

**Purpose**: Discount on new purchase with old product exchange**When to use**: Electronics, appliances exchange programs**Key characteristics**:

- Requires old product details
- Exchange value assessed
- Discount applied on new purchase

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0097"
}'
```

**Important Notes**:

- Exchange item details required in order
- Exchange value determined by condition
- Old item pickup arranged with delivery
- Final price adjusted for exchange value

### Flow 0098 - Financing Offers [v1.2.5 only]

**Purpose**: EMI and financing options**When to use**: High-value purchases with payment plans**Key characteristics**:

- Multiple EMI tenure options
- Interest rates and processing fees
- Down payment requirements

```shell
curl --location 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET10",
    "version": "1.2.5",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status_pending": {},
        "on_status_packed": {},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow": "0098"
}'
```

**Important Notes**:

- Financing options shown in payment methods
- EMI details include tenure, interest, total amount
- May require credit check or pre-approval
- Payment collected as per EMI schedule

## Important Notes

### General Guidelines

1. **Context Fields**: All payloads must include complete context objects with required fields:

   - `domain`, `country`, `city`, `transaction_id`, `message_id`, `timestamp`, `ttl`
   - `bap_id`, `bap_uri`, `bpp_id`, `bpp_uri`
   - `action` must match the API being called
2. **Message Content**: The `message` objects in examples show only key fields. Actual payloads must include all required fields per ONDC specifications.
3. **Payload Structure**: Empty dictionaries (`{}`) in examples must be replaced with complete API payloads.

### Version-Specific Guidelines

#### Version 1.2.0

- Supports flows 1-9 and 2A only
- Basic status tracking without routing types
- Standard fulfillment flow

#### Version 1.2.5

- Supports all v1.2.0 flows plus 30+ additional flows
- **Status Validation**: Include ALL possible `on_status_*` calls in payload; validation is automatic based on routing type
- **Routing Types**: Must specify P2P or P2H2P in `on_confirm` fulfillment tags
- Routing type must remain consistent throughout order lifecycle

### Flow-Specific Rules

- **Flow 012 (COD)**: Settlement details in `confirm`, not `on_init`; payment status updated in `on_status_delivered`
- **Flow 002 (Self-Pickup)**: Order completes at `on_status_picked` with state "Order-picked-up"
- **Flow 01E**: `cancellation_terms` are mandatory in `on_init`
- **Flow 6**: Complex flow with reverse QC and liquidation sequences
- **Offer Flows (0091-0098)**: Special handling for promotional offers

### API Naming Convention

- Use descriptive names for search APIs:
  - `search_full_catalog_refresh` (not just `search`)
  - `on_search_full_catalog_refresh` (not just `on_search`)
  - `search_inc_refresh` (not `search_inc`)
  - `on_search_inc_refresh` (not `on_search_inc`)
- All other APIs use standard names: `select`, `on_select`, `init`, `on_init`, etc.

## Other Domains

### For FIS10 (CREDIT) Sample Curl Request

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS10",
    "version": "2.2.0",
    "flow": "PERSONAL_LOAN",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {},
        "select": {},
        "on_select": {},
        "select_1": {},
        "on_select_1": {},
        "select_2": {},
        "on_select_2": {},
        "select_3": {},
        "on_select_3":{},
        "on_status_ekyc": {},
        "init_1": {},
        "on_init_1": {},
        "init_2": {},
        "on_init_2": {},
        "on_status_enach": {},
        "init_3": {},
        "on_init_3": {},
        "on_status_esign": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "update": {},
        "on_update": {},
        "on_update_unsolicated": {}
    }
}'
```

### For FIS12 Working Capital Loans Sample Curl Requests

#### For WCL_CREDIT_LINE_ASSIGNMENT Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_CREDIT_LINE_ASSIGNMENT",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {},
        "search_1": {},
        "on_search_1": {},
        "search_2": {},
        "on_search_2": {},
        "select": {},
        "on_select": {},
        "on_status_kyc": {},
        "select_1": {},
        "on_select_1":{},
        "select_2":{},
        "on_select_2": {},
        "init":{},
        "on_init":{},
        "init_1":{},
        "on_init_1":{},
        "on_status_emandate":{},
        "init_2": {},
        "on_init_2": {},
        "on_status_esign":{},
        "init_3":{},
        "on_init_3":{},
        "confirm":{},
        "on_confirm":{}
    }
}'
```

#### For WCL_CREDIT_LINE_DRAWDOWN Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_CREDIT_LINE_DRAWDOWN",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "init": {},
        "on_init": {},
        "init_1": {},
        "on_init_2": {},
        "confirm": {},
        "on_confirm":{},
        "on_update":{},
        "on_update_base_transaction": {}
    }
}'
```

#### For WCL_MISSED_EMI_PAYMENT Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_MISSED_EMI_PAYMENT",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "update": {},
        "on_update_emi_detail":{},
        "on_update_payment_status":{},
        "on_update_base_transaction":{}
    }
}'
```

#### For WCL_PRE_PART_PAYMENT Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_PRE_PART_PAYMENT",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "update": {},
        "on_update_pre_part_payment": {},
        "on_update_payment_status": {},
        "on_update_base_transaction": {}
    }
}'
```

#### For WCL_DRAWDOWN_FORECLOSURE Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_DRAWDOWN_FORECLOSURE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "update": {},
        "on_update_foreclosure_detail": {},
        "on_update_payment_status":{},
        "on_update_base_transaction": {}
    }
}'
```

#### For WCL_CREDIT_LINE_CANCELLATION Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.3.0",
    "flow": "WCL_CREDIT_LINE_CANCELLATION",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "cancel": {},
        "on_cancel":{},
        "on_update": {}
    }
}'
```

### For Purchase Finance Sample Curl Requests

The following curl commands demonstrate how to validate different Purchase Finance flows using the Log Validation Utility.

#### For PURCHASE_FINANCE_WITH_AGGREGATOR Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_WITH_AGGREGATOR",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search":{},
        "on_search": {},
        "search_1": {},
        "on_search_1":{},
        "search_2": {},
        "on_search_2": {},
        "search_3": {},
        "on_search_3": {},
        "select": {},
        "on_select":{},
        "select_1":{},
        "on_select_1":{},
        "select_2": {},
        "on_select_2":{},
        "on_status_kyc": {},
        "init":{},
        "on_init": {},
        "init_1": {},
        "on_init_1":{},
        "init_2": {},
        "on_init_2": {},
        "on_status_esign": {},
        "on_status_emandate": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "update":{},
        "on_update": {},
        "on_update_fullfillment_state":{}
    }
}'
```

#### For PURCHASE_FINANCE_WITHOUT_AGGREGATOR_AND_MONITORING Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_WITHOUT_AGGREGATOR_AND_MONITORING",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search":{},
        "search_1": {},
        "on_search_1":{},
        "search_2":{},
        "on_search_2": {},
        "select":{},
        "on_select":{},
        "select_1":{},
        "on_select_1":{},
        "select_2":{},
        "on_select_2":{},
        "on_status_kyc": {},
        "init":{},
        "on_init": {},
        "init_1":{},
        "on_init_1": {},
        "init_2": {},
        "on_init_2": {},
        "on_status_esign": {},
        "on_status_emandate": {},
        "confirm": {},
        "on_confirm": {},
        "update": {},
        "on_update":{},
        "on_update_fulfillement_state":{}
    }
}'
```

#### For PURCHASE_FINANCE_MISSED_EMI Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_MISSED_EMI",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "on_confirm": {},
        "update": {},
        "on_update_emi_detail": {},
        "on_update_unsolicated": {}
    }
}'
```

#### For PURCHASE_FINANCE_PRE_PART_PAYMENT Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_PRE_PART_PAYMENT",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "on_confirm": {},
        "update": {},
        "on_update_pre_part_payment": {},
        "on_update_unsolicated": {}
    }
}'
```

#### For PURCHASE_FINANCE_FORECLOSURE Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_FORECLOSURE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "on_confirm": {},
        "update": {},
        "on_update_foreclosure_detail": {},
        "on_update_unsolicated": {}
    }
}'
```

#### For PURCHASE_FINANCE_MULTIPLE_OFFER Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.2.0",
    "flow": "PURCHASE_FINANCE_MULTIPLE_OFFER",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {},
        "search_1": {},
        "on_search_1": {},
        "search_2": {},
        "on_search_2": {},
        "search_3": {},
        "on_search_3": {}
    }
}'
```

### For FIS13 Sample Curl Requests

#### For MOTOR_INSURANCE Flow

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS13",
    "version": "2.0.0",
    "flow": "MOTOR_INSURANCE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_1": {},
        "on_search_1":{},
        "search_2": {},
        "on_search_2":{},
        "select_1": {},
        "on_select_1": {},
        "select_2": {},
        "on_select_2": {},
        "select_3": {},
        "on_select_3": {},
        "init_1": {},
        "on_init_1": {},
        "init_2": {},
        "on_init_2": {},
        "confirm": {},
        "on_confirm": {}
    }
}'
```

### For FIS14 Sample Curl Requests (Local)

#### For SEARCH_FULL_PULL Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "SEARCH_FULL_PULL",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {}
    }
}'
```

#### For SEARCH_INCREMENT Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "SEARCH_INCREMENT",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {}
    }
}'
```

#### For SIP_NEW_FOLIO_WITH_KYC Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "SIP_NEW_FOLIO_WITH_KYC",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "select": {},
        "on_select": {},
        "select_1": {},
        "on_select_1": {},
        "select_2": {},
        "on_select_2": {},
        "select_3": {},
        "on_select_3": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status": {}
    }
}'
```

#### For SIP_INSTALLEMENT_SUCCESS Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "SIP_INSTALLEMENT_SUCCESS",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "on_update": {},
        "on_confirm": {},
        "on_status": {},
        "on_update_1": {}
    }
}'
```

#### For SIP_INSTALLEMENT_FAILURE Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "SIP_INSTALLEMENT_FAILURE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "on_update": {},
        "on_confirm": {},
        "on_update_1": {}
    }
}'
```

#### For LUMPSUM_EXISTING_FOLIO Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "LUMPSUM_EXISTING_FOLIO",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_status": {},
        "on_update": {}
    }
}'
```

#### For LUMPSUM_PAYMENT_RETRY Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "LUMPSUM_PAYMENT_RETRY",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_update": {},
        "update": {},
        "on_update_1": {}
    }
}'
```

#### For REDEMPTION Flow

```shell
curl --location 'http://localhost:3008/api/validate/fis' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS14",
    "version": "2.0.0",
    "flow": "REDEMPTION",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "on_update": {}
    }
}'
```

### For TRV10 Sample Curl Request (Local)

```shell
curl --location 'https://localhost:3006/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:TRV10",
    "version": "2.0.0",
    "flow": "RIDER_CANCEL",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search":{},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "soft_cancel": {},
        "soft_on_cancel": {},
        "cancel": {},
        "on_cancel": {}
    }
}'
```

### For TRV11 (METRO) Sample Curl Request (Server)

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:TRV11",
    "version": "2.0.0",
    "flow": "METRO_STATION_CODE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search1": {},
        "on_search1": {},
        "search2": {},
        "on_search2": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "soft_cancel": {},
        "soft_on_cancel": {},
        "confirm_cancel": {},
        "confirm_on_cancel": {}
    }
}'
```

### For TRV14 (Unreserved Tickets) Sample Curl Request (Server)

###PAGINATION

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
 "domain": "ONDC:TRV14",
 "version": "2.0.0",
 "flow": "PAGINATION",
 "bap_id": "BUYER_APP_SUBSCRIBER_ID",
 "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
 "payload": {
   "search": {},
   "on_search": {},
   "on_search1": {}
 }
}
'
```

###INCREMENTAL PULL

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "INCREMENTAL_PULL",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "search": {},
       "on_search": {},
       "on_search1": {},
   }
}'
```

###PURCHASE JOURNEY

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "PURCHASE_JOURNEY",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "select": {},
       "on_select": {},
       "select1": {},
       "on_select1": {},
       "init": {},
       "on_init": {},
       "confirm": {},
       "on_confirm": {},
       "status": {},
       "on_status": {},
   }
}'
```

###USER CANCELLATION

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "USER_CANCELLATION",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "onconfirm":{},
       "cancel":{},
       "on_cancel":{},
       "cancel1":{},
       "on_cancel":{}
   }
}'
```

###TECHNICAL CANCELLATION

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "TECHNICAL_CANCELLATION",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "onconfirm":{},
       "status":{},
       "on_status":{},
       "cancel":{},
       "on_cancel":{},
       "cancel1":{},
       "on_cancel":{}
   }
}'
```

###PARTIAL CANCELLATION

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "PARTIAL_CANCELLATION",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "update":{},
       "on_update":{},
       "update1":{},
       "on_updatel":{}
   }
}'
```

###CANCELLATION_REJECTED

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:TRV14",
   "version": "2.0.0",
   "flow": "CANCELLATION_REJECTED",
   "bap_id": "BUYER_APP_SUBSCRIBER_ID",
   "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
   "payload": {
       "cancel":{},
       "on_cancel":{},
   }
}'
```

### For TRV11 (INTRACITY-BUS) Sample Curl Request (Server)

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:TRV11",
    "version": "2.0.0",
    "flow": "INTRACITY_STATION_CODE",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search1": {},
        "on_search1": {},
        "search2": {},
        "on_search2": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "soft_cancel": {},
        "soft_on_cancel": {},
        "confirm_cancel": {},
        "confirm_on_cancel": {}
    }
}'
```

### For TRV13 (HOTEL-SERVICES) Sample Curl Request (Server)

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:TRV13",
    "version": "2.0.0",
    "flow": "FLOW1",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search": {},
        "search_inc": {},
        "on_search_inc": {},
        "search_time": {},
        "on_search_time": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "update": {},
        "on_update": {},
        "status": {},
        "on_status": {},
        "cancel": {},
        "on_cancel": {}
    }
}'
```

### For RSF V1 Sample Curl Request (Local)

### For FLOW_1

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
   "domain": "ONDC:NTS10",
"version": "1.0.0",
"flow": "SUCCESS_FLOW",
"bap_id": "apidev.outpathprod.com",
"bpp_id": "uat.kanpurmetrogosmartcard.com",
"payload": { "receiver_recon":{}, "on_receiver_recon":{}, } }`

```

### For FLOW_2

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
"domain": "ONDC:NTS10",
"version": "1.0.0",
"flow": "CORRECTION_FLOW",
"bap_id": "apidev.outpathprod.com",
"bpp_id": "uat.kanpurmetrogosmartcard.com",
"payload": { "receiver_recon":{}, "on_receiver_recon":{}, } }

```

### For FLOW_2

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {

        "settle":{},
        "on_settle":{},
        "report":{},
        "on_report":{},
        "recon":{},
        "on_recon":{},
        "settle1":{},
        "on_settle1":{},
                }
        }'

```

### For RSF V2 Sample Curl Request (Local)

### For FLOW_1

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "settle":{},
        "on_settle":{},
        "report":{},
        "on_report":{},
        }'

```

### For FLOW_2

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {

        "settle":{},
        "on_settle":{},
        "report":{},
        "on_report":{},
        "recon":{},
        "on_recon":{},
        "settle1":{},
        "on_settle1":{},
                }
        }'

```

### For FLOW_3

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "settle":{},
        "on_settle":{},
        "report":{},
        "on_report":{},
        "recon":{},
        "on_recon":{}
                }
        }'

```

### For FLOW_4

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {

        "settle":{},
        "on_settle":{}
                }
        }'

```

### For FLOW_5

```shell
curl --location 'http://localhost:3008/api/validate/rsf' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:NTS10",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "settle":{},
        "on_settle":{}
                }
        }'

```

### For IGM 2.0.0 Sample Curl Request (Local)

### For FLOW_1

```shell
curl --location 'https://log-validation.ondc.org/api/validate/igm' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "flow": "FLOW_1",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "issue_open": {},
        "on_issue_processing_1":{},
        "on_issue_info_required": {},
        "issue_info_provided": {},
        "on_issue_processing_2": {},
        "on_issue_resolution_proposed": {},
        "issue_resolution_accepted": {},
        "on_issue_resolved": {},
        "issue_closed": {}
    }
}'

```

### For FLOW_2

```shell
curl --location 'https://log-validation.ondc.org/api/validate/igm' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "flow": "FLOW_2",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "issue_open": {},
        "on_issue_processing": {},
        "on_issue_resolution_proposed": {},
        "issue_resolution_accepted": {},
        "on_issue_resolved": {},
        "issue_esclated": {},
        "on_issue_gro_processing": {},
        "on_issue_gro_resolution_proposed": {},
        "issue_gro_resolution_accepted":{}
        "on_issue_gro_resolved": {},
        "issue_close": {}
    }
}'

```

### For FLOW_3

```shell
curl --location 'https://log-validation.ondc.org/api/validate/igm' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "2.0.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "flow": "FLOW_3",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "issue_open": {},
        "on_issue_processing": {},
        "issue_lsp_open": {},
        "on_issue_lsp_processing": {},
        "on_issue_lsp_info_required": {},
        "on_issue_info_required": {},
        "issue_info_provided": {},
        "issue_info_lsp_info_provided": {},
        "on_issue_lsp_resolution_proposed": {},
        "on_issue_resolution_proposed": {},
        "issue_resolution_accepted": {},
        "issue_lsp_resolution_accepted": {},
        "on_issue_lsp_resolved": {},
        "on_issue_resolved": {},
        "issue_close": {},
        "issue_lsp_close": {}
    }
}'

```

```shell
curl --location 'https://log-validation.ondc.org/api/validate/trv' \
--header 'Content-Type: application/json' \
--data '{
  "domain": "ONDC:TRV14",
  "version": "2.0.0",
  "flow": "PAGINATION",
  "bap_id": "BUYER_APP_SUBSCRIBER_ID",
  "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
  "payload": {
    "search": {},
    "on_search": {},
    "on_search1": {}
  }
}
'

```

Using Postman, you can import the above `curl` command into Postman and replace the empty objects in the payload with your actual data. This allows for easy testing and validation of transaction logs on your local environment.

With these instructions, you can start using the Retail Logs Validation Utility for local log validation.

Feel free to reach out if you have any questions or need further assistance.

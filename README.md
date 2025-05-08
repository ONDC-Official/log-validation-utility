# Retail Log Validation Utility

The Retail Log Validation Utility is a tool designed to validate transaction logs on the ONDC network. It allows for easy testing and validation of transaction payloads using the provided API. This utility helps ensure the accuracy and integrity of transaction data on the ONDC network.

## Log Validation Service Usage

You can use the Log Validation Service to validate all ONDC transaction-related API payloads. The service is hosted at [https://log-validation.ondc.org](https://log-validation.ondc.org). You can use the following `curl` or Postman requests to validate the API logs. The service will generate a report for the provided JSON payloads.

### Using Postman

```shell
curl --location --request POST 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {},
        "search_inc_refresh": {},
        "on_search_inc_refresh": {},
        "select": {},
        "on_select": {},
        "init": {},
        "on_init": {},
        "confirm": {},
        "on_confirm": {},
        "update(initiated)": {},
        "on_update(interim)":{},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    },
    "flow":""
}'
```
# Retail Log Validation Utility - Flow Payloads

The table below outlines the payload structure for various transaction flows in the Retail Log Validation Utility. Each flow corresponds to specific actions within the ONDC network, and the payload structure provides a clear representation of the data expected for each action. This comprehensive reference assists developers in constructing accurate and valid JSON payloads for their transactions.

| Flow 1        | Flow 2                     | Flow 3                     | Flow 4     | Flow 5                           | Flow 6                        | Flow 7            | Flow 8    | Flow 9            |
| ------------- | -------------------------- | -------------------------- | ---------- | -------------------------------- | ----------------------------- | ----------------- | --------- | ----------------- |
| search        | search                     | search                     | search     | search                           | search                        | search            | search    | search_inc        |
| on_search     | on_search                  | on_search                  | on_search  | on_search                        | on_search                     | on_search         | on_search | on_search_inc     |
| search_inc    | select                     | select_out_of_stock        | select     | select                           | select                        | catalog_rejection |           | catalog_rejection |
| on_search_inc | on_select                  | on_select_out_of_stock     | on_select  | on_select                        | on_select                     |                   |           |                   |
|               | init                       | select                     | init       | init                             | init                          |                   |           |                   |
|               | on_init                    | on_select                  | on_init    | on_init                          | on_init                       |                   |           |                   |
|               | confirm                    | init                       | confirm    | confirm                          | confirm                       |                   |           |                   |
|               | on_confirm                 | on_init                    | on_confirm | on_confirm                       | on_confirm                    |                   |           |                   |
|               | on_status_pending          | confirm                    | cancel     | on_status_pending                | on_update_part_cancel         |                   |           |                   |
|               | on_status_packed           | on_confirm                 | on_cancel  | on_status_packed                 | update_settlement_part_cancel |                   |           |                   |
|               | on_status_picked           | on_status_pending          |            | on_status_picked                 | on_status_pending             |                   |           |                   |
|               | on_status_out_for_delivery | on_status_packed           |            | on_status_out_for_delivery       | on_status_packed              |                   |           |                   |
|               | on_status_delivered        | on_status_picked           |            | on_cancel                        | on_status_picked              |                   |           |                   |
|               |                            | on_status_out_for_delivery |            | on_status_rto_delivered/disposed | on_status_out_for_delivery    |                   |           |                   |
|               |                            | on_status_delivered        |            |                                  | on_status_delivered           |                   |           |                   |
|               |                            |                            |            |                                  | update_reverse_qc             |                   |           |                   |
|               |                            |                            |            |                                  | on_update_interim_reverse_qc  |                   |           |                   |
|               |                            |                            |            |                                  | on_update_approval            |                   |           |                   |
|               |                            |                            |            |                                  | on_update_picked              |                   |           |                   |
|               |                            |                            |            |                                  | update_settlement_reverse_qc  |                   |           |                   |
|               |                            |                            |            |                                  | on_update_delivered           |                   |           |                   |
|               |                            |                            |            |                                  | update_liquidated             |                   |           |                   |
|               |                            |                            |            |                                  | on_update_interim_liquidated  |                   |           |                   |
|               |                            |                            |            |                                  | on_update_liquidated          |                   |           |                   |
|               |                            |                            |            |                                  | update_settlement_liquidated  |                   |           |                   |

### Sample Postman Request/Response

```shell
curl --location --request POST 'https://log-validation.ondc.org/api/validate' \
--header 'Content-Type: application/json' \
--data-raw '{
    "domain": "ONDC:RET10",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {
            "context": {
                "action": "search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_search_full_catalog_refresh": {
            "context": {
                "action": "on_search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_search_inc_refresh": {
            "context": {
                "action": "on_search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "select": {
            "context": {
                "action": "select",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_select": {
            "context": {
                "action": "on_select",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "init": {
            "context": {
                "action": "init",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_init": {
            "context": {
                "action": "on_init",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}

        },
        "confirm": {
            "context": {
                "action": "confirm",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_confirm": {
            "context": {
                "action": "on_confirm",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_status_pending": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_status_picked": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_status_delivered": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        }
    }
}'

```

### Tokenised Validation

If your log are successfully approved, you will receive a similar response as described below:

```json
{
  "success": true,
  "response": {
    "message": "Logs were verified successfully",
    "report": {},
    "bap_id": "BUYER_APP_ID", // example: buyer-app-preprod-v2.ondc.org
    "bpp_id": "SELLER_APP_ID", // example: seller-app-preprod-v2.ondc.org
    "domain": "DOMAIN", // example: ONDC:RET10
    "reportTimestamp": "2024-02-08T08:10:10.805Z"
  },
  "signature": "Ishpxpy8p3SPE1CXnMTkxKDt9S/X7v8OigL4DqVWphcr0jXTQOPotX/Y710WKZoCvWgCDOJahf7sXvJzgmRHAg==",
  "signTimestamp": "2024-02-08T08:10:10.805Z"
}
```

The signature can be provided to validate that your request was approved by the log validation utility and will be serving as the first level of log verification that has to be completed on the NP side.

In order to perform a validation request with combination of signature and signTimestamp, you can do the following request:

```shell
curl --location 'https://log-validation.ondc.org/api/validate/token' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AjQe2v39s-ZeiHTOm-dkGI1NK5rqN0Lj4.PLxLV6QlhCtGTHP2ZKe0a5OpHl2ng0oQ%2BAqWmd56POU' \
--data-raw '{
       "search_full_catalog_refresh": {
            "context": {
                "action": "search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_search_full_catalog_refresh": {
            "context": {
                "action": "on_search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_search_inc_refresh": {
            "context": {
                "action": "on_search",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "select": {
            "context": {
                "action": "select",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_select": {
            "context": {
                "action": "on_select",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "init": {
            "context": {
                "action": "init",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_init": {
            "context": {
                "action": "on_init",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}

        },
        "confirm": {
            "context": {
                "action": "confirm",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_confirm": {
            "context": {
                "action": "on_confirm",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        },
        "on_status_pending": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_status_picked": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
           "message": {...}
        },
        "on_status_delivered": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.or",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                ...
            },
            "message": {...}
        }
    }
}'
```

You will receive `verification: true` if the signature was verified to be generated from the same set of logs.

#### Notes:

- The output of the utility service provides the report in a JSON format along with a success flag (true/false). Refer to the above sample payloads.
- The service can be used to validate the entire transaction on the network or a particular schema of any payload.
  - Endpoint for the validation of the entire transaction: [https://log-validation.ondc.org/api/validate](https://log-validation.ondc.org/api/validate)
  - Endpoint for the validation of schema: [https://log-validation.ondc.org/api/validate-schema](https://log-validation.ondc.org/api/validate-schema)
- Community contributions are welcome to enhance this utility for future releases. To contribute, please raise a PR or create an issue. Contribution through either way works!

## Installation (Local Server)

If you want to use this utility locally, follow these steps:

1. Clone the repository from GitHub:

   ```shell
   git clone https://github.com/ONDC-Official/log-validation-utility.git
   ```

2. Install the required dependencies:

   ```shell
   npm install
   ```

3. Run the server in a local environment:

   ```shell
   npm run dev
   ```

After starting the local server, you can use the API for log validation by making POST requests to the following endpoint:

```
http://localhost:3006/api/validate
```

### Sample Curl Request (Local)

You can use the following `curl` command to make a POST request to the local validation endpoint:

### FOR FLOW 1

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
        "search_inc_refresh": {},
        "on_search_inc_refresh": {}
    },
    "flow": "1"
}'
```

### FOR FLOW 2

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
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

### FOR FLOW 3

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
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
        "on_status_delivered": {}
    },
    "flow": "3"
}'
```

### FOR FLOW 4

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
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

### FOR FLOW 5

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
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
        "on_cancel": {},
        "on_status_rto_delivered/disposed":{}
    },
    "flow": "5"
}'
```

### FOR FLOW 6
```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh":{},
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
        "update_reverse_qc":{},
        "on_update_interim_reverse_qc":{},
        "on_update_approval":{},
        "on_update_picked": {},
        "update_settlement_reverse_qc": {},
        "on_update_delivered": {},
        "update_liquidated":{},
        "on_update_interim_liquidated":{},
        "on_update_liquidated": {},
        "update_settlement_liquidated": {}
    },
    "flow": "6"
}'
```
### FOR FLOW 7

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
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

### FOR FLOW 8

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search_full_catalog_refresh": {},
        "on_search_full_catalog_refresh": {}
    },
    "flow": "8"
}'
```

### FOR FLOW 9

```shell
curl --location 'http://localhost:3008/api/validate' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:RET18",
    "version": "1.2.0",
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

```
### For IGM Sample Curl Request (Local)

```shell
curl --location 'https://localhost:3006/api/validate/igm' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "",
    "version": "1.2.0",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "ret_issue": {},
        "ret_issue_close":{},
        "ret_on_issue": {},
        "ret_issue_status": {},
        "ret_on_issue_status": {},
        "ret_on_issue_status_unsolicited": {},
        "lsp_issue": {},
        "lsp_issue_close":{},
        "lsp_on_issue": {},
        "lsp_issue_status": {},
        "lsp_on_issue_status": {}
    }
}'
```

### For FIS12 Sample Curl Request (Local)

```shell
curl --location 'https://log-validation.ondc.org/api/validate/fis/fis12' \
--header 'Content-Type: application/json' \
--data '{
    "domain": "ONDC:FIS12",
    "version": "2.0.0",
    "flow": "PERSONAL",
    "bap_id": "BUYER_APP_SUBSCRIBER_ID",
    "bpp_id": "SELLER_APP_SUBSCRIBER_ID",
    "payload": {
        "search": {},
        "on_search":{},
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




### For RSF V2 Sample Curl Request (Local)

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

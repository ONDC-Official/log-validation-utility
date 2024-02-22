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
        "on_status_pending": {},
        "on_status_packed":{},
        "on_status_picked": {},
        "on_status_out_for_delivery": {},
        "on_status_delivered": {}
    }, 
    "flow":""
}'
```

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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0b9f3a3-a960-4f7e-a0ca-02c30fa6fc9b",
                "timestamp": "2023-10-25T12:00:01.160Z",
                "transaction_id": "5c2e9202-2056-49db-9efa-8a69b262a36d",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0b9f3a3-a960-4f7e-a0ca-02c30fa6fc9b",
                "timestamp": "2023-10-25T12:00:40.526Z",
                "transaction_id": "5c2e9202-2056-49db-9efa-8a69b262a36d",
                "ttl": "PT30S"
            },
            "message": {...}
        },
        "on_search_inc_refresh": {
            "context": {
                "transaction_id": "0686430c-1570-440f-b494-1f526f92c55b",
                "country": "IND",
                "bpp_id": "seller-app.ondc.org",
                "city": "std:080",
                "message_id": "e9217862-0f7a-43ab-843d-7c37386115c2",
                "core_version": "1.2.0",
                "ttl": "PT30S",
                "bap_id": "buyer-app.ondc.or",
                "bpp_uri": "https://seller-app.ondc.org",
                "domain": "ONDC:RET10",
                "action": "on_search",
                "bap_uri": "https://buyer-app.ondc.org",
                "timestamp": "2023-10-26T17:21:07.223Z"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "e0eb6e6a-7264-474a-899d-d47fdb996ebb",
                "timestamp": "2023-10-23T17:50:16.057Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "e0eb6e6a-7264-474a-899d-d47fdb996ebb",
                "timestamp": "2023-10-23T17:50:16.729Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ad0aa01d-a367-4409-8d2d-a6e1bb4823d3",
                "timestamp": "2023-10-23T17:50:28.426Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ad0aa01d-a367-4409-8d2d-a6e1bb4823d3",
                "timestamp": "2023-10-23T17:50:34.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0bd7111-0917-4500-81ec-8957ebde11da",
                "timestamp": "2023-10-23T17:50:37.740Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0bd7111-0917-4500-81ec-8957ebde11da",
                "timestamp": "2023-10-23T17:50:47.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "76242cea-6253-40f6-949b-211189c4c5e2",
                "timestamp": "2023-10-23T17:50:49.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "d45104f7-8c88-4722-9a1a-075bd520259a",
                "timestamp": "2023-10-23T18:41:15.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
            },
           "message": {...}
        },
        "on_status_delivered": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.org",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ac88172c-4c2c-4b8c-8538-77185383a7f6",
                "timestamp": "2023-10-23T18:41:46.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0b9f3a3-a960-4f7e-a0ca-02c30fa6fc9b",
                "timestamp": "2023-10-25T12:00:01.160Z",
                "transaction_id": "5c2e9202-2056-49db-9efa-8a69b262a36d",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0b9f3a3-a960-4f7e-a0ca-02c30fa6fc9b",
                "timestamp": "2023-10-25T12:00:40.526Z",
                "transaction_id": "5c2e9202-2056-49db-9efa-8a69b262a36d",
                "ttl": "PT30S"
            },
            "message": {...}
        },
        "on_search_inc_refresh": {
            "context": {
                "transaction_id": "0686430c-1570-440f-b494-1f526f92c55b",
                "country": "IND",
                "bpp_id": "seller-app.ondc.org",
                "city": "std:080",
                "message_id": "e9217862-0f7a-43ab-843d-7c37386115c2",
                "core_version": "1.2.0",
                "ttl": "PT30S",
                "bap_id": "buyer-app.ondc.or",
                "bpp_uri": "https://seller-app.ondc.org",
                "domain": "ONDC:RET10",
                "action": "on_search",
                "bap_uri": "https://buyer-app.ondc.org",
                "timestamp": "2023-10-26T17:21:07.223Z"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "e0eb6e6a-7264-474a-899d-d47fdb996ebb",
                "timestamp": "2023-10-23T17:50:16.057Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "e0eb6e6a-7264-474a-899d-d47fdb996ebb",
                "timestamp": "2023-10-23T17:50:16.729Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ad0aa01d-a367-4409-8d2d-a6e1bb4823d3",
                "timestamp": "2023-10-23T17:50:28.426Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ad0aa01d-a367-4409-8d2d-a6e1bb4823d3",
                "timestamp": "2023-10-23T17:50:34.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0bd7111-0917-4500-81ec-8957ebde11da",
                "timestamp": "2023-10-23T17:50:37.740Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "a0bd7111-0917-4500-81ec-8957ebde11da",
                "timestamp": "2023-10-23T17:50:47.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "76242cea-6253-40f6-949b-211189c4c5e2",
                "timestamp": "2023-10-23T17:50:49.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "d45104f7-8c88-4722-9a1a-075bd520259a",
                "timestamp": "2023-10-23T18:41:15.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
            },
           "message": {...}
        },
        "on_status_delivered": {
            "context": {
                "action": "on_status",
                "bap_id": "buyer-app.ondc.org",
                "bap_uri": "https://buyer-app.ondc.org",
                "bpp_id": "seller-app.ondc.org",
                "bpp_uri": "https://seller-app.ondc.org",
                "city": "std:080",
                "core_version": "1.2.0",
                "country": "IND",
                "domain": "ONDC:RET10",
                "message_id": "ac88172c-4c2c-4b8c-8538-77185383a7f6",
                "timestamp": "2023-10-23T18:41:46.000Z",
                "transaction_id": "dbd370b9-80fc-4384-9a67-5dd05aca4213",
                "ttl": "PT30S"
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

```shell
curl --location --request POST 'http://localhost:3006/api/validate' \
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
        "on_status_pending": {},
        "on_status_picked": {},
        "on_status_delivered": {}
    }
}'
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
        "init_1": {},
        "on_init_1": {},
        "init_2": {},
        "on_init_2": {},
        "init_3": {},
        "on_init_3": {},
        "confirm": {},
        "on_confirm": {},
        "status": {},
        "on_status": {},
        "update": {},
        "on_update": {}
    }
}'
```

### For TRV10 Sample Curl Request (Local)

```shell
curl --location 'https://localhost:3006/api/validate/trv/trv10' \
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

Using Postman, you can import the above `curl` command into Postman and replace the empty objects in the payload with your actual data. This allows for easy testing and validation of transaction logs on your local environment.

With these instructions, you can start using the Retail Logs Validation Utility for local log validation.

Feel free to reach out if you have any questions or need further assistance.

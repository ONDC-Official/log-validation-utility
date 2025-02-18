{
    "domain": "ONDC:TRV14",
    "version": "2.0.0",
    "flow": "simple",
    "bap_id": "http://localhost:3008",
    "bpp_id": "http://localhost:3008",
    "payload": {
"init" : {
  "context": {
    "location": {
      "country": {
        "code": "IND"
      },
      "city": {
        "code": "std:011"
      }
    },
    "domain": "ONDC:TRV14",
    "timestamp": "2024-06-26T04:52:16.000Z",
    "bap_id": "api.example-bap.com",
    "transaction_id": "cf7bb367-c820-4bc9-9be8-f548e0bbf222",
    "message_id": "764b4322-8f7c-402c-b907-80484e9ad40c",
    "version": "2.0.0",
    "action": "init",
    "bap_uri": "https://api.example-bap.com/beckn/",
    "ttl": "PT30S",
    "bpp_id": "api.unreserved-entry-pass.com",
    "bpp_uri": "https://api.unreserved-entry-pass.com/beckn/"
  },
  "message": {
    "order": {
      "items": [
        {
          "id": "I1",
          "parent_item_id": "I0",
          "quantity": {
            "selected": {
              "count": 1
            }
          },
          "add_ons": [
            {
              "id": "A1",
              "quantity": {
                "selected": {
                  "count": 1
                }
              }
            }
          ]
        },
        {
          "id": "I2",
          "parent_item_id": "I0",
          "quantity": {
            "selected": {
              "count": 1
            }
          },
          "add_ons": [
            {
              "id": "A1",
              "quantity": {
                "selected": {
                  "count": 1
                }
              }
            }
          ]
        },
        {
          "id": "I5",
          "parent_item_id": "I0",
          "quantity": {
            "selected": {
              "count": 1
            }
          }
        }
      ],
      "fulfillments": [
        {
          "id": "F1",
          "stops": [
            {
              "type": "START",
              "time": {
                "timestamp": "2024-06-28T05:00:16.000Z"
              }
            }
          ]
        }
      ],
      "billing": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+91-9897867564"
      },
      "provider": {
        "id": "P1"
      },
      "payments": [
        {
          "collected_by": "BAP",
          "status": "NOT-PAID",
          "type": "PRE-ORDER"
        }
      ],
      "tags": [
        {
          "descriptor": {
            "code": "BAP_TERMS",
            "name": "BAP Terms of Engagement"
          },
          "display": false,
          "list": [
            {
              "descriptor": {
                "code": "BUYER_FINDER_FEES_PERCENTAGE"
              },
              "value": "1"
            },
            {
              "descriptor": {
                "code": "BUYER_FINDER_FEES_TYPE"
              },
              "value": "percent"
            },
            {
              "descriptor": {
                "code": "STATIC_TERMS"
              },
              "value": "https://api.example-bap.com/booking/terms"
            },
            {
              "descriptor": {
                "code": "SETTLEMENT_BASIS"
              },
              "value": "https://api.example-bap.com/booking/terms"
            },
            {
              "descriptor": {
                "code": "SETTLEMENT_WINDOW"
              },
              "value": "P30D"
            }
          ]
        }
      ]
    }
  }
}
    }
}
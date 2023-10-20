# Retail Logs Validation Utility

This utility is designed to validate the logs of transactions conducted on a network. It provides an easy way to test and validate the data using the provided API.

## Installation

To use this utility locally, follow these steps:

1. Clone the repository from GitHub:

   ```shell
   git clone https://github.com/bluecypher/retail-log-utility.git
   ```

2. Install the required dependencies:

   ```shell
   npm install
   ```

3. Run the server in a local environment:

   ```shell
   npm run dev
   ```

## API Usage

After starting the local server, you can use the API for log validation. You can make POST requests to the following endpoint:

```
http://localhost:3006/api/validate
```

### Sample Curl Request

You can use the following `curl` command to make a POST request to the validation endpoint:

```shell
curl --location --request POST 'http://localhost:3006/api/validate' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3AjQe2v39s-ZeiHTOm-dkGI1NK5rqN0Lj4.PLxLV6QlhCtGTHP2ZKe0a5OpHl2ng0oQ%2BAqWmd56POU' \
--data '{
    "domain": "",
    "version": "1.2.0",
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
        "cancel": {},
        "on_cancel": {},
        "track": {},
        "on_track": {},
        "status": {},
        "on_status": {}
    }
}'
```

### Using Postman

You can also import this `curl` command into Postman and replace the empty objects in the payload with your actual data. This allows for easy testing and validation of transaction logs.

That's it! You can now start using the Retail Logs Validation Utility to validate transaction logs on your local environment.

const axios = require('axios');
const url = 'https://buyer-backend.himira.co.in/clientApis/v2/select';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  Connection: 'keep-alive',
  'Content-Type': 'application/json',
  Origin: 'https://himira.co.in',
  Referer: 'https://himira.co.in/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'sec-ch-ua': `"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"`,
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': `"macOS"`,
};

const body = [
  {
    context: { domain: 'ONDC:RET10', city: '140301' },
    message: {
      cart: {
        items: [
          {
            id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d_5b14c846-ceb9-42cc-8447-9d384d9c6055',
            local_id: '5b14c846-ceb9-42cc-8447-9d384d9c6055',
            customisationState: {},
            quantity: { count: 1 },
            provider: {
              id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d',
              local_id: 'b241f344-ac37-47b7-b86b-cc346910759d',
              locations: [
                {
                  id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d_b241f344-ac37-47b7-b86b-cc346910759d',
                  local_id: 'b241f344-ac37-47b7-b86b-cc346910759d',
                },
              ],
            },
            customisations: null,
            hasCustomisations: false,
          },
        ],
      },
      fulfillments: [
        {
          end: {
            location: {
              gps: '30.755150504,76.654784844',
              address: { area_code: '140301' },
            },
          },
        },
      ],
    },
    userId: 'guestUser',
  },
];

const sendRequest = async (iteration) => {
  try {
    console.log(`Sending request ${iteration + 1}...`);

    const response = await axios.post(url, body, {
      headers: headers,
    });

    console.log(`Response ${iteration + 1}:`, response.data);
  } catch (error) {
    console.error(`Error in request ${iteration + 1}:`, error.message);
  }
};

const sendRequestsInLoop = async (times) => {
  for (let i = 0; i < times; i++) {
    await sendRequest(i);
  }
};

sendRequestsInLoop(100);

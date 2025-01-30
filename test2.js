const axios = require('axios');

const url = 'https://buyer-backend.himira.co.in/clientApis/v2/initialize_order';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaHAtZ292LXByb2QiLCJhdWQiOiJocC1nb3YtcHJvZCIsImF1dGhfdGltZSI6MTczNzk2NTc3NywidXNlcl9pZCI6ImpMM1NGRjZ4WFhaVGRwVFlrcFJUNVNwY3FEYzIiLCJzdWIiOiJqTDNTRkY2eFhYWlRkcFRZa3BSVDVTcGNxRGMyIiwiaWF0IjoxNzM3OTY1Nzc3LCJleHAiOjE3Mzc5NjkzNzcsInBob25lX251bWJlciI6Iis5MTk0NjczMDI0NTEiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis5MTk0NjczMDI0NTEiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.C1JGfC9QeyirTfeHWSg1QTbVoSwzz2mUU4Ha6frkOpV3cEM4ZyJJB8v7UHPGzuhmCGL6Q3boPEfcSyl7lwnLWIVonKn7XJh8IMvSeDDTacFlWy8THgmIOmM8b9aX1mfjheltSQkbHFIo7NOsCI7GuKwxRcv8xSaSObHo-1nG9ATQFcqpMt8TmG3x_ivNuftTGjN0ex2v4n_Scwi43b9lYo0jl3Q_4FTIc-7VP6T_CiK53zdsk_C4TBS-kHOKt8vmGGar4XNgoIkjWeBtrGrC2FEwTN1XU8MV5tfEvpsrgm4ZVGGlR_Z44_cpe-tHtyNnD19PmKmH5rsFA4gJ04aAbQ',
  'Content-Type': 'application/json',
  Origin: 'https://himira.co.in',
  Referer: 'https://himira.co.in/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
};

const body = [
  {
    context: { transaction_id: '169bd2be-edd7-43f0-a44c-947aa8ac170b', city: '140301', domain: 'ONDC:RET10' },
    message: {
      items: [
        {
          id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d_5b14c846-ceb9-42cc-8447-9d384d9c6055',
          local_id: '5b14c846-ceb9-42cc-8447-9d384d9c6055',
          tags: [
            { code: 'origin', list: [{ code: 'country', value: 'India' }] },
            { code: 'type', list: [{ code: 'type', value: 'item' }] },
            { code: 'image', list: [{ code: 'type', value: 'back_image' }, { code: 'url', value: 'https://i.ibb.co/72Vjqcq/green-chilly-picklw-250gm.png' }] },
            { code: 'veg_nonveg', list: [{ code: 'veg', value: 'yes' }] },
          ],
          fulfillment_id: 'Fulfillment1',
          quantity: { count: 1 },
          provider: {
            id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d',
            local_id: 'b241f344-ac37-47b7-b86b-cc346910759d',
            locations: [
              { id: 'seller.himira.co.in_ONDC:RET10_b241f344-ac37-47b7-b86b-cc346910759d_b241f344-ac37-47b7-b86b-cc346910759d', local_id: 'b241f344-ac37-47b7-b86b-cc346910759d' },
            ],
          },
          customisations: null,
          hasCustomisations: false,
          userId: '',
        },
      ],
      billing_info: {
        address: {
          name: 'sourabh',
          building: '7ba',
          street: 'Daun Majra',
          locality: 'Daun Majra',
          city: 'Kharar',
          state: 'Punjab',
          country: 'India',
          areaCode: '140301',
          tag: 'Home',
          lat: '30.755046',
          lng: '76.654761',
        },
        phone: '9467302451',
        name: 'sourabh',
        email: 'sourabh.saini@thewitslab.com',
      },
      delivery_info: {
        type: 'Delivery',
        phone: '9467302451',
        name: 'sourabh',
        email: 'sourabh.saini@thewitslab.com',
        location: {
          gps: '30.755046,76.654761',
          address: {
            name: 'sourabh',
            building: '7ba',
            street: 'Daun Majra',
            locality: 'Daun Majra',
            city: 'Kharar',
            state: 'Punjab',
            country: 'India',
            areaCode: '140301',
            tag: 'Home',
            lat: '30.755046',
            lng: '76.654761',
          },
        },
      },
      payment: { type: 'ON-ORDER' },
    },
    deviceId: '2e0332c358f8083d49e5816194409bc6',
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




export default async function checkout(amount, phoneNumber) {
  console.log(`checkout called with amount: ${amount}, phone: ${phoneNumber}`);
  phoneNumber = '254' + phoneNumber.slice(-9);
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  const seconds = ('0' + now.getSeconds()).slice(-2);
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

  const auth = btoa(process.env.MPESA_AUTH_CODE);
  // get passkey options
  var urlAuth = process.env.MPESA_AUTH_URL;
  // 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  // process.env.MPESA_AUTH_URL;

  const optionsAuth = {
    headers: {
      Authorization: 'Basic ' + auth,
    },
  };
  // get token and send push request  process.env.MPESA_CONSUMER_KEY
  return fetch(urlAuth, optionsAuth)
    .then((res) => res.json())
    .then((data) => {
      const token = data.access_token;
      console.log('successfully fetched token');

      const url = process.env.MPESA_PUSH_URL;
      // 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

      const passkey = process.env.MPESA_KEY;
      // 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
      const businessShortCode = 174379;
      const encodedPasswd = btoa(businessShortCode + passkey + timestamp);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          BusinessShortCode: 174379,
          Password: encodedPasswd,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: 174379,
          PhoneNumber: phoneNumber,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          // 'https://next-tailwind-ecoms.vercel.app/api/mpesa/callback',
          //process.env.MPESA_CALLBACK_URL,
          AccountReference: 'CompanyXLTD',
          TransactionDesc: 'Payment of X',
        }),
      };

      // send push request
      return fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          // insert this request to db
          console.log(
            `sent request for authorization to MPesa for :${phoneNumber}`
          );

          if (data.ResponseCode) {
            console.log('successful push request to users phone');

            return {
              ResponseCode: data.ResponseCode,
              CheckoutRequestID: data.CheckoutRequestID,
            };
          } else {
            console.log('failed push request to users phone');
            console.log(data);
            return {
              ResponseCode: data.errorCode,
              CheckoutRequestID: data.requestId,
            };
          }
        })
        .catch((err) => {
          console.log('error at mpesa push ' + err);
          return err;
        });
    })
    .catch((err) => {
      console.log('error at token getting part ' + err);
      return err;
    });
}

// checkout(1, '254724299623')
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// module.exports = { checkout };

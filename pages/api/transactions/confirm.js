import db from '../../../lib/db';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const obj = JSON.parse(req.body);

  const requestID = obj.Body.stkCallback.CheckoutRequestID;
  const resultCode = obj.Body.stkCallback.ResultCode;
  const mpesaReceiptNumber =
    obj.Body.stkCallback.CallbackMetadata.Item[1].Value;
  res.send({ ResultCode: '0', ResultDesc: 'Accepted' });
  console.log(`callback received for ${requestID}`);

  await db.connect();

  const order = await Order.findOne({ paymentResponseCode: requestID });
  if (order) {
    if (resultCode == 0) {
      order.paymentConfirmedAt = Date.now();
      order.paymentResult = {
        id: mpesaReceiptNumber,
        status: 'confirmed',
        email_address: 'null',
      };
      order.paymentResultCode = resultCode;
      order.paymentConfirmedAt = Date.now();
      await order.save();
      console.log('order confirmation successful');
      await db.disconnect();
    } else {
      order.isPaid = false;
      order.paymentResult = {
        status: 'failed',
      };
      await order.save();
      console.log('order not paid');
      await db.disconnect();
    }
  } else {
    console.log('order not found');
    await db.disconnect();
  }

  await db.disconnect();
};

export default handler;

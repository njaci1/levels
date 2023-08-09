import db from '../../../lib/db';
import distributeCommission from '../../../lib/distributeCommission';
import Transactions from '../../../models/Transactions';

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

  const entry = await Transactions.findOne({ paymentRequestID: requestID });
  if (entry) {
    if (resultCode == 0) {
      // update payment details in the database
      entry.paymentResultCode = resultCode;
      entry.mpesaReceiptNumber = mpesaReceiptNumber;
      entry.status = 'confirmed';
      await entry.save();
      console.log('confirmation successful');
      await db.disconnect();
      // trigger commission payment to all levels

      const result = await distributeCommission(
        entry.transactionAmount,
        entry.user
      );
      if (result) {
        await db.connect();
        entry.commissions = {
          level1: result.level1Inviter,
          level2: result.level2Inviter,
          level3: result.level3Inviter,
        };
        await entry.save();
        await db.disconnect();
        console.log(result);
      }
    } else {
      entry.paymentResultCode = resultCode;
      entry.status = 'failed';

      await entry.save();
      console.log('confirmation failed');
      await db.disconnect();
    }
  } else {
    console.log('transaction not found');
    await db.disconnect();
  }

  await db.disconnect();
};

export default handler;

import db from '../../../lib/db';
import distributeCommission from '../../../lib/distributeCommission';
import Transactions from '../../../models/Transactions';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const obj = JSON.parse(req.body);
  const {
    CheckoutRequestID: requestID,
    ResultCode: resultCode,
    CallbackMetadata,
  } = obj.Body.stkCallback;
  const mpesaReceiptNumber = CallbackMetadata.Item[1].Value;

  res.status(200).json({ ResultCode: '0', ResultDesc: 'Accepted' });
  console.log(`callback received for ${requestID}`);

  await db.connect();

  try {
    const entry = await Transactions.findOne({ paymentRequestID: requestID });

    if (!entry) {
      console.log('Transaction not found');
      return;
    }

    if (resultCode === 0) {
      entry.paymentResultCode = resultCode;
      entry.mpesaReceiptNumber = mpesaReceiptNumber;
      entry.status = 'confirmed';
      await entry.save();

      console.log('Payment confirmation successful');

      const result = await distributeCommission(10000, entry.user); // hardcoded for now
      if (result) {
        entry.commissions = {
          level1: result.level1Inviter,
          level2: result.level2Inviter,
          level3: result.level3Inviter,
        };
        await entry.save();
        console.log(result);
      }
    } else {
      entry.paymentResultCode = resultCode;
      entry.status = 'failed';
      await entry.save();
      console.log('Payment confirmation failed');
    }
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    await db.disconnect();
  }
};

export default handler;

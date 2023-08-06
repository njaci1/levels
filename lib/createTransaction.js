import db from './db.js';
import Transactions from '../models/Transactions.js'; // Import the model directly
import pushToMpesa from '../utils/mpesa.js';
import generateTransactionId from '../utils/transactionID.js';

async function createTransaction(
  transactionAmount,
  userId,
  transType,
  phoneNumber
) {
  try {
    const result = await pushToMpesa(transactionAmount, phoneNumber);
    if (result) {
      console.log(result);
      const tId = generateTransactionId();
      await db.connect();
      const newTransaction = new Transactions({
        amount: transactionAmount,
        user: userId,
        transactionType: transType,
        transactionSubType: 'lipa',
        status: 'pending_confirmation',
        transactionId: tId,
        paymentRequestID: result.CheckoutRequestID,
        paymentResponseCode: result.ResponseCode,
      });

      await newTransaction.save();
      await db.disconnect();
      return result;
    } else {
      await db.disconnect();
      return result.ResponseCode;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error creating transaction');
  }
}

export default createTransaction;

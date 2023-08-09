import db from './db.js';
import Transaction from '../models/TransactionEntry.js';
import pushToMpesa from '../utils/mpesa.js';
import generateTransactionId from '../utils/transactionID.js';
import mongoose from 'mongoose';

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
      const newTransaction = new Transaction({
        amount: transactionAmount,
        user: userId,
        transactionType: transType,
        transactionSubType: 'lipa',
        status: 'pending_confirmation',
        transactionId: tId,
        paymentRequestID: result.CheckoutRequestID || result.requestId,
        paymentResponseCode: result.ResponseCode || result.errorCode,
      });

      await newTransaction.save();
      await db.disconnect();
      return result;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error creating transaction');
  }
}

export default createTransaction;

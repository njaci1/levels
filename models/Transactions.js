const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transactionAmount: Number, // The total transaction amount
    commissionAmount: Number, // The commission derived from the transaction
    transactionType: String, // The type of transaction
    transactionSubType: String, // The sub type of transaction
    status: String, // Status of the transaction
    transactionId: { type: String, unique: true },
    commissions: {
      level1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      level2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      level3: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    paymentRequestID: String,
    paymentResponseCode: String,
    paymentResultCode: String,
    mpesaReceiptNumber: String,
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Transactions =
  mongoose.models.Transactions ||
  mongoose.model('Transactions', TransactionSchema);

module.exports = Transactions;

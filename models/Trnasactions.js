const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, enum: ['earnings', 'withdrawal'] },
  level: { type: Number, enum: [1, 2, 3] }, // Only for 'earnings' type transactions
  date: { type: Date, default: Date.now },
});
const Transactions =
  mongoose.models.TransactionSchema ||
  mongoose.model('Transactions', TransactionSchema);

module.exports = Transactions;

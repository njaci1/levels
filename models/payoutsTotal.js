const mongoose = require('mongoose');

const PayoutsTotalSchema = new mongoose.Schema({
  totalPayouts: { type: Number, default: 0 }, // Overall revenue from ads
});

const payoutsTotal =
  mongoose.models.PayoutsTotal ||
  mongoose.model('payoutTotals', PayoutsTotalSchema);

export default payoutsTotal;
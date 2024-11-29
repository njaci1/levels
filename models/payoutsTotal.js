const mongoose = require('mongoose');

const payoutsTotalSchema = new mongoose.Schema({
  totalPayouts: { type: Number, default: 0 }, // Overall revenue from ads
});

const payoutsTotal =
  mongoose.models.payoutsTotal ||
  mongoose.model('payoutsTotal', payoutsTotalSchema);

export default payoutsTotal;

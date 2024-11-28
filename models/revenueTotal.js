const mongoose = require('mongoose');

const RevenueTotalSchema = new mongoose.Schema({
  totalRevenue: { type: Number, default: 0 }, // Overall revenue from ads
});

const revenueTotals =
  mongoose.models.revenueTotals ||
  mongoose.model('revenueTotals', RevenueTotalSchema);

export default revenueTotals;

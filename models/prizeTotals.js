const mongoose = require('mongoose');

const prizeTotalsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  currentAmount: { type: Number, default: 0 }, // Available winnings amount
});

const prizeTotals =
  mongoose.models.prizeTotals ||
  mongoose.model('prizeTotals', prizeTotalsSchema);

export default prizeTotals;

const mongoose = require('mongoose');

const jackpotEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  jackpotType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annual', 'welcome'],
    required: true,
  },
});

jackpotEntrySchema.index({ userId: 1, jackpotType: 1, timestamp: 1 });

const JackpotEntry =
  mongoose.models.JackpotEntry ||
  mongoose.model('JackpotEntry', jackpotEntrySchema);

module.exports = JackpotEntry;

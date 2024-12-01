const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jackpotType: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'annual', 'welcome'],
  },

  timestamp: { type: Date, default: Date.now },
});

const JackpotEntry =
  mongoose.models.JackpotEntry ||
  mongoose.model('JackpotEntry', JackpotEntrySchema);

export default JackpotEntry;

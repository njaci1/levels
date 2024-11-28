const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const winnersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jackpotType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annual', 'welcome'],
    required: true,
  },
  amount: { type: Number, required: true },
  indirectWinners: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      relation: { type: String, enum: ['level1', 'level2', 'level3'] },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const Winner =
  mongoose.models.Winner || mongoose.model('Winner', winnersSchema);
module.exports = Winner;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema for DailyJackpotEntry
const dailyJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

// Schema for WeeklyJackpotEntry
const weeklyJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});
weeklyJackpotEntrySchema.index({ userId: 1, timestamp: 1 });

// Schema for MonthlyJackpotEntry
const monthlyJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});
monthlyJackpotEntrySchema.index({ userId: 1, timestamp: 1 });

// Schema for AnnualJackpotEntry
const annualJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});
annualJackpotEntrySchema.index({ userId: 1, timestamp: 1 });

// Schema for WelcomeJackpotEntry
const welcomeJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

// Schema for Winners
const winnersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jackpotType: {
    type: String,
    enum: ['weekly', 'monthly', 'annual', 'welcome'],
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

// Schema for JackpotAllocation
const jackpotAllocationSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdsCollection' },
  joinersJP: Number,
  weeklyJP: Number,
  monthlyJP: Number,
  annualJP: Number,
  platformShare: Number,
  isNewAd: { type: Boolean, default: true }, // Flag for new ad vs. re-advertisement
  timestamp: { type: Date, default: Date.now },
});

// Compile models from the schemas

const DailyJackpotEntry =
  mongoose.models.DailyJackpotEntry ||
  mongoose.model('DailyJackpotEntry', dailyJackpotEntrySchema);
const WeeklyJackpotEntry =
  mongoose.models.WeeklyJackpotEntry ||
  mongoose.model('WeeklyJackpotEntry', weeklyJackpotEntrySchema);
const MonthlyJackpotEntry =
  mongoose.models.MonthlyJackpotEntry ||
  mongoose.model('MonthlyJackpotEntry', monthlyJackpotEntrySchema);
const AnnualJackpotEntry =
  mongoose.models.AnnualJackpotEntry ||
  mongoose.model('AnnualJackpotEntry', annualJackpotEntrySchema);
const WelcomeJackpotEntry =
  mongoose.models.WelcomeJackpotEntry ||
  mongoose.model('WelcomeJackpotEntry', welcomeJackpotEntrySchema);

const JackpotAllocation =
  mongoose.models.JackpotAllocation ||
  mongoose.model('JackpotAllocation', jackpotAllocationSchema);

module.exports = {
  DailyJackpotEntry,
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,

  JackpotAllocation,
};

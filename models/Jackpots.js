const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for UserEngagement
const userEngagementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adIds: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],

  count: {
    type: Number,
    default: 1,
  },
  timestamp: { type: Date, default: Date.now },
});
userEngagementSchema.index({ userId: 1 });

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

// Schema for JackpotTotals
const jackpotTotalsSchema = new mongoose.Schema({
  joinersTotal: { type: Number, default: 0 },
  weeklyTotal: { type: Number, default: 0 },
  monthlyTotal: { type: Number, default: 0 },
  annualTotal: { type: Number, default: 0 },
  platformShare: { type: Number, default: 0 },
});

// Compile models from the schemas
const UserEngagement =
  mongoose.models.UserEngagement ||
  mongoose.model('UserEngagement', userEngagementSchema);
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
const Winner =
  mongoose.models.Winner || mongoose.model('Winner', winnersSchema);

const JackpotAllocation =
  mongoose.models.JackpotAllocation ||
  mongoose.model('JackpotAllocation', jackpotAllocationSchema);

const JackpotTotals =
  mongoose.models.JackpotTotals ||
  mongoose.model('JackpotTotals', jackpotTotalsSchema);

module.exports = {
  UserEngagement,
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  Winner,
  JackpotAllocation,
  JackpotTotals,
};

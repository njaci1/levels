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

// Schema for WeeklyJackpotEntry
const weeklyJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

// Schema for MonthlyJackpotEntry
const monthlyJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

// Schema for AnnualJackpotEntry
const annualJackpotEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

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

module.exports = {
  UserEngagement,
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  Winner,
};

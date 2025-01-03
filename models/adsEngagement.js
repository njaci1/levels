const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the option schema for responses tracking
const responseOptionSchema = new Schema({
  optionId: { type: String, required: true }, // Option identifier
  count: { type: Number, default: 0 }, // Tracks the number of times this option is selected
});

// Define the question schema
const responseQuestionSchema = new Schema({
  questionId: { type: String, required: true }, // Question identifier
  options: [responseOptionSchema], // Array of options for this question
});

// Define the ads engagement schema
const adsEngagementSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'Ad' },
  engagement: {
    likes: { type: Number, default: 0 },
    doubleLikes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  responses: [responseQuestionSchema],
  timestamp: { type: Date, default: Date.now },
});
adsEngagementSchema.index({ adId: 1 });

const AdsEngagement =
  mongoose.models.AdsEngagement ||
  mongoose.model('AdsEngagement', adsEngagementSchema);

adsEngagementSchema.pre('findOneAndUpdate', function (next) {
  this.set({ timestamp: Date.now() });
  next();
});

module.exports = AdsEngagement;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the question schema with a Map for options
const responseQuestionSchema = new Schema({
  questionId: { type: String, required: true }, // Question identifier
  options: {
    type: Map,
    of: Number, // optionId as key, count as value
    default: {}, // Default empty map
  },
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

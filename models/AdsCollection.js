const mongoose = require('mongoose');

// Define the schema for ads
const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'banner', 'trivia'], // Type can be either 'video' or 'banner'
    required: true,
  },
  priority: {
    type: Number,
    default: 3,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },

  approvalStatus: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  // add duration field
  duration: {
    type: String,
    enum: ['1 week', '2 weeks', '1 month'],
    default: '1 week',
  },

  amountPaid: {
    type: Number,
    default: 0,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  expiryDate: {
    type: Date,
    default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, // Default value is the current date plus 30 days
  },
  // add filed for whetehr the ad has been extended or not
  extended: {
    type: Boolean,
    default: false,
  },
  // add a field for whetther add has been rebooked or not
  rebooked: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const triviaSchema = new mongoose.Schema({
  question: String,
  answers: [String],
  correctAnswer: String,
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },

  createdAt: { type: Date, default: Date.now },
});
const Trivia = mongoose.models.Trivia || mongoose.model('Trivia', triviaSchema);

const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);

module.exports = Ad;
module.exports = Trivia;

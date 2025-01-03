const mongoose = require('mongoose');
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
    enum: ['video', 'banner', 'trivia'],
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

  extended: {
    type: Boolean,
    default: false,
  },

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
  engagement: {
    likes: { type: Number, default: 0 },
    doubleLikes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }, // Tracks clicks on link/phone
    shares: { type: Number, default: 0 },
  },

  link: {
    type: String, // External URL
  },
  phone: {
    type: String,
  },
  cta: {
    type: String,
    enum: ['Shop Now', 'Grab Offer', 'More Details'],
    default: 'More Details',
  },
});

const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);

module.exports = Ad;

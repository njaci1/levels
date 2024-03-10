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
    enum: ['video', 'banner'], // Type can be either 'video' or 'banner'
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

  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
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

// Create the Ad model
const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);

// Export the Ad model
module.exports = Ad;

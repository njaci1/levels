// Import Mongoose
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
    required: true,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection (for future use if you implement user authentication)
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
const Ad = mongoose.model('Ad', adSchema);

// Export the Ad model
module.exports = Ad;

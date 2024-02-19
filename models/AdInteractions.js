const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  disliked: {
    type: Boolean,
    default: false,
  },
});

const Interaction =
  mongoose.model.Interaction ||
  mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
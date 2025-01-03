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
  doubleLiked: {
    type: Boolean,
    default: false,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  disliked: {
    type: Boolean,
    default: false,
  },
  viewed: {
    type: Number,
    default: 0,
  },
  answered: {
    type: String,
    enum: ['correct', 'incorrect'],
  },
  clicked: {
    type: Boolean,
    default: false,
  },
  shared: {
    type: Boolean,
    default: false,
  },
});

interactionSchema.pre('findOneAndUpdate', function (next) {
  this.set({ timestamp: Date.now() });
  next();
});

interactionSchema.pre('update', function (next) {
  this.set({ timestamp: Date.now() });
  next();
});

const Interaction =
  mongoose.models.Interaction ||
  mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;

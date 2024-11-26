const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

const UserEngagement =
  mongoose.models.UserEngagement ||
  mongoose.model('UserEngagement', userEngagementSchema);

userEngagementSchema.pre('findOneAndUpdate', function (next) {
  this.set({ timestamp: Date.now() });
  next();
});

module.exports = UserEngagement;

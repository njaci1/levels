const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    inviteCode: { type: String, default: shortid.generate }, // unique invite code
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    googleId: String,
    inviteesLevel1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    inviteesLevel2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    inviteesLevel3: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    earningsLevel1: { type: Number, default: 0 },
    earningsLevel2: { type: Number, default: 0 },
    earningsLevel3: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    withdrawals: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;

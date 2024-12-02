const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JackpotBackupSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jackpotType: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'annual', 'welcome'],
  },
  entries: [
    {
      _id: { type: Schema.Types.ObjectId },
      timestamp: { type: Date, required: true },
    },
  ],
  backupDate: { type: Date, default: Date.now },
});

const JackpotBackup =
  mongoose.models.JackpotBackup ||
  mongoose.model('JackpotBackup', JackpotBackupSchema);

export default JackpotBackup;

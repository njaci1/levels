import db from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  await db.connect();
  try {
    // Fetch user by _id from the request body
    const user = await User.findById(_id).select(
      '-password -createdAt -updatedAt -inviter'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count invitees at different levels
    const inviteesLevel1Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel1 },
    });
    const inviteesLevel2Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel2 },
    });
    const inviteesLevel3Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel3 },
    });

    // Calculate total earnings
    const totalEarnings = Math.floor(
      user.earningsLevel0 +
        user.earningsLevel1 +
        user.earningsLevel2 +
        user.earningsLevel3
    );

    // Return response
    res.status(200).json({
      inviteesLevel1Count,
      inviteesLevel2Count,
      inviteesLevel3Count,
      earningsLevel0: user.earningsLevel0,
      earningsLevel1: user.earningsLevel1,
      earningsLevel2: user.earningsLevel2,
      earningsLevel3: user.earningsLevel3,
      totalEarnings,
      balance: user.balance,
      withdrawals: user.withdrawals,
    });
  } catch (error) {
    console.error('Error fetching invitee levels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

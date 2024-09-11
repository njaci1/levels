import db from '../../../lib/db';
import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Get session from request
  const session = await getSession({ req });

  // If no session found, user is not authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.connect();
  try {
    // Fetch invitee levels from the user database
    const user = await User.findById(session.user._id).select(
      '-password -createdAt -updatedAt -inviter'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inviteesLevel1Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel1 },
    });
    const inviteesLevel2Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel2 },
    });
    const inviteesLevel3Count = await User.countDocuments({
      _id: { $in: user.inviteesLevel3 },
    });

    const totalEarnings = Math.floor(
      user.earningsLevel0 +
        user.earningsLevel1 +
        user.earningsLevel2 +
        user.earningsLevel3
    );

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

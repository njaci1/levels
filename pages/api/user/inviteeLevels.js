// pages/api/user/inviteeLevels.js

import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Get session from request
  const session = await getSession({ req });

  // If no session found, user is not authenticated
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Fetch invitee levels from the user database
  const user = await User.findById(session.user._id);
  const {
    inviteesLevel1,
    inviteesLevel2,
    inviteesLevel3,
    earningsLevel1,
    earningsLevel2,
    earningsLevel3,
    totalEarnings,
    balance,
    withdrawals,
  } = user;

  // Send the levels as response
  res
    .status(200)
    .json({
      inviteesLevel1,
      inviteesLevel2,
      inviteesLevel3,
      earningsLevel1,
      earningsLevel2,
      earningsLevel3,
      totalEarnings,
      balance,
      withdrawals,
    });
}

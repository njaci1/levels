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
  const user = await User.findById(session.user._id).select(
    '-password -createdAt -updatedAt -inviter'
  );
  var {
    inviteesLevel1,
    inviteesLevel2,
    inviteesLevel3,
    earningsLevel0,
    earningsLevel1,
    earningsLevel2,
    earningsLevel3,
    totalEarnings,
    balance,
    withdrawals,
  } = user;
  const inviteesLevel1Count = await User.countDocuments({
    _id: { $in: user.inviteesLevel1 },
  });
  const inviteesLevel2Count = await User.countDocuments({
    _id: { $in: user.inviteesLevel2 },
  });
  const inviteesLevel3Count = await User.countDocuments({
    _id: { $in: user.inviteesLevel3 },
  });

  totalEarnings = Math.floor(
    earningsLevel0 + earningsLevel1 + earningsLevel2 + earningsLevel3
  );

  // console.log(user);

  // Send the levels as response
  res.status(200).json({
    inviteesLevel1Count,
    inviteesLevel2Count,
    inviteesLevel3Count,
    earningsLevel0,
    earningsLevel1,
    earningsLevel2,
    earningsLevel3,
    totalEarnings,
    balance,
    withdrawals,
  });
}

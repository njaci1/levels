import db from '../../../../lib/db';
import User from '../../../../models/User';
import { WelcomeJackpotEntry } from '../../../../models/Jackpots';

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  if (method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await db.connect();
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { registrationStatus: 'complete' },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    await updateInviterNetwork(user);

    // Enter user to the welcome jackpot
    await WelcomeJackpotEntry.create({ userId: user._id });

    res.status(200).json({ message: 'Signup completed!' });
  } catch (error) {
    console.error('Error completing signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

async function updateInviterNetwork(user) {
  try {
    const inviter = await User.findById(user.inviter);
    if (!inviter) return;

    inviter.inviteesLevel1.push(user._id);
    await inviter.save();

    if (inviter.inviteCode !== 'TD5tkLcdE') {
      const inviterL2 = await User.findById(inviter.inviter);
      if (inviterL2) {
        inviterL2.inviteesLevel2.push(user._id);
        await inviterL2.save();

        const inviterL3 = await User.findById(inviterL2.inviter);
        if (inviterL3) {
          inviterL3.inviteesLevel3.push(user._id);
          await inviterL3.save();
        }
      }
    }
  } catch (error) {
    console.error('Error updating inviter network:', error);
    throw new Error('Network update failed');
  }
}

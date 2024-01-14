import db from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await db.connect();
  try {
    // Find the user and update their registrationStatus
    console.log(id);
    const user = await User.findByIdAndUpdate(
      id,
      { registrationStatus: 'complete' },
      { new: true }
    );

    let inviter = await User.findById(user.inviter);

    // Check if the inviter is not the seed user before updating ancestors

    inviter.inviteesLevel1.push(user._id);
    await inviter.save();
    if (inviter.inviteCode !== 'TD5tkLcdE') {
      console.log('inviter is not seed user');
      console.log(inviter.inviter);
      if (inviter.inviter) {
        const inviterL2 = await User.findById(inviter.inviter);
        inviterL2.inviteesLevel2.push(user._id);
        await inviterL2.save();

        if (inviterL2.inviter) {
          console.log('going to level 3');
          let inviterL3 = await User.findById(inviterL2.inviter);
          inviterL3.inviteesLevel3.push(user._id);
          await inviterL3.save();
        }
      }
      console.log('network updated');
    }
    res.status(200).send({
      message: 'Signup completed!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
  await db.disconnect();
}

import db from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `${req.method} not supported` });
  }
  const {
    f_name: firstName,
    l_name: lastName,
    inviteCode,
    email: username,
    password,
    phoneNumber,
  } = req.body;

  if (
    !firstName ||
    firstName.trim() === '' ||
    !username ||
    username.trim() === '' ||
    !password ||
    password.trim().length < 5
  ) {
    return res.status(422).json({ message: 'Validation error' });
  }

  await db.connect();

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(422).json({ message: 'User already exists' });
    }

    // Find the inviter by invite code
    let inviter = inviteCode ? await User.findOne({ inviteCode }) : null;
    if (!inviter) {
      inviter = await User.findOne({ inviteCode: 'TD5tkLcdE' }); // Seed user fallback
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      firstName,
      lastName,
      phoneNumber,
      password,
      inviter: inviter._id,
    });

    const user = await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      _id: user._id,
      f_name: user.firstName,
      inviteCode: user.inviteCode,
      level1: user.inviteesLevel1,
      level2: user.inviteesLevel2,
      level3: user.inviteesLevel3,
      status: user.registrationStatus,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnect();
  }
}

export default handler;

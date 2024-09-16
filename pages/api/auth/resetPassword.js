import bcrypt from 'bcrypt';
import User from '../../../models/User';
import db from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).json({ message: `${req.method} not supported` });
  }

  const { email, password, code } = req.body;
  console.log({ email, password, code });

  if (!code || !email || (password && password.trim().length < 5)) {
    return res.status(422).json({ message: 'Input validation error' });
  }

  await db.connect();

  try {
    const toUpdateUser = await User.findOne({ username: email });

    console.log({ toUpdateUser });

    if (toUpdateUser && toUpdateUser.resetCode == code) {
      toUpdateUser.password = password;
      await toUpdateUser.save();
      res.status(200).json({ message: 'Password updated successfully!' });
    } else {
      res.status(422).json({ message: 'Wrong code' });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await db.disconnect();
  }
}

export default handler;

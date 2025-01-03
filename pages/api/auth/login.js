import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../../models/User';
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  await db.connect();
  const user = await User.findOne({ username: email });

  if (!user) {
    await db.disconnect();
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await db.disconnect();
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT payload
  const payload = {
    _id: user._id,
    name: user.firstName,
    username: user.username,
    role: user.role,
    image: 'f',
    inviteCode: user.inviteCode,
    phoneNumber: user.phoneNumber,
    registrationStatus: user.registrationStatus,
    balance: user.balance,
    adsWatched: user.adsWatched,
  };

  // Sign the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
}

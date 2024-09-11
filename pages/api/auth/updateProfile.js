import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../lib/db';
import { getToken } from 'next-auth/jwt';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: `${req.method} not supported` });
  }

  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({ message: 'Signin required' });
  }

  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    return res.status(422).json({ message: 'Input validation error' });
  }

  await db.connect();
  try {
    const toUpdateUser = await User.findById(user._id);
    toUpdateUser.name = name;
    toUpdateUser.email = email;

    if (password) {
      toUpdateUser.password = bcryptjs.hashSync(password);
    }

    await toUpdateUser.save();
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await db.disconnect();
  }
}

export default handler;

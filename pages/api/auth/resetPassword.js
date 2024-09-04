import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { email, password, code } = req.body;

  if (!code || !email || (password && password.trim().length < 5)) {
    res.status(422).json({
      message: 'Input validation error',
    });
    return;
  }

  await db.connect();
  const toUpdateUser = await User.findOne({ email: email });
  if (toUpdateUser.passwordResetCode === code) {
    toUpdateUser.password = bcryptjs.hashSync(password);
    await toUpdateUser.save();
    await db.disconnect();
    res.send({
      message: 'Password updated successfully!',
    });
  } else {
    res.status(422).json({
      message: 'Wrong code',
    });
    await db.disconnect();
    return;
  }
}

export default handler;

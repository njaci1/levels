import sgMail from '@sendgrid/mail';
import db from '../../../lib/db';
import User from '../../../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function handler(req, res) {
  try {
    // Fetch user from the database
    const email = req.body.email;
    await db.connect();
    const user = await User.findOne({ username: email });

    if (!user) {
      await db.disconnect();
      return res.status(404).send({ message: 'User not found' });
    }

    // Generate a verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // 6-digit code

    // Update the user with the verification code
    user.resetCode = verificationCode;
    await user.save();

    // Send the verification code via email
    const message = `Your password reset code is ${verificationCode}`;
    const msg = {
      to: email,
      from: 'kevlaude@gmail.com',
      subject: 'Password reset code',
      text: message,
      html: `<p>${message}</p>`,
    };

    await sgMail.send(msg).then(() => {
      res.send({
        message: 'Password reset code sent successfully!',
      });
    });

    await db.disconnect();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default handler;

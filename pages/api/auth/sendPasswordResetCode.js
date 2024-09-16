import sgMail from '@sendgrid/mail';
import db from '../../../lib/db';
import User from '../../../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function handler(req, res) {
  const { email } = req.body;

  try {
    await db.connect();
    const user = await User.findOne({ username: email });
    const passwordResetLink = process.env.RESET_PASSWORD_URLRESET_PASSWORD_URL;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Update the user with the verification code
    user.resetCode = verificationCode;
    await user.save();

    // Send the verification code via email
    const msg = {
      to: email,
      from: 'kevlaude@gmail.com',
      subject: 'Password reset code',
      text: `Your password reset code is ${verificationCode}. Use this link to reset your password ${passwordResetLink}`,
      html: `<p>Your password reset code is ${verificationCode}. Use this link to reset your password ${passwordResetLink}</p>`,
    };
    console.log({ username: email, resetCode: verificationCode });

    await sgMail.send(msg);

    res.status(200).json({ message: 'Password reset code sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

export default handler;

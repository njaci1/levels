import sgMail from '@sendgrid/mail';
// import crypto from 'crypto';

import db from '../../../utils/db';
import user from '../../../models/User';

// Function to generate a random verification code
function generateVerificationCode() {
  //   return crypto.randomBytes(3).toString('hex'); // generates a 6 characters long code
  return Math.floor(10000 + Math.random() * 90000); // generates a 5 digit number
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const { email } = req.body;

  await db.connect();
  const userToReset = await user.findOne({ email: email });
  if (userToReset) {
    const verificationCode = generateVerificationCode();

    userToReset.passwordResetCode = verificationCode;
    await userToReset.save();
    await db.disconnect();

    // Send the email
    const resetLink = process.env.RESET_PASSWORD_URL;

    let message = `Please use this ${verificationCode} to reset your password. Use this link ${resetLink}`;

    const msg = {
      to: email,

      from: 'kevlaude@gmail.com', // Use the email address or domain you verified above
      subject: 'Password reset code',
      text: message,
      html: `<p>${message}</p>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
        res.send({
          message: 'Password reset code sent successfully!',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    res.status(422).json({ message: 'User not exist. Check email' });
    await db.disconnect();
    return;
  }
}

export default handler;

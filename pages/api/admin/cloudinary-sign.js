const cloudinary = require('cloudinary').v2;

export default function signature(req, res) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_SECRET
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
}

import db from '../../lib/db';
import Ad from '../../models/AdsCollection';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await db.connect();

  try {
    const newAd = new Ad({
      title: req.body.title,
      description: req.body.description,
      type: 'video',
      duration: req.body.duration,
      amountPaid: req.body.amountPaid,
      videoUrl: req.body.secure_url,
      cloudinaryId: req.body.public_id,
    });

    await newAd.save();
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error uploading ad:', error);
    res.status(500).json({ message: 'Failed to upload ad to db' });
  } finally {
    await db.disconnect();
  }
}

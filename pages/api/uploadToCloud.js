import db from '../../lib/db';
import Ad from '../../models/AdsCollection';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Create an entry in the database
      await db.connect();
      const newAd = new Ad({
        title: req.body.title,
        description: req.body.description,
        type: 'video',
        videoUrl: req.body.secure_url,
        cloudinaryId: req.body.public_id,
      });
      await newAd.save();
      await db.disconnect();

      // Return the response
      res.status(200).json({ message: 'ad uploaded to db successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload ad to db' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

import db from '../../../lib/db';
import Ad from '../../../models/AdsCollection';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch ads from the database
      await db.connect();
      const ads = await Ad.find({ approvalStatus: 'approved' });
      res.status(200).json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      // Fetch ads with pending status from the database for review
      await db.connect();
      const ads = await Ad.find({ approvalStatus: 'pending' });
      res.status(200).json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
  await db.disconnect();
}

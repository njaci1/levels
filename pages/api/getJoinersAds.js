import db from '../../lib/db';
import Ad from '../../models/AdsCollection';

export default async function handler(req, res) {
  try {
    await db.connect();
    // Query the database for ads with a priority of 7
    const ads = await Ad.find({ priority: 7 }).select('videoUrl').limit(3);
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'Failed to get joiners ads' });
  } finally {
    await db.disconnect();
  }
}

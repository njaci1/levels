import db from '../../lib/db';
import Ad from '../../models/AdsCollection'; // Import the Ad model

export default async function handler(req, res) {
  // Connect to the database
  await db.connect();

  try {
    // Query the database for ads with a rating of 1
    const ads = await Ad.find({ priority: 7 }).select('videoUrl').limit(3);

    // Return the ads
    res.status(200).json(ads);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Failed to get joiners ads' });
  }
  await db.disconnect();
}

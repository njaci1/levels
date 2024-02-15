import Ad from '../../models/AdsCollection'; // Import the Ad model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch ads from the database
    const ads = await Ad.find({});
    res.status(200).json(ads); // Send the fetched ads as JSON response
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

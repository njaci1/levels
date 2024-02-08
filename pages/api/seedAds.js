import seedAds from '../../utils/sampleAds';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle any method other than POST
    res.status(405).send({ message: 'Method not allowed' });
    return;
  }

  try {
    await seedAds();
    res.status(200).send({ message: 'Database seeded successfully' });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Failed to seed database', error: error.message });
  }
}

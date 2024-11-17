import seedAdminDatabase from '../../utils/adminUser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await seedAdminDatabase();
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to seed database', error: error.message });
  }
}

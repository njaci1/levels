import exp from 'constants';
import db from '../lib/db';

import AdminUser from '../models/AdminUser';

export default async function seedDatabase(req, res) {
  db.connect();
  const seedUser = await AdminUser.findOne({ username: 'adminUser' });

  try {
    if (!seedUser) {
      // Create the seed user
      const admin = new AdminUser({
        firstName: 'Admin',
        lastName: 'User',
        username: 'adminUser',
        email: 'adminUser@test.com',
        password: 'AdminseedPassword',
      });
      admin.save();
      res.status(200).json({ message: 'Database seeded successfully' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to seed database', error: error.message });
  } finally {
    db.disconnect();
  }
}

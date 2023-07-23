import exp from 'constants';
import db from '../lib/db';
import User from '../models/User';

export default async function seedDatabase(req, res) {
  db.connect();
  const seedUser = await User.findOne({ username: 'seedUser' });

  if (!seedUser) {
    // Create the seed user
    const user = new User({
      firstName: 'Seed',
      lastName: 'User',
      username: 'seedUser@test.com',
      password: 'seedPassword', // You may want to use a stronger password in practice
      phoneNumber: '000-000-0000', // or any default phone number
    });

    // Save the seed user
    user.save();
  } else {
    console.log('Seed user already exists');
  }
}

import db from '../../lib/db';
import {
  UserEngagement,
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
} from '../../models/Jackpots';
import Interaction from '../../models/AdInteractions';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, adId } = req.body;

    // Connect to the database
    await db.connect();

    // Try to find user has ever liked this ad before, look in the ad interactions
    let interaction = await Interaction.findOne({
      userId,
      adId,
      $or: [{ liked: true }, { disliked: true }, { doubleliked: true }],
    });
    console.log(interaction);
    // if interaction exists, the user has interacted with the ad before and we should not increment count in the user engagement.
    if (!interaction) {
      // check if the userId exist in the user engagement collection
      let entry = await UserEngagement.findOne({ userId: userId });

      // if entry exists, increment the count in the user engagement
      if (entry) {
        entry.count += 1;
        await entry.save();

        if (entry.count === 10 || entry.count % 10 === 0) {
          // If the count reaches 10, add an entry to the weekly jackpot
          await WeeklyJackpotEntry.create({ userId });
        }
        if (entry.count === 20 || entry.count % 20 === 0) {
          // If the count reaches 100, add an entry to the monthly jackpot
          await MonthlyJackpotEntry.create({ userId });
        }
        if (entry.count === 30 || entry.count % 30 === 0) {
          // If the count reaches 1000, add an entry to the annual jackpot
          await AnnualJackpotEntry.create({ userId });
        }
      } else {
        // If userId doesn't exists, create a new one
        entry = await UserEngagement.create({ userId });
      }
    }
    res.status(200).json({ message: 'count incremented' });
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  db.disconnect();
}

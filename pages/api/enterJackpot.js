import db from '../../lib/db';
import {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  DailyJackpotEntry,
} from '../../models/Jackpots';
import UserEngagement from '../../models/UserEngagement';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, adId } = req.body;
    console.log('handling jackpot entry');

    await db.connect();

    try {
      // Try to find if the user has ever liked this ad before, look in the ad interactions
      // let interaction = await Interaction.findOne({
      //   userId,
      //   adId,
      //   $or: [{ liked: true }, { disliked: true }, { doubleliked: true }],
      // });

      // // If interaction exists, the user has interacted with the ad before and we should not increment count in the user engagement.
      // if (!interaction) {
      // Check if the userId exists in the user engagement collection
      let entry = await UserEngagement.findOne({ userId: userId });

      // If entry exists, increment the count in the user engagement
      if (entry) {
        entry.count += 1;
        await entry.save();

        // If the count reaches 10, add an entry to the weekly jackpot
        if (entry.count === 2 || entry.count % 2 === 0) {
          console.log('adding daily jackpot entry');
          await DailyJackpotEntry.create({ userId });
        }

        // If the count reaches 10, add an entry to the weekly jackpot
        if (entry.count === 3 || entry.count % 3 === 0) {
          console.log('adding weekly jackpot entry');
          await WeeklyJackpotEntry.create({ userId });
        }

        // If the count reaches 20, add an entry to the monthly jackpot
        if (entry.count === 4 || entry.count % 4 === 0) {
          console.log('adding monthly jackpot entry');
          await MonthlyJackpotEntry.create({ userId });
        }

        // If the count reaches 30, add an entry to the annual jackpot
        if (entry.count === 5 || entry.count % 5 === 0) {
          console.log('adding annual jackpot entry');
          await AnnualJackpotEntry.create({ userId });
        }
      } else {
        // If userId doesn't exist, create a new one
        console.log('first time engagement with ad');
        entry = await UserEngagement.create({ userId });
      }

      res.status(200).json({ message: 'count incremented' });
    } catch (error) {
      console.error('Error processing engagement:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await db.disconnect();
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

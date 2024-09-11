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

    await db.connect();

    try {
      // Try to find if the user has ever liked this ad before, look in the ad interactions
      let interaction = await Interaction.findOne({
        userId,
        adId,
        $or: [{ liked: true }, { disliked: true }, { doubleliked: true }],
      });

      // If interaction exists, the user has interacted with the ad before and we should not increment count in the user engagement.
      if (!interaction) {
        // Check if the userId exists in the user engagement collection
        let entry = await UserEngagement.findOne({ userId: userId });

        // If entry exists, increment the count in the user engagement
        if (entry) {
          entry.count += 1;
          await entry.save();

          // If the count reaches 10, add an entry to the weekly jackpot
          if (entry.count === 10 || entry.count % 10 === 0) {
            await WeeklyJackpotEntry.create({ userId });
          }

          // If the count reaches 20, add an entry to the monthly jackpot
          if (entry.count === 20 || entry.count % 20 === 0) {
            await MonthlyJackpotEntry.create({ userId });
          }

          // If the count reaches 30, add an entry to the annual jackpot
          if (entry.count === 30 || entry.count % 30 === 0) {
            await AnnualJackpotEntry.create({ userId });
          }
        } else {
          // If userId doesn't exist, create a new one
          entry = await UserEngagement.create({ userId });
        }
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

import db from '../../lib/db';
import Interaction from '../../models/AdInteractions';
import User from '../../models/User';
import UserEngagement from '../../models/UserEngagement';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { adId, userId, doubleLiked, liked, disliked, adsWatched } = req.body;

  try {
    await db.connect();

    // Update the user's ads watched count
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { adsWatched: adsWatched } }
    );

    // Check if interaction exists
    let interaction = await Interaction.findOne({ adId, userId });

    if (interaction) {
      // Update interaction if it exists
      interaction.doubleLiked = doubleLiked;
      interaction.liked = liked;
      interaction.disliked = disliked;

      await interaction.save();
      res.status(200).json({ message: 'interaction updated' });
    } else {
      // Create a new interaction if it doesn't exist
      interaction = await Interaction.create({
        adId,
        userId,
        doubleLiked,
        liked,
        disliked,
      });
      try {
        // Check if the userId exists in the user engagement collection
        let entry = await UserEngagement.findOne({ userId: userId });

        // If entry exists, increment the count in the user engagement
        if (entry) {
          entry.count += 1;
          await entry.save();

          // If the count reaches 10, add an entry to the weekly jackpot
          if (entry.count === 2 || entry.count % 2 === 0) {
            console.log('adding weekly jackpot entry');
            await WeeklyJackpotEntry.create({ userId });
          }

          // If the count reaches 20, add an entry to the monthly jackpot
          if (entry.count === 3 || entry.count % 3 === 0) {
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
      }
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

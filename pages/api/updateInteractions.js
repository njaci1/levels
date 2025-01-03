import db from '../../lib/db';
import Interaction from '../../models/AdInteractions';
import User from '../../models/User';
import UserEngagement from '../../models/UserEngagement';
import AdsEngagement from '../../models/adsEngagement';
import Ad from '../../models/AdsCollection';
import JackpotEntry from '../../models/JackpotEntry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { adId, userId, doubleLiked, liked, disliked, adsWatched, clicked } =
    req.body;

  try {
    await db.connect();

    // Update the user's ads watched count
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { adsWatched: adsWatched } }
    );

    // update ad interactions

    const updateFields = {};
    if (liked) updateFields['engagement.likes'] = 1;
    if (disliked) updateFields['engagement.dislikes'] = 1;
    if (doubleLiked) updateFields['engagement.doubleLikes'] = 1;
    if (clicked) updateFields['engagement.clicks'] = 1;

    const result = await AdsEngagement.findByIdAndUpdate(
      adId,
      { $inc: updateFields },
      { upsert: true, new: true } // Return the updated document
    );

    if (!result) {
      throw new Error(`Ad with ID ${adId} not found`);
    }

    // Check if interaction exists
    let interaction = await Interaction.findOne({ adId, userId });

    if (interaction) {
      // Update interaction if it exists
      interaction.doubleLiked = doubleLiked;
      interaction.liked = liked;
      interaction.disliked = disliked;

      await interaction.save();
      console.log('interaction updated');
      res.status(200).json({ message: 'interaction updated' });
    } else {
      console.log('creating new interaction');
      // Create a new interaction if it doesn't exist
      interaction = await Interaction.create({
        adId,
        userId,
        doubleLiked,
        liked,
        disliked,
        clicked,
      });
      res.status(200).json({ message: 'success' });
      try {
        let entry = await UserEngagement.findOne({ userId });

        if (entry) {
          entry.count += 1;
          await entry.save();

          const types = [
            { count: 2, jackpotType: 'daily' },
            { count: 3, jackpotType: 'weekly' },
            { count: 4, jackpotType: 'monthly' },
            { count: 5, jackpotType: 'annual' },
          ];

          for (const { count, jackpotType } of types) {
            if (entry.count === count || entry.count % count === 0) {
              console.log(`Adding ${jackpotType} jackpot entry`);
              await JackpotEntry.create({ userId, jackpotType });
            }
          }
        } else {
          console.log('First-time engagement with ad');
          entry = await UserEngagement.create({ userId });
        }
      } catch (error) {
        console.error('Error updating jackpot entries:', error);
      }
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

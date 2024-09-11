import db from '../../lib/db';
import Interaction from '../../models/AdInteractions';
import User from '../../models/User';

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
      interaction.viewed += 1;
      await interaction.save();
    } else {
      // Create a new interaction if it doesn't exist
      interaction = await Interaction.create({
        adId,
        userId,
        doubleLiked,
        liked,
        disliked,
        viewed: 1,
      });
    }

    res.status(200).json(interaction);
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

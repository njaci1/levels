import db from '../../lib/db';
import Interaction from '../../models/AdInteractions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { adId, userId } = req.body;

  try {
    await db.connect();

    // Try to find an existing interaction
    let interaction = await Interaction.findOne({ adId, userId });

    if (interaction) {
      // Increment the viewed field if interaction exists
      interaction.viewed += 1;
      await interaction.save();
      console.log(
        `incremented views for ad ${adId} by user ${userId} to ${interaction.viewed}`
      );
    } else {
      // Create a new interaction if it doesn't exist
      interaction = await Interaction.create({ adId, userId, viewed: 1 });
      console.log(`created new interaction for ad ${adId} by user ${userId}`);
    }

    res.status(200).json(interaction);
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}

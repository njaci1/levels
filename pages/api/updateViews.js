import db from '../../lib/db'; // Import your database connection utility
import Interaction from '../../models/AdInteractions'; // Import your Interaction model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { adId, userId } = req.body;

    // Connect to the database
    await db.connect();

    // Try to find an existing interaction
    let interaction = await Interaction.findOne({ adId, userId });

    if (interaction) {
      // If an interaction exists, update it
      interaction.viewed += 1; // Increment the viewed field
      await interaction.save();
    } else {
      // If no interaction exists, create a new one
      interaction = await Interaction.create({
        viewed: 1,
      });
    }

    res.status(200).json(interaction);
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  db.disconnect();
}

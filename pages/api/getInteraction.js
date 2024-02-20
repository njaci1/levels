// pages/api/interactionsGet.js

import db from '../../lib/db'; // Import your database connection utility
import Interaction from '../../models/AdInteractions'; // Import your Interaction model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { adId, userId } = req.query;

    // Connect to the database
    await db.connect();

    // Try to find an existing interaction
    let interaction = await Interaction.findOne({ adId, userId });

    if (interaction) {
      // If an interaction exists, return it
      res.status(200).json(interaction);
    } else {
      // If no interaction exists, return an error
      res.status(404).json({ message: 'No interaction found' });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

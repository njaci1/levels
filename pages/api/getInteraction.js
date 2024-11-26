import db from '../../lib/db';
import Interaction from '../../models/AdInteractions';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { adId, userId } = req.query;

    await db.connect();
    try {
      // Try to find an existing interaction
      const interaction = await Interaction.findOne({ adId, userId });

      if (interaction) {
        res.status(200).json(interaction); // Return the interaction
      } else {
        res.status(201).json('This is a new interaction');
      }
    } catch (error) {
      console.error('Error fetching interaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await db.disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

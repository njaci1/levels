import jackpotSnapshot from '../../lib/jackpotSnapshot';

export default async function handler(req, res) {
  try {
    const totals = await jackpotSnapshot();

    res.status(200).json(totals);
  } catch (error) {
    console.error('Error fetching jackpot snapshot:', error);
    res.status(500).json({ message: 'Failed to retrieve jackpot totals' });
  }
}

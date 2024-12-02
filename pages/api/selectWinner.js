import runJackpot from '../../lib/runJackpot';

export default async function handler(req, res) {
  try {
    // const winner = await runJackpot('daily');
    res.status(200).json(winner);
  } catch (error) {
    console.error('Error running jackpot:', error);
    res
      .status(500)
      .json({ message: 'Failed to run the jackpot', error: error.message });
  }
}

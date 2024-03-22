import { getJackpots } from '../../lib/jackpotSnapshot';

export default async function handler(req, res) {
  const totals = getJackpots();

  console.log('totals', totals);

  res.status(200).json(totals);
}

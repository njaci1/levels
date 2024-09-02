import { jackpots } from '../../lib/jackpotSnapshot';

export default async function handler(req, res) {
  const totals = jackpots;

  console.log('totals', totals);

  res.status(200).json(totals);
}

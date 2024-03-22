import { getJackpots } from '../../lib/jackpotSnapshot';
import calc from '../../lib/jackpotTotalsAggregator';

const jpcalc = calc();

export default async function handler(req, res) {
  const totals = getJackpots();

  console.log(totals);

  res.status(200).json(totals);
}

import jackpotSnapshot from '../../lib/jackpotSnapshot';

export default async function handler(req, res) {
  const totals = await jackpotSnapshot();

  // console.log('totals', totals);

  res.status(200).json(totals);
}

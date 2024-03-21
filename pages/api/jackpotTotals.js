import cron from 'node-cron';
import calculateTotals from '../../lib/jackpotTotalsAggregator';

// Run the function every 2 minutes
cron.schedule('*/2 * * * *', calculateTotals);

export default async function handler(req, res) {
  calculateTotals();

  res.status(200).json({ message: 'Cron job started' });
}

// export default handler(req, res) = {
//   res.status(200).json({ message: 'Cron job started' });
// };
